import os, sys, requests, json, subprocess, time, urllib.parse

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    key = os.environ.get("GEMINI_API_KEY")
    if not issue_no: return
    
    # 1. Get Context
    res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
    ctx = json.loads(res.stdout)
    
    prompt = f"Solve issue: {ctx['title']}. Content: {ctx['body']}. Respond ONLY with a JSON array of path/content objects."

    # 2. Strategy: GEMINI V1 (Most Official)
    result = ""
    if key:
        print("☁️ Trying Gemini v1...")
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={key}"
        try:
            r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=60)
            if r.status_code == 200:
                result = r.json()['candidates'][0]['content']['parts'][0]['text']
        except: pass

    # 3. Strategy: Pollinations Reliable POST
    if not result or "[" not in result:
        print("☁️ Trying Pollinations POST...")
        try:
            r = requests.post("https://text.pollinations.ai/", json={"messages": [{"role": "user", "content": prompt}], "model": "openai"}, timeout=60)
            if r.status_code == 200:
                result = r.text
        except: pass

    if not result or "[" not in result:
        comment(issue_no, "AI failed to respond with JSON. Please verify API keys.")
        return

    # 4. Parse
    clean = result.strip()
    if "```" in clean:
        clean = clean.split("```")[1]
        if clean.startswith("json"): clean = clean[4:]
    
    try:
        changes = json.loads(clean)
        branch = f"ai-solve-{issue_no}-{int(time.time())}"
        subprocess.run(["git", "checkout", "-b", branch])
        for c in changes:
            os.makedirs(os.path.dirname(c['path']) or '.', exist_ok=True)
            with open(c['path'], "w") as f: f.write(c['content'])
        
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", f"fix: AI auto-solve #{issue_no}"])
        subprocess.run(["git", "push", "origin", branch])
        subprocess.run(["gh", "pr", "create", "--title", f"AI Fix for #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "🤖 AI fix proposed. PR created and issue closed."])
    except Exception as e:
        comment(issue_no, f"Parse Error: {e}\nRaw: {result[:200]}")

if __name__ == "__main__":
    main()
