import os, sys, json, subprocess, time, urllib.request

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    title = os.environ.get("ISSUE_TITLE")
    body = os.environ.get("ISSUE_BODY")
    key = os.environ.get("GEMINI_API_KEY")
    
    if not issue_no: return
    prompt = f"Solve GitHub Issue #{issue_no}: {title}. Body: {body}. Respond ONLY with a JSON array: [{{'path': 'file', 'content': 'content'}}]. No talk."

    result = ""
    # Strategy 1: Gemini Direct (Fixed Structure)
    if key:
        print("☁️ Calling Gemini...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
        payload = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.1}
        }).encode('utf-8')
        try:
            req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=30) as f:
                res = json.loads(f.read().decode('utf-8'))
                result = res['candidates'][0]['content']['parts'][0]['text']
        except Exception as e: print(f"Gemini error: {e}")

    # Strategy 2: Pollinations POST (Fixed Structure)
    if not result or "[" not in result:
        print("☁️ Calling Pollinations...")
        try:
            url = "https://text.pollinations.ai/"
            payload = json.dumps({
                "messages": [{"role": "user", "content": prompt}],
                "model": "openai",
                "json": True
            }).encode('utf-8')
            req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=30) as f:
                result = f.read().decode('utf-8')
        except Exception as e: print(f"Pollinations error: {e}")

    if not result or "[" not in result:
        comment(issue_no, "AI providers failed to return valid JSON.")
        return

    # 3. Clean
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
        subprocess.run(["git", "commit", "-m", f"fix: AI resolve #{issue_no}"])
        subprocess.run(["git", "push", "origin", branch])
        subprocess.run(["gh", "pr", "create", "--title", f"AI Fix for #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "✅ AI fixed it! PR created."])
    except Exception as e:
        comment(issue_no, f"Processing Error: {e}")

if __name__ == "__main__":
    main()
