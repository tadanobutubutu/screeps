import os, sys, requests, json, subprocess, time

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    title = os.environ.get("ISSUE_TITLE")
    body = os.environ.get("ISSUE_BODY")
    key = os.environ.get("GEMINI_API_KEY")
    
    if not issue_no: return
    if not title or not body:
        # Last attempt to fetch
        try:
            res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
            ctx = json.loads(res.stdout)
            title = ctx['title']
            body = ctx['body']
        except:
            comment(issue_no, "Failed to get issue content via env or gh.")
            return

    prompt = f"Solve issue: {title}. Body: {body}. Respond ONLY with JSON array of path/content."

    # Strategy: Gemini v1beta (Strongest)
    result = ""
    if key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
        try:
            r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=60)
            if r.status_code == 200:
                result = r.json()['candidates'][0]['content']['parts'][0]['text']
        except: pass

    # Strategy: Pollinations (Fallback)
    if not result or "[" not in result:
        for model in ["openai", "mistral"]:
            try:
                r = requests.post("https://text.pollinations.ai/", json={"messages": [{"role": "user", "content": prompt}], "model": model}, timeout=60)
                if r.status_code == 200 and "[" in r.text:
                    result = r.text
                    break
            except: continue

    if not result or "[" not in result:
        comment(issue_no, f"AI providers failed to return JSON.")
        return

    # 2. Parse and Apply
    clean = result.strip()
    if "```" in clean:
        parts = clean.split("```")
        for p in parts:
            if "[" in p and "]" in p:
                clean = p
                if clean.startswith("json"): clean = clean[4:]
                break
    
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
        subprocess.run(["git", "commit", "-m", f"fix: AI auto-resolve #{issue_no}"])
        subprocess.run(["git", "push", "origin", branch])
        subprocess.run(["gh", "pr", "create", "--title", f"AI Fix for #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "✅ AI has proposed a fix. PR created."])
    except Exception as e:
        comment(issue_no, f"Final Error: {e}\nRaw result: {result[:200]}")

if __name__ == "__main__":
    main()
