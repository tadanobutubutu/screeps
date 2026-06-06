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
    
    prompt = f"Create AI_SUCCESS.txt with 'AI RESOLVED'. Respond ONLY with JSON: [{{\"path\": \"AI_SUCCESS.txt\", \"content\": \"AI RESOLVED\"}}]"

    # 2. Strategy: GEMINI v1beta (Most likely to work)
    result = ""
    if key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
        try:
            r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=60)
            if r.status_code == 200:
                result = r.json()['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            print(f"Gemini error: {e}")

    # 3. Strategy: Pollinations with different models
    if not result or "[" not in result:
        for model in ["openai", "mistral", "llama"]:
            try:
                r = requests.post("https://text.pollinations.ai/", json={"messages": [{"role": "user", "content": prompt}], "model": model}, timeout=60)
                if r.status_code == 200 and "[" in r.text:
                    result = r.text
                    break
            except: continue

    if not result or "[" not in result:
        comment(issue_no, f"AI providers failed. Last result: {result[:100]}")
        return

    # 4. Apply
    clean = result.strip()
    if "```" in clean:
        clean = clean.split("```")[1]
        if clean.startswith("json"): clean = clean[4:]
    
    try:
        changes = json.loads(clean)
        branch = f"ai-success-{int(time.time())}"
        subprocess.run(["git", "checkout", "-b", branch])
        for c in changes:
            with open(c['path'], "w") as f: f.write(c['content'])
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", "fix: AI auto-resolve test"])
        subprocess.run(["git", "push", "origin", branch])
        subprocess.run(["gh", "pr", "create", "--title", "AI Fix Verification", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "✅ AI test successful! PR created."])
    except Exception as e:
        comment(issue_no, f"Parse Error: {e}")

if __name__ == "__main__":
    main()
