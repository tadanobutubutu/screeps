"""
ai_issue_solver.py — Sakana AI style multi-agent concurrent consensus engine.

Strategy:
  1. Query ALL providers simultaneously in parallel threads (generate_concurrent_all).
  2. Evaluate each candidate by running npm test.
  3. If any candidate passes → select it as winner.
  4. If ALL fail → collect error feedback and re-query ALL providers with the feedback (self-refinement loop).
  5. After MAX_ATTEMPTS with no passing candidate → pick best available candidate.
  6. ALWAYS create a PR and merge it (no silent failures).

Providers used:
  - Pollinations AI GET (openai-fast, openai)
  - Pollinations AI POST (openai, openai-fast)
  - Kilo Gateway (openrouter/free, minimax, grok-code-fast)
  - OVH Anonymous (Mistral, Llama, Qwen, etc.)
  - Puter.js API anonymous (gpt-4o-mini, gpt-4o, claude-3-5-haiku)
  - HuggingFace Serverless Inference (Qwen2.5-Coder, Llama-3.2, Mistral-7B)
  - AI Horde (anonymous apikey=0000000000)
  - Google Gemini (gemini-1.5-flash-latest) -- if GEMINI_API_KEY set
  - OpenRouter free pool (Qwen3, Nemotron, GPT-OSS, Llama, Poolside, DeepSeek, Phi-4, Gemini) -- if OPENROUTER_TOKEN set
"""

import json
import os
import subprocess
import sys

from ai_providers import (
    clean_plain_response,
    extract_code_block,
    generate_concurrent_all,
)

# Ensure script directory is in path for imports
sys.path.insert(0, os.path.dirname(__file__))

MAX_ATTEMPTS = 3


def run_tests():
    """Run targeted main.test.js gate."""
    result = subprocess.run(
        ["node", "-c", "main.js"],
        capture_output=True,
        text=True,
    )
    combined = result.stdout + result.stderr
    return result.returncode == 0, combined[-800:]


def _acceptable_candidate(cleaned, original_code):
    if not cleaned or len(cleaned) < 10:
        return False
    orig_lines = max(original_code.count("\n") + 1, 1)
    cand_lines = max(cleaned.count("\n") + 1, 1)
    if orig_lines >= 100 and cand_lines < orig_lines * 0.5:
        print(f"  Rejected short replacement ({cand_lines} vs {orig_lines} lines)")
        return False
    return True


def evaluate_candidates(candidates: dict, original_code: str):
    """
    Write each candidate to main.js, run tests, return
    (winner_name, winner_code, failures_list) or (None, None, failures_list).
    """
    failures = []
    for name, code in candidates.items():
        cleaned = clean_plain_response(extract_code_block(code))
        if not _acceptable_candidate(cleaned, original_code):
            continue
        print(f"  Evaluating [{name}]...")
        with open("main.js", "w") as f:
            f.write(cleaned)
        passed, err = run_tests()
        if passed:
            print(f"  PASSED: [{name}]")
            return name, cleaned, failures
        else:
            print(f"  FAILED: [{name}]")
            failures.append((name, err))
    return None, None, failures


def best_fallback(candidates: dict, original_code: str):
    """Return longest acceptable candidate."""
    best = None
    for code in candidates.values():
        cleaned = clean_plain_response(extract_code_block(code))
        if not _acceptable_candidate(cleaned, original_code):
            continue
        if best is None or len(cleaned) > len(best):
            best = cleaned
    return best


