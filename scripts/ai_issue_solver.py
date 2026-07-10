import json
import os
import re
import subprocess
import sys

from ai_providers import (
    clean_plain_response,
    extract_code_block,
    generate_concurrent_all,
    is_valid_response,
    normalize_token,
)

MAX_REFINEMENT_ROUNDS = 3


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
    return subprocess.run(["node", "--check", "main.js"], capture_output=True, text=True)


def evaluate_candidate(code):
    with open("main.js", "w", encoding="utf-8") as handle:
        handle.write(code)
    syntax_ok = syntax_check().returncode == 0
    test_run = run_tests()
    combined = test_run.stdout + test_run.stderr
    passes, failures = parse_test_counts(combined)
    return {
        "syntax_ok": syntax_ok,
        "passes": passes,
        "failures": failures,
        "passed_all": test_run.returncode == 0,
        "output": combined[-2000:],
    }


def build_feedback(evaluations):
    lines = [
        "\n\n--- PREVIOUS ATTEMPT FAILED — FIX USING THIS FEEDBACK ---",
        "Candidates failed `npm test -- tests/main.test.js`:",
    ]
    for name, ev in list(evaluations.items())[:8]:
        lines.append(
            f"- {name}: passes={ev['passes']}, failures={ev['failures']}, "
            f"syntax_ok={ev['syntax_ok']}"
        )
        snippet = ev.get("output", "")[-300:]
        if snippet:
            lines.append(f"  Errors: {snippet}")
    lines.append("Regenerate COMPLETE main.js preserving all Screeps functionality.")
    return "\n".join(lines)


def select_best(candidates):
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
    subprocess.run(["git", "config", "--global", "user.email", "ai-issue-solver@screeps.local"])

    branch = f"fix/ai-{issue_no}"
    checkout = subprocess.run(["git", "checkout", "-b", branch], capture_output=True, text=True)
    if checkout.returncode != 0:
        subprocess.run(["git", "checkout", branch], check=False)

    with open("main.js", "w", encoding="utf-8") as handle:
        handle.write(code)

    subprocess.run(["git", "add", "main.js"], check=True)
    verified = "test-verified" if test_info.get("passed_all") else "best-effort"
    subprocess.run(
        ["git", "commit", "--no-verify", "-m", f"fix: #{issue_no} via {provider_name} ({verified})"],
        check=True,
    )
    subprocess.run(["git", "push", "-f", "origin", branch], check=True)
    subprocess.run(
        [
            "gh", "pr", "create",
            "--title", f"Fix #{issue_no} - {provider_name} ({verified})",
            "--body",
            (
                f"Closes #{issue_no}\n\n"
                f"Provider: `{provider_name}`\n"
                f"Self-refinement: {MAX_REFINEMENT_ROUNDS} rounds via `generate_concurrent_all()`\n"
                f"Tests: passed_all={test_info.get('passed_all')}, passes={test_info.get('passes')}"
            ),
            "--head", branch, "--base", "main",
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

    res = subprocess.run(
        ["gh", "issue", "view", str(issue_no), "--json", "title,body"],
        capture_output=True, text=True, check=True,
    )
    ctx = json.loads(res.stdout)

    original_code = ""
    if os.path.exists("main.js"):
        with open("main.js", "r", encoding="utf-8") as handle:
            original_code = handle.read()

    base_prompt = (
        f"Fix this JS code error for the file main.js.\n"
        f"Issue Title: {ctx['title']}\n"
        f"Issue Body: {ctx['body']}\n\n"
        "RULES: Modify main.js minimally. Preserve all Screeps bot code.\n"
        "Provide ONLY complete main.js inside a ```javascript code block.\n"
    )

    all_candidates = []
    feedback = ""
    winning = None

    for round_no in range(1, MAX_REFINEMENT_ROUNDS + 1):
        print(f"\n========== Round {round_no}/{MAX_REFINEMENT_ROUNDS} ==========")
        prompt = base_prompt + feedback

        raw_results = generate_concurrent_all(prompt, gemini_api_key, openrouter_token)
        print(f"Parallel responses: {len(raw_results)} from {list(raw_results.keys())}")

        round_evaluations = {}
        for name, raw in raw_results.items():
            code = prepare_candidate(raw, original_code)
            if not code:
                continue
            print(f"Evaluating {name}...")
            ev = evaluate_candidate(code)
            ev["round"] = round_no
            all_candidates.append((name, code, ev, round_no))
            round_evaluations[name] = ev
            if ev["passed_all"]:
                print(f"✅ {name} passed all tests!")
                winning = (name, code, ev)
                break
            print(f"❌ {name}: passes={ev['passes']}, syntax={ev['syntax_ok']}")

        with open("main.js", "w", encoding="utf-8") as handle:
            handle.write(original_code)

        if winning:
            break
        if round_no < MAX_REFINEMENT_ROUNDS:
            feedback = build_feedback(round_evaluations)

    if winning:
        provider_name, code, test_info = winning
    else:
        provider_name, code, test_info = select_best(all_candidates)
        if not code:
            code = original_code
            provider_name = "fallback-original"
            test_info = {"passed_all": False, "passes": 0, "round": MAX_REFINEMENT_ROUNDS}

    create_pr(issue_no, code, provider_name, test_info)
    status = "✅ verified" if test_info.get("passed_all") else "⚠️ best-effort"
    comment_on_issue(
        issue_no,
        f"🤖 Solver PR created ({status}) — provider=`{provider_name}`, "
        f"rounds={test_info.get('round')}, passes={test_info.get('passes')}",
    )


if __name__ == "__main__":
    main()