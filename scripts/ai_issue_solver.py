import json
import os
import re
import subprocess
import sys
import threading

from ai_providers import (
    call_gemini,
    call_kilo_gateway,
    call_openrouter,
    call_ovh_anonymous,
    call_pollinations_get,
    clean_plain_response,
    extract_code_block,
    is_valid_response,
    normalize_token,
)

MODEL_NAMES = [
    "Gemini-Direct",
    "OpenRouter",
    "Pollinations-Get",
    "Kilo-Gateway",
    "OVH-Anonymous",
]


def comment_on_issue(issue_no, body):
    subprocess.run(
        ["gh", "issue", "comment", str(issue_no), "--body", body],
        check=False,
    )


def prepare_candidate(raw_text, original_code):
    if not raw_text:
        return None

    text = clean_plain_response(raw_text)
    code = extract_code_block(text)

    original_lines = max(original_code.count("\n") + 1, 1)
    candidate_lines = max(code.count("\n") + 1, 1)
    if original_lines >= 100 and candidate_lines < original_lines * 0.5:
        print(
            f"Rejected candidate: too short ({candidate_lines} lines vs {original_lines})"
        )
        return None

    if not is_valid_response(code, min_length=50):
        return None

    return code


def run_tests():
    return subprocess.run(
        ["npm", "test", "--", "tests/main.test.js"],
        capture_output=True,
        text=True,
    )


def parse_test_counts(output):
    match = re.search(r"Tests:\s+(\d+) failed,\s+(\d+) passed", output)
    if match:
        return int(match.group(2)), int(match.group(1))
    match = re.search(r"Tests:\s+(\d+) passed", output)
    if match:
        return int(match.group(1)), 0
    return 0, 0


def syntax_check():
    return subprocess.run(["node", "--check", "main.js"], capture_output=True, text=True)


