import os, sys, json, subprocess, time, urllib.request

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    title = os.environ.get("ISSUE_TITLE")
    body = os.environ.get("ISSUE_BODY")
    key = os.environ.get("GEMINI_API_KEY")
    
    if not issue_no: return
    prompt = f"Solve GitHub Issue #{issue_no}: {title}. Respond ONLY with a JSON array: [{{'path': 'AI_SUCCESS.txt', 'content': 'AI RESOLVED'}}]. No talk."

    # Strategy: Pollinations with fallback models
    result = ""
    for model in ["openai", "mistral", "llama", "unity", "midjourney"]:
        print(f"☁️ Trying Pollinations ({model})...")
        try:
            url = "https://text.pollinations.ai/"
            payload = json.dumps({"messages": [{"role": "user", "content": prompt}], "model": model}).encode('utf-8')
            req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=30) as f:
                res_text = f.read().decode('utf-8')
                if "[" in res_text:
                    result = res_text
                    print(f"✅ Success with {model}!")
                    break
        except: continue

    if not result or "[" not in result:
        comment(issue_no, f"AI providers failed. Model trial: {model}")
        return

    # Clean
    clean = result.strip()
    if "```" in clean:
        clean = clean.split("```")[1]
        if clean.startswith("json"): clean = clean[4:]
    
    try:
        changes = json.loads(clean)
        branch = f"ai-success-{issue_no}-{int(time.time())}"
        subprocess.run(["git", "checkout", "-b", branch])
        for c in changes:
            with open(c['path'], "w") as f: f.write(c['content'])
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", "fix: AI auto-resolve verification"])
        subprocess.run(["git", "push", "origin", branch])
        subprocess.run(["gh", "pr", "create", "--title", "AI Fix Verification", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "✅ AI test successful! PR created."])
    except Exception as e:
        comment(issue_no, f"Final Error: {e}\nRaw: {result[:200]}")

if __name__ == "__main__":
    main()
