import os, sys, requests, json, subprocess, time

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    key = os.environ.get("GEMINI_API_KEY")
    if not issue_no: return
    
    prompt = "Respond with this exact JSON array and nothing else: [{\"path\": \"AI_SUCCESS.txt\", \"content\": \"AI HAS RESOLVED THIS\"}]"

    # 1. Primary Strategy: Gemini Direct (Reliable if key is valid)
    result = ""
    if key:
        print("☁️ Calling Gemini Direct...")
        # Try v1 with gemini-pro
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={key}"
        try:
            r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=30)
            if r.status_code == 200:
                result = r.json()['candidates'][0]['content']['parts'][0]['text']
        except: pass

    # 2. Fallback Strategy: DuckDuckGo AI (GPT-4o-mini)
    if not result or "[" not in result:
        print("☁️ Calling DuckDuckGo AI...")
        try:
            s = requests.Session()
            res = s.get("https://duckduckgo.com/duckchat/v1/status", headers={"x-vqd-4": "1", "User-Agent": "Mozilla/5.0"})
            vqd = res.headers.get("x-vqd-4")
            if vqd:
                res = s.post("https://duckduckgo.com/duckchat/v1/chat", headers={"x-vqd-4": vqd, "User-Agent": "Mozilla/5.0"}, json={"model": "gpt-4o-mini", "messages": [{"role": "user", "content": prompt}]})
                if res.status_code == 200:
                    full = ""
                    for line in res.text.split('\n'):
                        if line.startswith('data: '):
                            d = line[6:]
                            if d == '[DONE]': break
                            try: full += json.loads(d).get('message', '')
                            except: continue
                    result = full
        except: pass

    if not result or "[" not in result:
        comment(issue_no, "All AI providers failed. Check API keys.")
        return

    # 3. Apply
    try:
        clean = result[result.find("["):result.rfind("]")+1]
        changes = json.loads(clean)
        branch = f"ai-solve-{int(time.time())}"
        subprocess.run(["git", "checkout", "-b", branch])
        for c in changes:
            with open(c['path'], "w") as f: f.write(c['content'])
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@example.com"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", "fix: AI resolve verify"])
        subprocess.run(["git", "push", "origin", branch])
        subprocess.run(["gh", "pr", "create", "--title", "AI Fix Verification", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "✅ AI test successful! PR created."])
    except Exception as e:
        comment(issue_no, f"Error: {e}\nRaw result: {result[:100]}")

if __name__ == "__main__":
    main()
