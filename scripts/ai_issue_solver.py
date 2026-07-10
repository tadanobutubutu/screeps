import json
import os
import re
import subprocess
import sys

from ai_providers import extract_code_block, generate_with_fallback, is_valid_response, normalize_token


def comment_on_issue(issue_no, body):
    subprocess.run(
        ["gh", "issue", "comment", str(issue_no), "--body", body],
        check=False,
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

    prompt = (
        f"Fix this JS code error for the file main.js.\n"
        f"Issue Title: {ctx['title']}\n"
        f"Issue Body: {ctx['body']}\n"
        "Provide ONLY the complete updated file content of main.js inside a javascript code block."
    )

    result, provider = generate_with_fallback(
        prompt,
        gemini_key=gemini_api_key,
        openrouter_token=openrouter_token,
        min_length=100,
    )

    if not result or not is_valid_response(result, min_length=100):
        msg = (
            "🤖 AI Issue Solver: 全プロバイダーが失敗したため PR を作成しませんでした。\n\n"
            "試行順: Pollinations(GET/POST) → Kilo Gateway → OVH → Gemini → OpenRouter\n"
            "手動で Issue を確認してください。"
        )
        print(msg)
        comment_on_issue(issue_no, msg)
        sys.exit(1)

    code = extract_code_block(result)
    if not code or len(code.strip()) < 100:
        msg = (
            f"🤖 AI Issue Solver: プロバイダー `{provider}` の応答が不正なため中止しました。"
        )
        print(msg)
        comment_on_issue(issue_no, msg)
        sys.exit(1)

    subprocess.run(["git", "config", "--global", "user.name", "AI Issue Solver"])
    subprocess.run(["git", "config", "--global", "user.email", "ai-issue-solver@screeps.local"])

    branch = f"fix/ai-{issue_no}"
    subprocess.run(["git", "checkout", "-b", branch], check=True)
    with open("main.js", "w", encoding="utf-8") as handle:
        handle.write(code)

    subprocess.run(["git", "add", "main.js"], check=True)
    subprocess.run(
        ["git", "commit", "--no-verify", "-m", f"fix: resolve issue #{issue_no} via {provider}"],
        check=True,
    )
    subprocess.run(["git", "push", "origin", branch], check=True)
    subprocess.run(
        [
            "gh",
            "pr",
            "create",
            "--title",
            f"Fix #{issue_no}",
            "--body",
            f"Closes #{issue_no}\n\nAI provider: `{provider}`",
            "--head",
            branch,
            "--base",
            "main",
        ],
        check=True,
    )
    subprocess.run(["gh", "issue", "close", str(issue_no)], check=False)


if __name__ == "__main__":
    main()