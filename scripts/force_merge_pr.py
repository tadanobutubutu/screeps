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
- Draft の PR は ready にしない。フォーク PR は対象外

マージ条件（すべて満たした PR だけをマージする）:
  1. 同じリポジトリのブランチ（フォーク PR は対象外）
  2. Draft ではない
  3. automerge:hold / needs-human ラベルがない
  4. 保護対象（.github/workflows/**、本スクリプト）を変更していない
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

使い方:
  python3 scripts/force_merge_pr.py               # open PR を古い順に判定する
  python3 scripts/force_merge_pr.py 123 456       # 指定した PR だけを判定する
  python3 scripts/force_merge_pr.py --dry-run     # 判定のみ（マージ・ラベル付けはしない）
  --push-every / --runtime は旧ワークフローとの互換のため受け付けて無視する
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
DEFAULT_BATCH = 30
PR_FIELDS = (
    "number,title,isDraft,isCrossRepository,baseRefName,headRefOid,"
    "labels,mergeStateStatus,statusCheckRollup"
)

_label_ready = False


def gh(args):
    return subprocess.run(["gh", *args], capture_output=True, text=True)


def gh_json(args):
    res = gh(args)
    if res.returncode != 0:
        print(f"gh {' '.join(args[:2])} failed: {res.stderr.strip()[:300]}")
        return None
    return json.loads(res.stdout) if res.stdout.strip() else None


def gh_raw(repo, path, ref):
    """ref 時点のファイル本文を返す。存在しなければ None。"""
    url = f"repos/{repo}/contents/{quote(path)}?ref={quote(ref)}"
    res = gh(["api", "-H", "Accept: application/vnd.github.raw", url])
    return res.stdout if res.returncode == 0 else None


def list_pr_files(repo, number):
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


def check_state(rollup):
    """CI の集計。戻り値は fail / pending / pass / none のいずれか。"""
    if not rollup:
        return "none"
    failing = pending = passing = False
    for check in rollup:
        if "state" in check:  # StatusContext
            if check["state"] in ("FAILURE", "ERROR"):
                failing = True
            elif check["state"] in ("PENDING", "EXPECTED"):
                pending = True
            elif check["state"] == "SUCCESS":
                passing = True
        else:  # CheckRun
            if check.get("status") != "COMPLETED":
                pending = True
            elif check.get("conclusion") == "SUCCESS":
                passing = True
            elif check.get("conclusion") not in ("NEUTRAL", "SKIPPED"):
                failing = True
    if failing:
        return "fail"
    if pending:
        return "pending"
    return "pass" if passing else "none"


def decide(pr, files, base_lines, main_js_problem, touched):
    """API を呼ばずに判定する。戻り値は (action, reason)。"""
    labels = {label["name"] for label in pr.get("labels") or []}
    paths = [f["filename"] for f in files]

    if pr.get("isDraft"):
        return "skip", "draft"
    if pr.get("isCrossRepository"):
        return "skip", "fork PR"
    if labels & HOLD_LABELS:
        return "skip", f"hold label: {', '.join(sorted(labels & HOLD_LABELS))}"

    for path in paths:
        if path.startswith(PROTECTED_PREFIXES) or path in PROTECTED_FILES:
            return "hold", f"protected file changed: {path}"
    for f in files:
        base = base_lines.get(f["filename"], 0)
        if base >= SHRINK_MIN_LINES and f.get("deletions", 0) >= SHRINK_RATIO * base:
            return "hold", f"{f['filename']}: {f['deletions']} of {base} lines deleted"
    if main_js_problem:
        return "hold", main_js_problem

    state = check_state(pr.get("statusCheckRollup"))
    if state != "pass":
        reasons = {
            "fail": "CI failing",
            "pending": "CI pending",
            "none": "no CI checks",
        }
        return "skip", reasons[state]

    merge_state = pr.get("mergeStateStatus")
    if merge_state == "DIRTY":
        return "hold", "merge conflict"
    if merge_state == "BEHIND":
        return "update", "behind base branch"
    if merge_state != "CLEAN":
        return "skip", f"merge state {merge_state}"

    overlap = sorted(set(paths) & touched)
    if overlap:
        return "skip", f"{overlap[0]} already merged in this run"
    return "merge", "all gates passed"


def evaluate(repo, pr, touched):
    """PR の事実を集めて判定する。戻り値は (files, (action, reason))。"""
    base = pr.get("baseRefName") or "main"
    files = list_pr_files(repo, pr["number"])

    base_text, base_lines = {}, {}
    for f in files:
        if f.get("status") == "added":
            continue
        text = gh_raw(repo, f["filename"], base)
        if text is not None:
            base_text[f["filename"]] = text
            base_lines[f["filename"]] = len(text.splitlines())

    main_js_problem = None
    if any(f["filename"] == LOOP_FILE for f in files):
        head = gh_raw(repo, LOOP_FILE, pr["headRefOid"]) or ""
        had_loop = LOOP_PATTERN in base_text.get(LOOP_FILE, "")
        if had_loop and LOOP_PATTERN not in head:
            main_js_problem = f"{LOOP_FILE} loses {LOOP_PATTERN}"
        elif CONFLICT_RE.search(head):
            main_js_problem = f"{LOOP_FILE} contains conflict markers"

    return files, decide(pr, files, base_lines, main_js_problem, touched)


def ensure_label(repo):
    global _label_ready
    if not _label_ready:
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
        _label_ready = True


def hold_pr(repo, number):
    ensure_label(repo)
    gh(["pr", "edit", str(number), "-R", repo, "--add-label", "needs-human"])


def update_pr(repo, pr):
    gh(
        [
            "api",
            "-X",
            "PUT",
            f"repos/{repo}/pulls/{pr['number']}/update-branch",
            "-f",
            f"expected_head_sha={pr['headRefOid']}",
        ]
    )


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


def write_summary(lines):
    for line in lines:
        print(line)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as fh:
            fh.write("## 自動マージゲート\n\n")
            fh.writelines(f"- {line}\n" for line in lines)


def main(argv=None):
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
    args = parser.parse_args(argv)
    dry_run = args.dry_run or os.environ.get("DRY_RUN", "").lower() in ("1", "true")

    repo = os.environ.get("GITHUB_REPOSITORY")
    if not repo:
        info = gh_json(["repo", "view", "--json", "nameWithOwner"])
        if not info:
            return 1
        repo = info["nameWithOwner"]

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
                "--limit",
                str(args.batch),
                "--json",
                PR_FIELDS,
            ]
        )
        if prs is None:
            return 1
    prs.sort(key=lambda pr: pr["number"])

    touched = set()
    merges = 0
    lines = [f"mode: {'dry-run' if dry_run else 'live'}, candidates: {len(prs)}"]
    for pr in prs:
        number = pr["number"]
        try:
            files, (action, reason) = evaluate(repo, pr, touched)
        except Exception as exc:  # 判定できない PR は何もしない（安全側）
            lines.append(f"#{number}: skip (evaluation error: {exc})")
            continue

        if action == "merge" and merges >= MAX_MERGES_PER_RUN:
            action, reason = "skip", f"merge limit {MAX_MERGES_PER_RUN} reached"

        status = f"{action}: {reason}"
        if action == "hold" and not dry_run:
            hold_pr(repo, number)
        elif action == "update" and not dry_run:
            update_pr(repo, pr)
        elif action == "merge":
            error = None if dry_run else merge_pr(repo, pr)
            if dry_run:
                status = "would merge"
            elif error:
                status = f"merge failed: {error}"
            else:
                status = "merged"
            if dry_run or not error:
                touched.update(f["filename"] for f in files)
                merges += 1
        lines.append(f"#{number} {pr['title'][:60]!r}: {status}")

    write_summary(lines)
    return 0


if __name__ == "__main__":
    sys.exit(main())
