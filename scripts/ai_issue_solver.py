import os, sys, requests, json, subprocess, time

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    if not issue_no or issue_no == "None" or issue_no == "":
        print("Error: No Issue Number")
        return
    
    # 1. Get Context
    try:
        res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"GH Error: {res.stderr}")
            return
        ctx = json.loads(res.stdout)
    except Exception as e:
        print(f"Ctx Error: {e}")
        return
    
    prompt = f"Create AI_SUCCESS.txt with 'AI RESOLVED'. Respond ONLY with JSON: [{{\"path\": \"AI_SUCCESS.txt\", \"content\": \"AI RESOLVED\"}}]"

    # Strategy: Pollinations with dynamic model
    result = ""
    for model in ["openai", "mistral"]:
        try:
            r = requests.post("https://text.pollinations.ai/", json={"messages": [{"role": "user", "content": prompt}], "model": model}, timeout=60)
            if r.status_code == 200 and "[" in r.text:
                result = r.text
                break
        except: continue

    if not result or "[" not in result:
        comment(issue_no, f"AI providers failed. Model: {model}. Result snippet: {result[:50]}")
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
        comment(issue_no, f"Final Error: {e}")

if __name__ == "__main__":
    main()
