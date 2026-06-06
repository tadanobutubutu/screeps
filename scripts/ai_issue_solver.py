import os, sys, requests, json, subprocess, time

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    print("🚀 AI Solver script started.")
    issue_no = os.environ.get("ISSUE_NUMBER")
    title = os.environ.get("ISSUE_TITLE")
    body = os.environ.get("ISSUE_BODY")
    key = os.environ.get("GEMINI_API_KEY")
    
    print(f"DEBUG: ISSUE_NUMBER={issue_no}, TITLE_PRESENT={'Yes' if title else 'No'}")
    
    if not issue_no:
        print("❌ No ISSUE_NUMBER.")
        return

    if not title or not body:
        print("🔍 Fetching context via gh...")
        try:
            res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body,comments"], capture_output=True, text=True)
            if res.returncode == 0:
                ctx = json.loads(res.stdout)
                title = ctx['title']
                body = ctx['body']
                print("✅ Context fetched.")
            else:
                print(f"❌ gh error: {res.stderr}")
        except Exception as e:
            print(f"❌ Error: {e}")

    if not title:
        comment(issue_no, "Failed to get issue title/body.")
        return

    # 1. Build Prompt (Simplified)
    prompt = f"Solve GitHub Issue #{issue_no}: {title}\nBody: {body}\nRespond ONLY with a JSON array: [{{'path': 'file', 'content': 'content'}}]"

    # 2. Strategy: Pollinations AI (Reliable)
    result = ""
    for model in ["openai", "mistral"]:
        print(f"☁️ Trying Pollinations ({model})...")
        try:
            r = requests.post("https://text.pollinations.ai/", json={"messages": [{"role": "user", "content": prompt}], "model": model}, timeout=60)
            if r.status_code == 200 and "[" in r.text:
                result = r.text
                print(f"✅ AI responded using {model}.")
                break
        except: continue

    if not result or "[" not in result:
        # Fallback to Gemini Direct if available
        if key:
            print("☁️ Trying Gemini v1beta...")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
            try:
                r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=30)
                if r.status_code == 200:
                    result = r.json()['candidates'][0]['content']['parts'][0]['text']
                    print("✅ Gemini responded.")
            except: pass

    if not result or "[" not in result:
        comment(issue_no, "AI failed to generate a valid JSON solution.")
        return

    # 3. Parse and Apply
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
            print(f"✅ Applied change to {c['path']}")
        
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", f"fix: AI resolve #{issue_no}"])
        subprocess.run(["git", "push", "origin", branch])
        subprocess.run(["gh", "pr", "create", "--title", f"AI Fix for #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "🤖 AI fix proposed. PR created and issue closed."])
        print("🚀 Success!")
    except Exception as e:
        comment(issue_no, f"Error during parsing/applying: {e}\nRaw output start: {result[:200]}")

if __name__ == "__main__":
    main()
