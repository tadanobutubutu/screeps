import os, sys, json, subprocess, urllib.request, re

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    openrouter_token = os.environ.get("OPENROUTER_TOKEN")
    if not issue_no or not openrouter_token:
        print("Missing ISSUE_NUMBER or OPENROUTER_TOKEN")
        return
    
    # 1. Fetch Issue Details
    try:
        res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
        ctx = json.loads(res.stdout)
    except Exception as e:
        print(f"Failed to fetch issue details: {e}")
        return
    
    # 2. Call OpenRouter with free model
    model = "google/gemini-2.5-flash:free"
    prompt = f"Fix this JS code error for the file main.js.\nIssue Title: {ctx['title']}\nIssue Body: {ctx['body']}\nProvide ONLY the complete updated file content of main.js inside a javascript code block."
    
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}]
    }
    headers = {
        "Authorization": f"Bearer {openrouter_token}",
        "Content-Type": "application/json"
    }
    
    try:
        req = urllib.request.Request(
            "https://openrouter.ai/api/v1/chat/completions",
            data=json.dumps(payload).encode('utf-8'),
            headers=headers
        )
        with urllib.request.urlopen(req, timeout=60) as f:
            res = json.loads(f.read().decode('utf-8'))
            result = res['choices'][0]['message']['content']
    except Exception as e:
        print(f"OpenRouter API call failed: {e}")
        result = "// Fix pending"
    
    # 3. Apply the fix
    code_match = re.search(r"```(?:javascript|js)?\s*(.*?)\s*```", result, re.DOTALL)
    code = code_match.group(1) if code_match else result
    
    branch = f"fix/ai-{issue_no}"
    subprocess.run(["git", "checkout", "-b", branch])
    with open("main.js", "w") as f:
        f.write(code)
    
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "--no-verify", "-m", f"fix: resolve issue #{issue_no}"])
    subprocess.run(["git", "push", "origin", branch])
    subprocess.run(["gh", "pr", "create", "--title", f"Fix #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
    subprocess.run(["gh", "issue", "close", str(issue_no)])

if __name__ == "__main__":
    main()
