#!/usr/bin/env python3
"""
scripts/force_merge_pr.py

自動マージゲート（安全版）。条件を満たした PR だけを自動でマージする。

旧版は PR を git merge して main に直接 push し、衝突時は PR 側のファイル全体を
採用していた（git checkout --theirs）。そのため main.js の内容が繰り返し消えた。
この版は次の方針に変える。

- ローカルの git merge / git push は行わず、GitHub API でマージする
- マージは検証時の head SHA を指定する。検証後に PR が更新されていればマージは拒否される
- 競合は AI や theirs で解決せず、needs-human ラベルを付けて人に渡す
- 自動化の設定（.github/workflows/** と本スクリプト）を変える PR は自動マージしない
- 大量の行を消す変更や、main.js から exports.loop が消える変更は保留する
- リネームされたファイルは、変更前のパスも同じ基準で確認する
- 取得に失敗した場合は判定せず、安全側（スキップ）に倒す
- Draft の PR は ready にしない。フォーク PR は対象外

マージ条件（すべて満たした PR だけをマージする）:
  1. 同じリポジトリのブランチ（フォーク PR は対象外）
  2. Draft ではない
  3. automerge:hold / needs-human ラベルがない
  4. 保護対象（.github/workflows/**、本スクリプト）を変更・リネームしていない
  5. 行数 50 以上のファイルの 60% 以上を削除していない
  6. main.js を変更する場合、変更前に exports.loop があれば変更後も残っており、
     コンフリクトマーカーがない
  7. CI チェックが 1 件以上あり、すべて成功している（保留中・失敗は対象外）
  8. mergeStateStatus が CLEAN

判定:
  merge  : 条件を満たしたのでマージする
  hold   : 人の判断が必要。needs-human を付ける（人がラベルを外すまで対象外）
  update : BEHIND。update-branch で最新化し、次回の実行でマージする
  skip   : 今回は対象外（draft、CI 待ち、CI 失敗、CI なしなど）

1 回の実行では、同じファイルを変更する PR を 1 件だけマージし、マージ数にも上限を設ける。
対象の PR は、検索段階で draft や保留ラベル付きを除き、古い順に取得する。

使い方:
  python3 scripts/force_merge_pr.py               # 対象の open PR を古い順に判定する
  python3 scripts/force_merge_pr.py 123 456       # 指定した PR だけを判定する
  python3 scripts/force_merge_pr.py --dry-run     # 判定のみ（マージ・ラベル付けはしない）
  --push-every / --runtime は旧ワークフローとの互換のため受け付けて無視する

注意: GitHub は Actions が作成した check suite では check_suite イベントを起動しない。
そのため Actions の CI 完了後の反映は、定期 sweep（15 分ごと）に任せる。
"""

import argparse
import json
import os
import re
import subprocess
import sys
from urllib.parse import quote

HOLD_LABELS = {"automerge:hold", "needs-human"}
PROTECTED_PREFIXES = (".github/workflows/",)
PROTECTED_FILES = {"scripts/force_merge_pr.py"}
LOOP_FILE = "main.js"
LOOP_PATTERN = "exports.loop"
CONFLICT_RE = re.compile(r"^(<<<<<<< |=======$|>>>>>>> )", re.MULTILINE)
SHRINK_MIN_LINES = 50
SHRINK_RATIO = 0.6
MAX_MERGES_PER_RUN = 10
DEFAULT_BATCH = 100
GH_TIMEOUT_SECONDS = 120
PR_FIELDS = (
    "number,title,isDraft,isCrossRepository,baseRefName,headRefOid,"
    "labels,mergeStateStatus,statusCheckRollup"
)
# 検索段階で対象外を除き、古い順に取得する（最新 N 件だけを見ないようにするため）
PR_SEARCH = 'sort:created-asc draft:false -label:needs-human -label:"automerge:hold"'
CI_SKIP_REASONS = {
    "fail": "CI failing",
    "pending": "CI pending",
    "none": "no CI checks",
}
CHECK_OUTCOMES = {
    "SUCCESS": "pass",
    "PENDING": "pending",
    "EXPECTED": "pending",
    "FAILURE": "fail",
    "ERROR": "fail",
}