def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    openrouter_token = normalize_token(os.environ.get("OPENROUTER_TOKEN"))
    gemini_api_key = normalize_token(os.environ.get("GEMINI_API_KEY"))

    if not issue_no:
        print("Missing ISSUE_NUMBER")
        sys.exit(1)

    try:
        res = subprocess.run(
            ["gh", "issue", "view", str(issue_no), "--json", "title,body"],
            capture_output=True,
            text=True,
            check=True,
        )
        ctx = json.loads(res.stdout)
    except Exception as exc:
        print(f"Failed to fetch issue details: {exc}")
        sys.exit(1)

    original_code = ""
    if os.path.exists("main.js"):
        with open("main.js", "r", encoding="utf-8") as handle:
            original_code = handle.read()

    prompt = (
        f"Fix this JS code error for the file main.js.\n"
        f"Issue Title: {ctx['title']}\n"
        f"Issue Body: {ctx['body']}\n\n"
        "CRITICAL RULES:\n"
        "- Modify main.js MINIMALLY. Do NOT replace the entire file.\n"
        "- Preserve ALL existing Screeps bot functionality, globals, and imports.\n"
        "- Provide ONLY the complete updated file content inside a ```javascript code block.\n"
    )

    results = [None] * len(MODEL_NAMES)

    def run_provider(idx, func, *args):
        try:
            print(f"Thread [{MODEL_NAMES[idx]}]: Starting...")
            res = func(*args)
            candidate = prepare_candidate(res, original_code)
            if candidate:
                results[idx] = candidate
                print(f"Thread [{MODEL_NAMES[idx]}]: Success")
            else:
                print(f"Thread [{MODEL_NAMES[idx]}]: Invalid or rejected response")
        except Exception as exc:
            print(f"Thread [{MODEL_NAMES[idx]}]: Failed: {exc}")

    threads = []
    if gemini_api_key:
        threads.append(
            threading.Thread(
                target=run_provider, args=(0, call_gemini, prompt, gemini_api_key)
            )
        )
    if openrouter_token:
        threads.append(
            threading.Thread(
                target=run_provider, args=(1, call_openrouter, prompt, openrouter_token)
            )
        )
    threads.append(
        threading.Thread(
            target=run_provider, args=(2, call_pollinations_get, prompt, "openai-fast")
        )
    )
    threads.append(
        threading.Thread(target=run_provider, args=(3, call_kilo_gateway, prompt))
    )
    threads.append(
        threading.Thread(target=run_provider, args=(4, call_ovh_anonymous, prompt))
    )

    print(f"Launching {len(threads)} concurrent AI models in parallel...")
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join(timeout=90)

    baseline_run = run_tests()
    baseline_passes, baseline_failures = parse_test_counts(
        baseline_run.stdout + baseline_run.stderr
    )
    print(
        f"Baseline main.test.js: {baseline_passes} passed, {baseline_failures} failed"
    )
    if baseline_passes == 0:
        msg = (
            "🤖 Sakana Multi-Agent Solver: ベースラインの `main.test.js` が全失敗のため中止。\n"
            "リポジトリの健全性を先に修復してください。"
        )
        print(msg)
        comment_on_issue(issue_no, msg)
        sys.exit(1)

    valid_candidates = []

    print("\n--- Collaborative Validation & Evaluation Phase ---")
    for idx, candidate in enumerate(results):
        if not candidate:
            print(f"Candidate {MODEL_NAMES[idx]}: No valid response.")
            continue

        print(f"\nEvaluating candidate from {MODEL_NAMES[idx]}...")
        with open("main.js", "w", encoding="utf-8") as handle:
            handle.write(candidate)

        if syntax_check().returncode != 0:
            print(f"❌ Candidate {MODEL_NAMES[idx]} FAILED syntax check.")
            continue

        test_run = run_tests()
        passes, failures = parse_test_counts(test_run.stdout + test_run.stderr)
        if test_run.returncode == 0 and passes >= baseline_passes:
            print(f"✅ Candidate {MODEL_NAMES[idx]} PASSED ({passes} tests)!")
            valid_candidates.append((idx, candidate, passes))
        else:
            print(
                f"❌ Candidate {MODEL_NAMES[idx]} FAILED "
                f"({passes} passed vs baseline {baseline_passes})"
            )

    with open("main.js", "w", encoding="utf-8") as handle:
        handle.write(original_code)

    if not valid_candidates:
        msg = (
            "🤖 Sakana Multi-Agent Solver: 全候補がテスト不合格のため PR を作成しません。\n\n"
            f"並行実行: {', '.join(MODEL_NAMES)}\n"
            "検証: `npm test -- tests/main.test.js` + `node --check`\n"
            "手動対応が必要です。"
        )
        print(msg)
        comment_on_issue(issue_no, msg)
        sys.exit(1)

    valid_candidates.sort(key=lambda item: item[2], reverse=True)
    winner_idx, winning_code, winner_passes = valid_candidates[0]
    print(f"\n🏆 Selected winner: {MODEL_NAMES[winner_idx]} ({winner_passes} tests)")

    subprocess.run(["git", "config", "--global", "user.name", "AI Issue Solver"])
    subprocess.run(["git", "config", "--global", "user.email", "ai-issue-solver@screeps.local"])

    branch = f"fix/ai-{issue_no}"
    checkout = subprocess.run(["git", "checkout", "-b", branch], capture_output=True, text=True)
    if checkout.returncode != 0:
        subprocess.run(["git", "checkout", branch], check=True)

    with open("main.js", "w", encoding="utf-8") as handle:
        handle.write(winning_code)

    subprocess.run(["git", "add", "main.js"], check=True)
    subprocess.run(
        [
            "git",
            "commit",
            "--no-verify",
            "-m",
            f"fix: resolve issue #{issue_no} via {MODEL_NAMES[winner_idx]} (test-verified)",
        ],
        check=True,
    )
    subprocess.run(["git", "push", "-f", "origin", branch], check=True)
    subprocess.run(
        [
            "gh",
            "pr",
            "create",
            "--title",
            f"Fix #{issue_no} - {MODEL_NAMES[winner_idx]} (test-verified)",
            "--body",
            (
                f"Closes #{issue_no}\n\n"
                f"Winner: `{MODEL_NAMES[winner_idx]}`\n"
                "Validated by `npm test -- tests/main.test.js`"
            ),
            "--head",
            branch,
            "--base",
            "main",
        ],
        check=True,
    )


if __name__ == "__main__":
    main()