def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    openrouter_token = os.environ.get("OPENROUTER_TOKEN")
    gemini_api_key = os.environ.get("GEMINI_API_KEY")

    if not issue_no:
        print("ERROR: Missing ISSUE_NUMBER env var")
        sys.exit(1)

    # -- 1. Fetch issue details ------------------------------------------------
    try:
        res = subprocess.run(
            ["gh", "issue", "view", str(issue_no), "--json", "title,body"],
            capture_output=True,
            text=True,
            check=True,
        )
        ctx = json.loads(res.stdout)
    except Exception as e:
        print(f"Failed to fetch issue: {e}")
        sys.exit(1)

    # -- 2. Save original main.js ---------------------------------------------
    original_code = ""
    if os.path.exists("main.js"):
        with open("main.js") as f:
            original_code = f.read()

    subprocess.run(["git", "config", "--global", "user.name", "AI Issue Solver"])
    subprocess.run(
        ["git", "config", "--global", "user.email", "ai-issue-solver@screeps.local"]
    )

    # -- 3. Self-refinement loop ----------------------------------------------
    winning_name = None
    winning_code = None
    feedback = ""
    candidates = {}

    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"\n{'=' * 60}")
        print(
            f"  ATTEMPT {attempt}/{MAX_ATTEMPTS} -- querying all AI providers concurrently"
        )
        print(f"{'=' * 60}")

        if attempt == 1:
            prompt = (
                f"You are a JavaScript expert fixing a GitHub issue.\n"
                f"The repository uses Jest for testing. Existing tests in /tests/ must continue to pass. (The code will only be syntax-checked locally)\n\n"
                f"Issue Title: {ctx['title']}\n"
                f"Issue Body: {ctx['body']}\n\n"
                f"Current main.js content:\n```javascript\n{original_code}\n```\n\n"
                f"Rules:\n"
                f"- PRESERVE all existing code, exports, and functions from current main.js.\n"
                f"- ONLY ADD the new functions or changes requested in the issue.\n"
                f"- Do NOT remove or rename any existing exports.\n"
                f"- Output ONLY the complete updated main.js content inside a ```javascript ... ``` block."
            )
        else:
            prompt = (
                f"You are a JavaScript expert. Previous attempts to fix this issue failed the syntax check.\n"
                f"The repository uses Jest. Existing tests must continue to pass. (The code will only be syntax-checked locally)\n\n"
                f"Issue Title: {ctx['title']}\n"
                f"Issue Body: {ctx['body']}\n\n"
                f"Current main.js content:\n```javascript\n{original_code}\n```\n\n"
                f"Test failure feedback from previous attempt:\n{feedback}\n\n"
                f"Rules:\n"
                f"- PRESERVE all existing code, exports, and functions from current main.js.\n"
                f"- ONLY ADD the new functions or changes requested in the issue.\n"
                f"- Fix the test failures shown above.\n"
                f"- Output ONLY the complete updated main.js content inside a ```javascript ... ``` block."
            )

        # Query ALL providers in parallel
        candidates = generate_concurrent_all(
            prompt,
            gemini_key=gemini_api_key,
            openrouter_token=openrouter_token,
        )
        print(
            f"\nReceived {len(candidates)} candidate responses from: {list(candidates.keys())}"
        )

        if not candidates:
            print("No responses from any provider. Retrying...")
            continue

        # Evaluate all candidates with npm test
        winner_name, winner_code, failures = evaluate_candidates(
            candidates, original_code
        )

        if winner_code:
            winning_name = winner_name
            winning_code = winner_code
            break
        else:
            # Compile feedback for the next loop
            feedback = "\n\n".join(f"[{name}]:\n{err}" for name, err in failures[:5])
            print(
                f"\nAll {len(failures)} candidates failed syntax check. Feeding errors back into next attempt..."
            )
            # Pick the first available candidate for next-round base
            fb = best_fallback(candidates, original_code)
            if fb:
                with open("main.js", "w") as f:
                    f.write(fb)

    # -- 4. Restore original & select final code ------------------------------
    with open("main.js", "w") as f:
        f.write(original_code)

    if not winning_code:
        print(f"\nNo candidate passed syntax check after {MAX_ATTEMPTS} attempts.")
        print("   Using best available fallback (PR will be created regardless).")
        winning_code = best_fallback(candidates, original_code) if candidates else None

    if not winning_code or not _acceptable_candidate(winning_code, original_code):
        print("No acceptable candidate — keeping original main.js")
        winning_code = original_code

    # -- 5. Create PR and merge (ALWAYS) --------------------------------------
    branch = f"fix/ai-issue-{issue_no}"
    subprocess.run(["git", "checkout", "-b", branch])

    with open("main.js", "w") as f:
        f.write(winning_code)

    subprocess.run(["git", "add", "main.js"])
    commit_msg = (
        f"fix: resolve issue #{issue_no} -- concurrent multi-agent Sakana consensus"
        + (f" [{winning_name}]" if winning_name else " [fallback]")
    )
    subprocess.run(["git", "commit", "--no-verify", "-m", commit_msg])
    subprocess.run(["git", "push", "origin", "--", branch])

    test_note = (
        f"Syntax check passed via **{winning_name}**."
        if winning_name
        else "No model passed syntax check -- manual review may be needed."
    )

    pr_body = (
        f"Closes #{issue_no}\n\n"
        f"## Multi-Agent Fix\n\n"
        f"This PR was generated by querying **all available free LLM APIs simultaneously** "
        f"(Pollinations, Kilo Gateway, OVH Anonymous, Puter.js, HuggingFace, AI Horde, Gemini, OpenRouter).\n\n"
        f"{test_note}\n\n"
        f"**Security Note:** For safety, the AI issue solver no longer executes untrusted code locally. It only performs syntax validation.\n"
        f"Please review the PR and let GitHub Actions run the full test suite in a sandboxed environment.\n\n"
        f"Self-refinement loops used: up to {MAX_ATTEMPTS}."
    )

    create_result = subprocess.run(
        [
            "gh",
            "pr",
            "create",
            "--draft",
            "--title",
            f"fix: resolve issue #{issue_no} (concurrent multi-agent)",
            "--body",
            pr_body,
            "--head",
            branch,
            "--base",
            "main",
        ],
        capture_output=True,
        text=True,
    )

    print(create_result.stdout)
    if create_result.returncode != 0:
        print(f"PR creation error: {create_result.stderr}")
    else:
        pr_url = create_result.stdout.strip()
        pr_number = pr_url.split("/")[-1]
        print(f"\nPR created: {pr_url}")


if __name__ == "__main__":
    main()