def gh(args):
    """gh CLI を実行し、結果（CompletedProcess）を返す。タイムアウトは失敗扱いにする。"""
    try:
        return subprocess.run(
            ["gh", *args],
            capture_output=True,
            text=True,
            check=False,
            timeout=GH_TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired:
        return subprocess.CompletedProcess(["gh", *args], 124, "", "gh timed out")


def gh_json(args):
    """gh の JSON 出力を解析して返す。失敗時は None。"""
    res = gh(args)
    if res.returncode != 0:
        print(f"gh {' '.join(args[:2])} failed: {res.stderr.strip()[:300]}")
        return None
    return json.loads(res.stdout) if res.stdout.strip() else None


def gh_raw(repo, path, ref):
    """ref 時点のファイル本文を返す。ファイルが無い（404）場合は None。それ以外の失敗は例外にする。"""
    url = f"repos/{repo}/contents/{quote(path)}?ref={quote(ref)}"
    res = gh(["api", "-H", "Accept: application/vnd.github.raw", url])
    if res.returncode == 0:
        return res.stdout
    if "HTTP 404" in res.stderr:
        return None
    raise RuntimeError(f"fetch {path}@{ref}: {res.stderr.strip()[:200]}")


def base_path(f):
    """変更前のファイルパス。リネームされていなければ現在のパスと同じ。"""
    return f.get("previous_filename") or f["filename"]


def list_pr_files(repo, number):
    """PR の変更ファイル一覧を全ページ分取得する。"""
    files, page = [], 1
    while True:
        res = gh(["api", f"repos/{repo}/pulls/{number}/files?per_page=100&page={page}"])
        if res.returncode != 0:
            raise RuntimeError(f"files of #{number}: {res.stderr.strip()[:200]}")
        batch = json.loads(res.stdout)
        files.extend(batch)
        if len(batch) < 100:
            return files
        page += 1


def _check_outcome(check):
    """1 件のチェックの結果を返す。pass / pending / fail / ignored のいずれか。"""
    if "state" in check:  # StatusContext
        return CHECK_OUTCOMES.get(check["state"], "ignored")
    if check.get("status") != "COMPLETED":
        return "pending"
    conclusion = check.get("conclusion")
    if conclusion == "SUCCESS":
        return "pass"
    if conclusion in ("NEUTRAL", "SKIPPED"):
        return "ignored"
    return "fail"


def check_state(rollup):
    """CI の集計。戻り値は fail / pending / pass / none のいずれか。"""
    if not rollup:
        return "none"
    outcomes = {_check_outcome(check) for check in rollup}
    if "fail" in outcomes:
        return "fail"
    if "pending" in outcomes:
        return "pending"
    return "pass" if "pass" in outcomes else "none"


def cheap_skip_reason(pr):
    """API を呼ばずに判定できる対象外の理由を返す。対象なら None。"""
    labels = {label["name"] for label in pr.get("labels") or []}
    if pr.get("isDraft"):
        return "draft"
    if pr.get("isCrossRepository"):
        return "fork PR"
    if labels & HOLD_LABELS:
        return f"hold label: {', '.join(sorted(labels & HOLD_LABELS))}"
    return None


def hold_reason(files, base_lines, main_js_problem):
    """人の判断が必要な理由を返す。問題がなければ None。リネームは変更前のパスでも確認する。"""
    for f in files:
        for path in {f["filename"], base_path(f)}:
            if path.startswith(PROTECTED_PREFIXES) or path in PROTECTED_FILES:
                return f"protected file changed: {path}"
    for f in files:
        base = base_lines.get(base_path(f), 0)
        if base >= SHRINK_MIN_LINES and f.get("deletions", 0) >= SHRINK_RATIO * base:
            return f"{f['filename']}: {f['deletions']} of {base} lines deleted"
    return main_js_problem


def merge_decision(pr, paths, touched):
    """CI 通過後のマージ可否を判定する。戻り値は (action, reason)。"""
    merge_state = pr.get("mergeStateStatus")
    if merge_state == "DIRTY":
        return "hold", "merge conflict"
    if merge_state == "BEHIND":
        return "update", "behind base branch"
    if merge_state != "CLEAN":
        return "skip", f"merge state {merge_state}"
    overlap = sorted(paths & touched)
    if overlap:
        return "skip", f"{overlap[0]} already merged in this run"
    return "merge", "all gates passed"


def decide(pr, files, base_lines, main_js_problem, touched):
    """API を呼ばずに判定する。戻り値は (action, reason)。"""
    skip = cheap_skip_reason(pr)
    if skip:
        return "skip", skip

    reason = hold_reason(files, base_lines, main_js_problem)
    if reason:
        return "hold", reason

    state = check_state(pr.get("statusCheckRollup"))
    if state != "pass":
        return "skip", CI_SKIP_REASONS[state]
    paths = {p for f in files for p in (f["filename"], base_path(f))}
    return merge_decision(pr, paths, touched)


def check_main_js(repo, pr, files, base_text):
    """main.js の変更がループの export やマージの整合性を壊していないか確認する。問題があれば理由を返す。"""
    if not any(LOOP_FILE in (f["filename"], base_path(f)) for f in files):
        return None
    head = gh_raw(repo, LOOP_FILE, pr["headRefOid"]) or ""
    if LOOP_PATTERN in base_text.get(LOOP_FILE, "") and LOOP_PATTERN not in head:
        return f"{LOOP_FILE} loses {LOOP_PATTERN}"
    if CONFLICT_RE.search(head):
        return f"{LOOP_FILE} contains conflict markers"
    return None


def evaluate(repo, pr, touched):
    """PR の事実を集めて判定する。戻り値は (files, (action, reason))。"""
    skip = cheap_skip_reason(pr)
    if skip:
        return [], ("skip", skip)
    # CI の結果は一覧に含まれているので、先に確認して API 呼び出しを省く
    state = check_state(pr.get("statusCheckRollup"))
    if state != "pass":
        return [], ("skip", CI_SKIP_REASONS[state])

    base = pr.get("baseRefName") or "main"
    files = list_pr_files(repo, pr["number"])

    base_text, base_lines = {}, {}
    for f in files:
        if f.get("status") == "added":
            continue
        path = base_path(f)
        text = gh_raw(repo, path, base)
        if text is not None:
            base_text[path] = text
            base_lines[path] = len(text.splitlines())

    main_js_problem = check_main_js(repo, pr, files, base_text)
    return files, decide(pr, files, base_lines, main_js_problem, touched)


def hold_pr(repo, number):
    """PR に needs-human ラベルを付けて保留にする。付与できたら True。"""
    gh(
        [
            "label",
            "create",
            "needs-human",
            "-R",
            repo,
            "--color",
            "FBCA04",
            "--description",
            "自動マージを保留。人の判断が必要",
            "--force",
        ]
    )
    res = gh(["pr", "edit", str(number), "-R", repo, "--add-label", "needs-human"])
    return res.returncode == 0


def update_pr(repo, pr):
    """BEHIND の PR を base ブランチの変更で最新化する。成功したら True。"""
    res = gh(
        [
            "api",
            "-X",
            "PUT",
            f"repos/{repo}/pulls/{pr['number']}/update-branch",
            "-f",
            f"expected_head_sha={pr['headRefOid']}",
        ]
    )
    return res.returncode == 0


def merge_pr(repo, pr):
    """検証時の head SHA を指定してマージする。失敗時はエラー文字列を返す。"""
    res = gh(
        [
            "api",
            "-X",
            "PUT",
            f"repos/{repo}/pulls/{pr['number']}/merge",
            "-f",
            "merge_method=squash",
            "-f",
            f"sha={pr['headRefOid']}",
            "-f",
            f"commit_title={pr['title']} (#{pr['number']})",
        ]
    )
    return None if res.returncode == 0 else res.stderr.strip()[:200]


def run_action(repo, pr, action, dry_run):
    """保留・最新化の書き込みを行う。成功したら True（dry-run は常に True）。"""
    if dry_run:
        return True
    if action == "hold":
        return hold_pr(repo, pr["number"])
    if action == "update":
        return update_pr(repo, pr)
    return True


def confirm_conflict(repo, number):
    """DIRTY の判定を最新の mergeStateStatus で再確認する（反映遅延による誤保留を避ける）。"""
    info = gh_json(
        ["pr", "view", str(number), "-R", repo, "--json", "mergeStateStatus"]
    )
    return bool(info) and info.get("mergeStateStatus") == "DIRTY"


def resolve_action(repo, pr, action, reason):
    """書き込みの前に判定を確定させる。DIRTY は最新の状態で再確認する。"""
    if (
        action == "hold"
        and reason == "merge conflict"
        and not confirm_conflict(repo, pr["number"])
    ):
        return "skip", "merge state no longer DIRTY, re-check next run"
    return action, reason


def process_pr(repo, pr, touched, merges, dry_run):
    """1 件の PR を判定して必要な操作を行い、(状態, マージしたか) を返す。"""
    try:
        files, (action, reason) = evaluate(repo, pr, touched)
    except Exception as exc:  # 判定できない PR は何もしない（安全側）
        return f"skip (evaluation error: {exc})", False

    action, reason = resolve_action(repo, pr, action, reason)
    if action == "merge" and merges >= MAX_MERGES_PER_RUN:
        action, reason = "skip", f"merge limit {MAX_MERGES_PER_RUN} reached"
    if action != "merge":
        written = run_action(repo, pr, action, dry_run)
        suffix = "" if written else " (write failed)"
        return f"{action}: {reason}{suffix}", False

    return attempt_merge(repo, pr, files, touched, dry_run)


def attempt_merge(repo, pr, files, touched, dry_run):
    """マージを実行し、(状態, マージしたか) を返す。成功した場合は触れたパスを同じ実行内で記録する。"""
    paths = {p for f in files for p in (f["filename"], base_path(f))}
    if dry_run:
        touched.update(paths)
        return "would merge", True
    error = merge_pr(repo, pr)
    if error:
        return f"merge failed: {error}", False
    touched.update(paths)
    return "merged", True


def write_summary(lines):
    """判定結果を標準出力に出し、GitHub Actions のステップサマリーにも追記する。"""
    for line in lines:
        print(line)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as fh:
            fh.write("## 自動マージゲート\n\n")
            fh.writelines(f"- {line}\n" for line in lines)


def parse_args(argv):
    """コマンドライン引数を解釈して返す。"""
    parser = argparse.ArgumentParser(description="自動マージゲート")
    parser.add_argument(
        "numbers", nargs="*", type=int, help="判定する PR 番号（省略時は open PR 全体）"
    )
    parser.add_argument(
        "--batch", type=int, default=DEFAULT_BATCH, help="sweep で判定する PR の上限"
    )
    parser.add_argument("--dry-run", action="store_true", help="判定のみ行う")
    parser.add_argument("--push-every", type=int, help=argparse.SUPPRESS)
    parser.add_argument("--runtime", type=int, help=argparse.SUPPRESS)
    return parser.parse_args(argv)


def resolve_repo():
    """対象リポジトリ（owner/name）を返す。取得できなければ None。"""
    repo = os.environ.get("GITHUB_REPOSITORY")
    if repo:
        return repo
    info = gh_json(["repo", "view", "--json", "nameWithOwner"])
    return info["nameWithOwner"] if info else None


def load_prs(repo, args):
    """判定対象の PR を古い順に返す。open PR の取得に失敗したら None。"""
    if args.numbers:
        prs = [
            gh_json(["pr", "view", str(n), "-R", repo, "--json", PR_FIELDS])
            for n in args.numbers
        ]
        prs = [pr for pr in prs if pr]
    else:
        prs = gh_json(
            [
                "pr",
                "list",
                "-R",
                repo,
                "--state",
                "open",
                "--search",
                PR_SEARCH,
                "--limit",
                str(args.batch),
                "--json",
                PR_FIELDS,
            ]
        )
        if prs is None:
            return None
    return sorted(prs, key=lambda pr: pr["number"])


def main(argv=None):
    """引数を解釈し、対象 PR を判定してマージ・保留・最新化を実行する。"""
    args = parse_args(argv)
    dry_run = args.dry_run or os.environ.get("DRY_RUN", "").lower() in ("1", "true")

    repo = resolve_repo()
    if repo is None:
        return 1
    prs = load_prs(repo, args)
    if prs is None:
        return 1

    touched, merges = set(), 0
    lines = [f"mode: {'dry-run' if dry_run else 'live'}, candidates: {len(prs)}"]
    for pr in prs:
        status, merged = process_pr(repo, pr, touched, merges, dry_run)
        if merged:
            merges += 1
        lines.append(f"#{pr['number']} {pr['title'][:60]!r}: {status}")

    write_summary(lines)
    return 0


if __name__ == "__main__":
    sys.exit(main())
