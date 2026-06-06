import os, sys, requests, json, subprocess, time

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def get_issue_context(issue_no):
    res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body,comments"], capture_output=True, text=True)
    if res.returncode != 0: return None
    return json.loads(res.stdout)

def get_gemini_ai(prompt, key):
    # Try multiple model names for resilience
    for model in ["gemini-1.5-flash", "gemini-pro"]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
        try:
            res = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=30)
            if res.status_code == 200:
                return res.json()['candidates'][0]['content']['parts'][0]['text']
        except: continue
    return "Error: Gemini failed"

def get_pollinations_ai(prompt):
    for _ in range(3):
        try:
            # Shorten prompt for Pollinations
            p = prompt[:2000]
            res = requests.post("https://text.pollinations.ai/", json={"messages": [{"role": "user", "content": p}], "model": "openai"}, timeout=30)
            if res.status_code == 200 and "Queue full" not in res.text:
                return res.text
            time.sleep(5)
        except: time.sleep(5)
    return "Error: Pollinations failed"

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    key = os.environ.get("GEMINI_API_KEY")
    if not issue_no: return
    
    ctx = get_issue_context(issue_no)
    if not ctx: return
    
    files = subprocess.run(["find", ".", "-maxdepth", "2", "-not", "-path", "*/.*"], capture_output=True, text=True).stdout
    
    prompt = f"Solve GitHub Issue #{issue_no}: {ctx['title']}\nBody: {ctx['body']}\nFiles: {files}\nRespond ONLY with a JSON array: [{{'path': 'file', 'content': 'content'}}]"
    
    result = ""
    if key:
        print("☁️ Trying Gemini...")
        result = get_gemini_ai(prompt, key)
    
    if not result or result.startswith("Error:"):
        print("☁️ Trying Pollinations...")
        result = get_pollinations_ai(prompt)

    if not result or result.startswith("Error:"):
        comment(issue_no, f"All AI providers failed. Gemini: {result}")
        return

    clean = result.strip()
    if clean.startswith("```json"): clean = clean[7:]
    if clean.startswith("```"): clean = clean[3:]
    if clean.endswith("```"): clean = clean[:-3]
    
    try:
        changes = json.loads(clean)
        if not changes: return
        
        branch = f"ai-solve-{issue_no}-{int(time.time())}"
        subprocess.run(["git", "checkout", "-b", branch])
        
        for c in changes:
            path = c['path']
            content = c['content']
            os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
            with open(path, "w") as f: f.write(content)
            
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", f"fix: AI resolve #{issue_no}"])
        subprocess.run(["git", "push", "origin", branch])
        
        subprocess.run(["gh", "pr", "create", "--title", f"AI Fix for #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "🤖 AI fix proposed and PR created."])
    except Exception as e:
        comment(issue_no, f"Parsing Error: {e}\nRaw Output: {result[:500]}")

if __name__ == "__main__":
    main()
