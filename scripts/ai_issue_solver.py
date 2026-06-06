import os, sys, requests, json, subprocess, time

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    key = os.environ.get("GEMINI_API_KEY")
    openrouter = os.environ.get("OPENROUTER_TOKEN")
    
    if not issue_no: return
    
    # 1. Prompt for test #824
    prompt = "Task: Resolve the issue. Respond ONLY with this JSON array: [{\"path\": \"AI_SUCCESS.txt\", \"content\": \"AI RESOLVED\"}]"
    
    result = ""
    # Strategy 1: Gemini Direct (v1)
    if key:
        print("☁️ Calling Gemini v1...")
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={key}"
        try:
            r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=60)
            if r.status_code == 200:
                result = r.json()['candidates'][0]['content']['parts'][0]['text']
        except: pass

    # Strategy 2: OpenRouter (Auto)
    if not result or "[" not in result:
        if openrouter:
            print("☁️ Calling OpenRouter...")
            try:
                r = requests.post("https://openrouter.ai/api/v1/chat/completions",
                                  headers={"Authorization": f"Bearer {openrouter}"},
                                  json={"model": "google/gemini-flash-1.5-exp", "messages": [{"role": "user", "content": prompt}]},
                                  timeout=60)
                if r.status_code == 200:
                    result = r.json()['choices'][0]['message']['content']
            except: pass

    # Strategy 3: Pollinations POST (Fixed)
    if not result or "[" not in result:
        print("☁️ Calling Pollinations...")
        try:
            r = requests.post("https://text.pollinations.ai/", json={"messages": [{"role": "user", "content": prompt}], "model": "openai"}, timeout=60)
            if r.status_code == 200:
                result = r.text
        except: pass

    if not result or "[" not in result:
        comment(issue_no, f"AI providers failed. Gemini: {key[:5] if key else 'No'}... OpenRouter: {openrouter[:5] if openrouter else 'No'}...")
        return

    # Parse and Apply
    try:
        clean = result[result.find("["):result.rfind("]")+1]
        changes = json.loads(clean)
        branch = f"ai-solve-{int(time.time())}"
        subprocess.run(["git", "checkout", "-b", branch])
        for c in changes:
            with open(c['path'], "w") as f: f.write(c['content'])
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", "fix: AI resolve verify"])
        subprocess.run(["git", "push", "origin", branch])
        subprocess.run(["gh", "pr", "create", "--title", "AI Fix Verification", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "✅ AI test successful!"])
    except Exception as e:
        comment(issue_no, f"Parse/Git Error: {e}")

if __name__ == "__main__":
    main()
