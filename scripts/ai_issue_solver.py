import json
import os
import re
import subprocess
import sys
import threading

from ai_providers import (
    build_parallel_providers,
    clean_plain_response,
    extract_code_block,
    is_valid_response,
    normalize_token,
)

MAX_REFINEMENT_ROUNDS = 4
THREAD_TIMEOUT_SEC = 90


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
    if original_lines >= 100 and candidate_lines < 20:
        print(f"Rejected: candidate too short ({candidate_lines} vs {original_lines})")
        return None

    if not is_valid_response(code, min_length=30):
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
    return subprocess.run(
        ["node", "--check", "main.js"], capture_output=True, text=True
    )


def evaluate_candidate(code, original_code):
    with open("main.js", "w", encoding="utf-8") as handle:
        handle.write(code)

    syntax = syntax_check()
    syntax_ok = syntax.returncode == 0
    test_run = run_tests()
    combined = test_run.stdout + test_run.stderr
    passes, failures = parse_test_counts(combined)
    passed_all = test_run.returncode == 0

    return {
        "syntax_ok": syntax_ok,
        "passes": passes,
        "failures": failures,
        "passed_all": passed_all,
        "output": combined[-2000:],
    }


def run_parallel_round(prompt, providers, original_code):
    results = {}
    lock = threading.Lock()

    def worker(name, caller):
        try:
            print(f"Thread [{name}]: Starting...")
            raw = caller(prompt)
            candidate = prepare_candidate(raw, original_code)
            with lock:
                results[name] = {"raw": raw, "code": candidate}
            status = "Success" if candidate else "Invalid response"
            print(f"Thread [{name}]: {status}")
        except Exception as exc:
            print(f"Thread [{name}]: Failed: {exc}")
            with lock:
                results[name] = {"raw": None, "code": None, "error": str(exc)}

    threads = [
        threading.Thread(target=worker, args=(name, caller))
        for name, caller in providers
    ]
    print(f"Launching {len(threads)} concurrent AI models...")
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join(timeout=THREAD_TIMEOUT_SEC)

    return results


def build_feedback(evaluations):
    lines = [
        "\n\n--- PREVIOUS ATTEMPT FAILED — FIX USING THIS FEEDBACK ---",
        "The following candidates failed `npm test -- tests/main.test.js`:",
    ]
    for name, ev in list(evaluations.items())[:6]:
        lines.append(
            f"- {name}: passes={ev['passes']}, failures={ev['failures']}, "
            f"syntax_ok={ev['syntax_ok']}"
        )
        snippet = ev.get("output", "")[-400:]
        if snippet:
            lines.append(f"  Error snippet: {snippet}")
    lines.append(
        "Regenerate the COMPLETE main.js with fixes. "
        "Preserve all existing Screeps functionality."
    )
    return "\n".join(lines)


def select_best_candidate(candidates):
    """スコア順: 全テスト合格 > パス数 > 構文OK > コード長。"""
    if not candidates:
        return None, None, {}

    def score(item):
        _name, _code, ev, _round = item
        return (
            1 if ev.get("passed_all") else 0,
            ev.get("passes", 0),
            1 if ev.get("syntax_ok") else 0,
            len(_code or ""),
        )

    candidates.sort(key=score, reverse=True)
    name, code, ev, round_no = candidates[0]
    return name, code, {**ev, "round": round_no}


