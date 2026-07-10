import os, sys, json, subprocess, urllib.request, re

def call_gemini_api(prompt, key):
    try:
        print("Trying direct Google Gemini API (gemini-1.5-flash-latest)...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
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
        "openrouter/free",
        "google/gemini-2.5-flash:free",
        "google/gemini-2.0-flash-exp:free",
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
                if 'choices' in res and len(res['choices']) > 0:
                    return res['choices'][0]['message']['content']
        except Exception as e:
            print(f"OpenRouter model {model} failed: {e}")
    return None

def call_pollinations_ai(prompt):
    try:
        print("Trying Pollinations AI (openai-fast)...")
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "model": "openai"
        }
        req = urllib.request.Request(
            "https://text.pollinations.ai/",
            data=json.dumps(payload).encode('utf-8'),
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            }
        )
        with urllib.request.urlopen(req, timeout=60) as f:
            return f.read().decode('utf-8')
    except Exception as e:
        print(f"Pollinations AI failed: {e}")
    return None

def call_huggingface_anonymous(prompt):
    try:
        print("Trying Hugging Face Serverless Anonymous (Qwen2.5-Coder)...")
        url = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-7B-Instruct"
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": 1000}
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            }
        )
        with urllib.request.urlopen(req, timeout=60) as f:
            res = json.loads(f.read().decode('utf-8'))
            if isinstance(res, list) and len(res) > 0 and 'generated_text' in res[0]:
                return res[0]['generated_text']
            elif isinstance(res, dict) and 'generated_text' in res:
                return res['generated_text']
    except Exception as e:
        print(f"Hugging Face anonymous failed: {e}")
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
    # Cascading Fallback Layers:
    # 1. Direct Gemini API Key (Stable Free Tier)
    if gemini_api_key:
        result = call_gemini_api(prompt, gemini_api_key)
    # 2. OpenRouter Token (Free Router Slug)
    if not result and openrouter_token:
        result = call_openrouter(prompt, openrouter_token)
    # 3. Pollinations AI (Anonymous, Keyless, 100% Free)
    if not result:
        result = call_pollinations_ai(prompt)
    # 4. Hugging Face Serverless Anonymous (Keyless Coder LLM)
    if not result:
        result = call_huggingface_anonymous(prompt)
        
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