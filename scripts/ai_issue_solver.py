import os, sys, requests, json, subprocess

def get_issue_context(issue_no):
    res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body,comments"], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Failed to fetch issue: {res.stderr}")
        return None
    return json.loads(res.stdout)

def get_ddg_ai(prompt):
    s = requests.Session()
    try:
        r = s.get("https://duckduckgo.com/duckchat/v1/status", headers={"x-vqd-4": "1", "User-Agent": "Mozilla/5.0"})
        vqd = r.headers.get("x-vqd-4")
        if not vqd: return None
        res = s.post("https://duckduckgo.com/duckchat/v1/chat", headers={"x-vqd-4": vqd, "Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}, json={"model": "gpt-4o-mini", "messages": [{"role": "user", "content": prompt}]})
        if res.status_code != 200: return None
        full = ""
        for line in res.text.split('\n'):
            if line.startswith('data: '):
                d = line[6:]
                if d == '[DONE]': break
                try: full += json.loads(d).get('message', '')
                except: continue
        return full
    except: return None

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    if not issue_no:
        print("No ISSUE_NUMBER provided.")
        return
    
    ctx = get_issue_context(issue_no)
    if not ctx: return
    
    files = subprocess.run(["find", ".", "-maxdepth", "2", "-not", "-path", "*/.*"], capture_output=True, text=True).stdout
    
    prompt = f"Solve GitHub Issue #{issue_no}: {ctx['title']}\nBody: {ctx['body']}\nFiles: {files}\nRespond ONLY with a JSON array: [{{'path': 'file', 'content': 'content'}}]"
    
    result = get_ddg_ai(prompt)
    if not result:
        # Fallback to Pollinations AI
        print("☁️ Falling back to Pollinations AI...")
        import urllib.parse
        encoded = urllib.parse.quote(prompt)
        res = requests.get(f"https://text.pollinations.ai/{encoded}?model=openai")
        result = res.text

    if not result or "[]" in result and len(result) < 10:
        print("❌ AI failed to generate a solution.")
        return

    print(f"RAW AI Output: {result}")
    clean = result.strip()
    if clean.startswith("```json"): clean = clean[7:]
    if clean.startswith("```"): clean = clean[3:]
    if clean.endswith("```"): clean = clean[:-3]
    
    try:
        changes = json.loads(clean)
        if not changes:
            print("Empty changes array.")
            return
        
        branch = f"ai-solve-{issue_no}"
        subprocess.run(["git", "checkout", "-b", branch])
        
        for c in changes:
            path = c['path']
            content = c['content']
            os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
            with open(path, "w") as f: f.write(content)
            print(f"✅ Modified {path}")
            
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", f"fix: AI resolve #{issue_no}"])
        subprocess.run(["git", "push", "origin", branch, "--force"])
        
        subprocess.run(["gh", "pr", "create", "--title", f"AI Fix for #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "🤖 AI fix proposed and PR created. Closing issue."])
        print("🚀 Process completed successfully!")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    main()
