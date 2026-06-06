import os, sys, json, subprocess, time, urllib.request, urllib.parse

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    title = os.environ.get("ISSUE_TITLE")
    body = os.environ.get("ISSUE_BODY")
    key = os.environ.get("GEMINI_API_KEY")
    
    if not issue_no: return
    
    print(f"DEBUG: ISSUE_NUMBER={issue_no}, TITLE_PRESENT={'Yes' if title else 'No'}")
    
    # 1. Fetch Context if not provided by env
    if not title or not body:
        try:
            res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
            ctx = json.loads(res.stdout)
            title = ctx.get('title', '')
            body = ctx.get('body', '')
        except Exception as e:
            comment(issue_no, f"Failed to get issue context: {e}")
            return

    # 2. Search for relevant code context
    print("🔍 Searching for code context...")
    
    # Very basic search using keywords from the title
    keywords = " ".join([w for w in title.replace("🚨 Sentinel: ", "").split() if len(w) > 3][:3])
    code_context = ""
    try:
        if keywords:
            grep_res = subprocess.run(["grep", "-rn", "-E", keywords.replace(" ", "|"), ".", "--exclude-dir=.git", "--exclude-dir=node_modules"], capture_output=True, text=True)
            code_context = grep_res.stdout[:3000]
    except: pass

    # If grep found nothing, list files
    if not code_context:
        try:
            files_res = subprocess.run(["find", ".", "-maxdepth", "3", "-name", "*.js", "-not", "-path", "*/node_modules/*"], capture_output=True, text=True)
            code_context = "Available JS files:\n" + files_res.stdout[:1000]
        except: pass

    prompt = f"""
    Solve GitHub Issue #{issue_no}: {title}
    Body: {body}
    
    Related Code Context:
    {code_context}
    
    Respond ONLY with a JSON array of changes: [{{ "path": "src/file.js", "content": "..." }}]
    Return an empty array [] if you cannot solve it. No markdown formatting.
    """

    result = ""
    # Strategy 1: Gemini Direct
    if key:
        print("☁️ Calling Gemini 1.5 Flash...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
        try:
            payload = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"temperature": 0.1}}
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as f:
                res_json = json.loads(f.read().decode('utf-8'))
                result = res_json['candidates'][0]['content']['parts'][0]['text']
                print("✅ Gemini responded.")
        except Exception as e:
            print(f"⚠️ Gemini error: {e}")

    # Strategy 2: Pollinations AI (POST)
    if not result or "[" not in result:
        print("☁️ Calling Pollinations AI...")
        try:
            url = "https://text.pollinations.ai/"
            payload = json.dumps({"messages": [{"role": "user", "content": prompt[:4000]}], "model": "openai"}).encode('utf-8')
            req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as f:
                res_text = f.read().decode('utf-8')
                if "[" in res_text:
                    result = res_text
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
        print("🚀 Process completed successfully!")
    except Exception as e:
        comment(issue_no, f"Git/Parse Error: {e}\nRaw result start: {result[:200]}")

if __name__ == "__main__":
    main()
