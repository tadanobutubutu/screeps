import os
import sys
import json
import subprocess
import urllib.request
import urllib.error
import re

FREE_MODELS = [
    "openrouter/free",
    "tencent/hy3:free",
    "poolside/laguna-xs-2.1:free",
    "cohere/north-mini-code:free",
    "nvidia/nemotron-3-ultra-550b-a55b:free",
]


def normalize_token(token):
    if not token:
        return None
    cleaned = token.strip().strip('"').strip("'")
    return cleaned or None


def call_gemini_api(prompt, key):
    try:
        print("Trying direct Google Gemini API (gemini-1.5-flash)...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=60) as f:
            res = json.loads(f.read().decode("utf-8"))
            return res["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Direct Gemini API failed: {e}")
        return None


def call_openrouter(prompt, token):
    token = normalize_token(token)
    if not token:
        print("OPENROUTER_TOKEN is missing or empty after normalization")
        return None

    for model in FREE_MODELS:
        try:
            print(f"Trying OpenRouter model {model}...")
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
            }
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "X-Title": "screeps-issue-solver",
                "HTTP-Referer": "https://github.com/tadanobutubutu/screeps",
            }
            req = urllib.request.Request(
                "https://openrouter.ai/api/v1/chat/completions",
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
            )
            with urllib.request.urlopen(req, timeout=90) as f:
                res = json.loads(f.read().decode("utf-8"))
                content = res["choices"][0]["message"]["content"]
                if content and "Fix pending" not in content:
                    print(f"Successfully obtained response using {model}")
                    return content
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:300]
            print(f"OpenRouter model {model} failed: HTTP {e.code} - {body}")
        except Exception as e:
            print(f"OpenRouter model {model} failed: {e}")
    return None


def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    openrouter_token = os.environ.get("OPENROUTER_TOKEN")
    gemini_api_key = os.environ.get("GEMINI_API_KEY")

    if not issue_no:
        print("Missing ISSUE_NUMBER")
        sys.exit(1)

    try:
        res = subprocess.run(
            ["gh", "issue", "view", str(issue_no), "--json", "title,body,state"],
            capture_output=True,
            text=True,
            check=True,
        )
        ctx = json.loads(res.stdout)
    except Exception as e:
        print(f"Failed to fetch issue details: {e}")
        sys.exit(1)

    if ctx.get("state") == "CLOSED":
        print(f"Issue #{issue_no} is already closed — skipping")
        sys.exit(0)

    prompt = (
        f"Fix this JS code error for the file main.js.\n"
        f"Issue Title: {ctx['title']}\n"
        f"Issue Body: {ctx['body']}\n"
        f"Provide ONLY the complete updated file content of main.js inside a javascript code block."
    )

    result = None
    if gemini_api_key:
        result = call_gemini_api(prompt, gemini_api_key)
    if not result and openrouter_token:
        result = call_openrouter(prompt, openrouter_token)

    if not result:
        print("❌ All AI providers failed — NOT creating PR or closing issue")
        subprocess.run(
            [
                "gh",
                "issue",
                "comment",
                str(issue_no),
                "--body",
                "🤖 **AI Issue Solver**: All API calls failed (check OPENROUTER_TOKEN format and model availability). No PR created.",
            ]
        )
        sys.exit(1)

    code_match = re.search(r"```(?:javascript|js)?\s*(.*?)\s*```", result, re.DOTALL)
    code = code_match.group(1).strip() if code_match else result.strip()

    if not code or len(code) < 50 or "Fix pending" in code:
        print("❌ AI response too short or invalid — aborting")
        sys.exit(1)

    subprocess.run(["git", "config", "--global", "user.name", "AI Issue Solver"])
    subprocess.run(["git", "config", "--global", "user.email", "ai-issue-solver@screeps.local"])

    branch = f"fix/ai-{issue_no}"
    subprocess.run(["git", "checkout", "-b", branch], check=True)
    with open("main.js", "w") as f:
        f.write(code)
        if not code.endswith("\n"):
            f.write("\n")

    subprocess.run(["git", "add", "main.js"], check=True)
    subprocess.run(
        ["git", "commit", "--no-verify", "-m", f"fix: resolve issue #{issue_no}"],
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
            f"Closes #{issue_no}\n\nAutomated fix by AI Issue Solver (OpenRouter free models).",
            "--head",
            branch,
            "--base",
            "main",
        ],
        check=True,
    )
    print(f"✅ PR created for issue #{issue_no} — issue left open until merge")


if __name__ == "__main__":
    main()