def create_pr(issue_no, code, provider_name, test_info):
    subprocess.run(["git", "config", "--global", "user.name", "AI Issue Solver"])
    subprocess.run(
        ["git", "config", "--global", "user.email", "ai-issue-solver@screeps.local"]
    )

    branch = f"fix/ai-{issue_no}"
    checkout = subprocess.run(
        ["git", "checkout", "-b", branch], capture_output=True, text=True
    )
    if checkout.returncode != 0:
        subprocess.run(["git", "checkout", branch], check=False)
        subprocess.run(["git", "reset", "--hard"], check=False)
        subprocess.run(["git", "checkout", branch], check=True)

    with open("main.js", "w", encoding="utf-8") as handle:
        handle.write(code)

    subprocess.run(["git", "add", "main.js"], check=True)
    verified = "test-verified" if test_info.get("passed_all") else "best-effort"
    subprocess.run(
        [
            "git",
            "commit",
            "--no-verify",
            "-m",
            f"fix: resolve issue #{issue_no} via {provider_name} ({verified})",
        ],
        check=True,
    )
    subprocess.run(["git", "push", "-f", "origin", branch], check=True)

    test_summary = (
        f"passed_all={test_info.get('passed_all')}, "
        f"passes={test_info.get('passes')}, "
        f"round={test_info.get('round', 0)}"
    )
    subprocess.run(
        [
            "gh",
            "pr",
            "create",
            "--title",
            f"Fix #{issue_no} - {provider_name} ({verified})",
            "--body",
            (
                f"Closes #{issue_no}\n\n"
                f"Provider: `{provider_name}`\n"
                f"Self-refinement loop: up to {MAX_REFINEMENT_ROUNDS} rounds\n"
                f"Test result: {test_summary}\n\n"
                "Parallel providers: Gemini, OpenRouter×6, Pollinations GET/POST, "
                "Kilo, OVH, Puter, HuggingFace, AI Horde"
            ),
            "--head",
            branch,
            "--base",
            "main",
        ],
        check=True,
    )


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

    base_prompt = (
        f"Fix this JS code error for the file main.js.\n"
        f"Issue Title: {ctx['title']}\n"
        f"Issue Body: {ctx['body']}\n\n"
        "CRITICAL RULES:\n"
        "- Modify main.js MINIMALLY. Do NOT replace the entire file unless necessary.\n"
        "- Preserve ALL existing Screeps bot functionality, globals, and imports.\n"
        "- Provide ONLY the complete updated file content inside a ```javascript code block.\n"
    )

    providers = build_parallel_providers(gemini_api_key, openrouter_token)
    print(f"Configured {len(providers)} parallel providers")

    all_candidates = []
    feedback = ""
    winning = None

    for round_no in range(1, MAX_REFINEMENT_ROUNDS + 1):
        print(
            f"\n========== Refinement Round {round_no}/{MAX_REFINEMENT_ROUNDS} =========="
        )
        prompt = base_prompt + feedback

        round_results = run_parallel_round(prompt, providers, original_code)

        round_evaluations = {}

        for name, result in round_results.items():
            code = result.get("code")
            if not code:
                continue

            print(f"\nEvaluating {name} (round {round_no})...")
            ev = evaluate_candidate(code, original_code)
            ev["round"] = round_no
            all_candidates.append((name, code, ev, round_no))
            round_evaluations[name] = ev

            if ev["passed_all"]:
                print(f"✅ {name} PASSED all tests in round {round_no}!")
                winning = (name, code, ev)
                break
            print(
                f"❌ {name}: passes={ev['passes']}, failures={ev['failures']}, "
                f"syntax={ev['syntax_ok']}"
            )

        with open("main.js", "w", encoding="utf-8") as handle:
            handle.write(original_code)

        if winning:
            break

        if round_no < MAX_REFINEMENT_ROUNDS:
            feedback = build_feedback(round_evaluations)
            print(
                f"\n🔄 Feeding test errors back to all models for round {round_no + 1}..."
            )

    if winning:
        provider_name, code, test_info = winning
        print(f"\n🏆 Test-verified winner: {provider_name}")
    else:
        provider_name, code, test_info = select_best_candidate(all_candidates)
        if not code:
            code = original_code
            provider_name = "fallback-original"
            test_info = {"passed_all": False, "passes": 0, "round": 0}
            print("\n⚠️ No valid AI candidate — using original main.js as best-effort")
        else:
            print(
                f"\n⚠️ No test pass — best-effort PR from {provider_name} "
                f"(passes={test_info.get('passes')})"
            )

    create_pr(issue_no, code, provider_name, test_info)

    status = (
        "✅ test-verified"
        if test_info.get("passed_all")
        else "⚠️ best-effort (tests failing)"
    )
    comment_on_issue(
        issue_no,
        (
            f"🤖 Sakana Self-Refinement Solver: PR created ({status})\n\n"
            f"- Provider: `{provider_name}`\n"
            f"- Rounds: {test_info.get('round', MAX_REFINEMENT_ROUNDS)}\n"
            f"- Tests: passes={test_info.get('passes')}, "
            f"passed_all={test_info.get('passed_all')}\n"
            f"- Parallel providers used: {len(providers)}"
        ),
    )


if __name__ == "__main__":
    main()
