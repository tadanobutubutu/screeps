import os, sys, json, subprocess, time, urllib.request, urllib.parse

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    print("🚀 AI Solver script started.")
    issue_no = os.environ.get("ISSUE_NUMBER")
    title = os.environ.get("ISSUE_TITLE")
    body = os.environ.get("ISSUE_BODY")
    key = os.environ.get("GEMINI_API_KEY")
    
    if not issue_no: return

    prompt = f"Solve issue: {title}. Body: {body}. Respond ONLY with JSON array: [{{'path': 'file', 'content': 'content'}}]"

    # Strategy: Pollinations via URLLIB (GET)
    result = ""
    try:
        print("☁️ Trying Pollinations (GET)...")
        encoded = urllib.parse.quote(prompt)
        url = f"https://text.pollinations.ai/{encoded}?model=openai"
        with urllib.request.urlopen(url, timeout=30) as f:
            result = f.read().decode('utf-8')
            print("✅ Received Response.")
    except Exception as e:
        print(f"⚠️ GET Failed: {e}")

    if not result or "[" not in result:
        # Try Gemini Direct
        if key:
            print("☁️ Trying Gemini...")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
            payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode('utf-8')
            try:
                req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(req, timeout=30) as f:
                    res_json = json.loads(f.read().decode('utf-8'))
                    result = res_json['candidates'][0]['content']['parts'][0]['text']
                    print("✅ Received Gemini Response.")
            except Exception as e:
                print(f"⚠️ Gemini Failed: {e}")

    if not result or "[" not in result:
        comment(issue_no, f"AI providers failed. RAW: {result[:50]}")
        return

    # Clean
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
        subprocess.run(["gh", "pr", "create", "--title", f"AI Fix #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "✅ AI fixed it! PR created."])
    except Exception as e:
        comment(issue_no, f"Final Error: {e}\nOutput: {result[:200]}")

if __name__ == "__main__":
    main()
