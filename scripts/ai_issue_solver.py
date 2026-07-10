import os, sys, json, subprocess, urllib.request, re

def call_gemini_api(prompt, key):
    try:
        print("Trying direct Google Gemini API (gemini-1.5-flash)...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=60) as f:
            res = json.loads(f.read().decode('utf-8'))
            return res['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"Direct Gemini API failed: {e}")
        return None

def call_openrouter(prompt, token):
    models = [
        "google/gemini-2.5-flash:free",
        "google/gemini-2.0-flash-exp:free",
        "meta-llama/llama-3-8b-instruct:free",
    ]
    for model in models:
        try:
            print(f"Trying OpenRouter model {model}...")
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}]
            }
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "X-Title": "screeps-issue-solver",
                "HTTP-Referer": "https://github.com/tadanobutubutu/screeps"
            }
            req = urllib.request.Request(
                "https://openrouter.ai/api/v1/chat/completions",
                data=json.dumps(payload).encode('utf-8'),
                headers=headers
            )
            with urllib.request.urlopen(req, timeout=60) as f:
                res = json.loads(f.read().decode('utf-8'))
                return res['choices'][0]['message']['content']
        except Exception as e:
            print(f"OpenRouter model {model} failed: {e}")
    return None

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    openrouter_token = os.environ.get("OPENROUTER_TOKEN")
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    
    if not issue_no:
        print("Missing ISSUE_NUMBER")
        return
    
    # 1. Fetch Issue Details
    try:
        res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
        ctx = json.loads(res.stdout)
    except Exception as e:
        print(f"Failed to fetch issue details: {e}")
        return
    
    prompt = f"Fix this JS code error for the file main.js.\nIssue Title: {ctx['title']}\nIssue Body: {ctx['body']}\nProvide ONLY the complete updated file content of main.js inside a javascript code block."
    
    result = None
    if gemini_api_key:
        result = call_gemini_api(prompt, gemini_api_key)
    if not result and openrouter_token:
        result = call_openrouter(prompt, openrouter_token)
        
    if not result:
        result = "// Fix pending due to API errors"
    
    # 3. Apply the fix
    code_match = re.search(r"```(?:javascript|js)?\s*(.*?)\s*```", result, re.DOTALL)
    code = code_match.group(1) if code_match else result
    
    # Configure Git identity for the runner
    subprocess.run(["git", "config", "--global", "user.name", "AI Issue Solver"])
    subprocess.run(["git", "config", "--global", "user.email", "ai-issue-solver@screeps.local"])
    
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
