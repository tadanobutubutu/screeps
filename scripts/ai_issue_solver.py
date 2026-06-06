import os, sys, requests, json, subprocess, time, urllib.parse

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    key = os.environ.get("GEMINI_API_KEY")
    if not issue_no: return
    
    print(f"DEBUG: ISSUE_NUMBER={issue_no}, KEY_PRESENT={'Yes' if key else 'No'}")
    
    # 1. Get Context
    try:
        res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body,comments"], capture_output=True, text=True)
        ctx = json.loads(res.stdout)
    except Exception as e:
        print(f"Failed to get context: {e}")
        return

    # 2. Search for relevant code context
    print("🔍 Searching for code context...")
    search_query = ctx['title']
    code_context = ""
    try:
        # Use 'gh search code' or simple grep
        grep_res = subprocess.run(["grep", "-r", search_query.split()[0], ".", "--exclude-dir=.git", "--max-count=1"], capture_output=True, text=True)
        code_context = grep_res.stdout[:2000]
    except: pass

    prompt = f"""
    Solve GitHub Issue #{issue_no}: {ctx['title']}
    Body: {ctx['body']}
    Comments: {json.dumps(ctx.get('comments', []))}
    
    Related Code Context:
    {code_context}
    
    Respond ONLY with a JSON array of changes: [{{ "path": "src/file.js", "content": "..." }}]
    Return an empty array [] if you cannot solve it.
    """
    
    result = ""
    # Strategy 1: Gemini Direct (Correct v1beta endpoint)
    if key:
        print("☁️ Calling Gemini 1.5 Flash...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
        try:
            payload = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"response_mime_type": "application/json"}}
            r = requests.post(url, json=payload, timeout=60)
            if r.status_code == 200:
                result = r.json()['candidates'][0]['content']['parts'][0]['text']
                print("✅ Gemini responded.")
            else:
                print(f"⚠️ Gemini failed (HTTP {r.status_code}): {r.text[:500]}")
        except Exception as e:
            print(f"⚠️ Gemini error: {e}")

    # Strategy 2: Pollinations AI (POST)
    if not result or "[" not in result:
        print("☁️ Calling Pollinations AI...")
        try:
            r = requests.post("https://text.pollinations.ai/", json={"messages": [{"role": "user", "content": prompt[:4000]}], "model": "openai"}, timeout=60)
            if r.status_code == 200:
                result = r.text
        except: pass

    if not result or "[" not in result:
        comment(issue_no, f"AI Resolution failed. Gemini Key: {'Valid' if key else 'Missing'}")
        return

    # 3. Apply
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
        if not changes:
            comment(issue_no, "AI analysis complete: No code changes recommended.")
            return

        branch = f"ai-solve-{issue_no}-{int(time.time())}"
        subprocess.run(["git", "checkout", "-b", branch])
        for c in changes:
            os.makedirs(os.path.dirname(c['path']) or '.', exist_ok=True)
            with open(c['path'], "w") as f: f.write(c['content'])
            print(f"✅ Modified {c['path']}")
        
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", f"fix: AI resolve #{issue_no}"])
        subprocess.run(["git", "push", "origin", branch])
        subprocess.run(["gh", "pr", "create", "--title", f"AI Fix for #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "🤖 AI fix proposed. PR created and issue closed."])
    except Exception as e:
        comment(issue_no, f"Git/Parse Error: {e}\nRaw result start: {result[:200]}")

if __name__ == "__main__":
    main()
