import os, sys, requests, json, subprocess

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def get_issue_context(issue_no):
    res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body,comments"], capture_output=True, text=True)
    if res.returncode != 0:
        return None
    return json.loads(res.stdout)

def get_ddg_ai(prompt):
    s = requests.Session()
    try:
        r = s.get("https://duckduckgo.com/duckchat/v1/status", headers={"x-vqd-4": "1", "User-Agent": "Mozilla/5.0"})
        vqd = r.headers.get("x-vqd-4")
        if not vqd: return "Error: No VQD"
        res = s.post("https://duckduckgo.com/duckchat/v1/chat", headers={"x-vqd-4": vqd, "Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}, json={"model": "gpt-4o-mini", "messages": [{"role": "user", "content": prompt}]})
        if res.status_code != 200: return f"Error: HTTP {res.status_code}"
        full = ""
        for line in res.text.split('\n'):
            if line.startswith('data: '):
                d = line[6:]
                if d == '[DONE]': break
                try: full += json.loads(d).get('message', '')
                except: continue
        return full
    except Exception as e: return f"Error: {e}"

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    if not issue_no: return
    
    ctx = get_issue_context(issue_no)
    if not ctx:
        comment(issue_no, "Failed to get issue context.")
        return
    
    files = subprocess.run(["find", ".", "-maxdepth", "2", "-not", "-path", "*/.*"], capture_output=True, text=True).stdout
    
    prompt = f"Solve GitHub Issue #{issue_no}: {ctx['title']}\nBody: {ctx['body']}\nFiles: {files}\nRespond ONLY with a JSON array: [{{'path': 'file', 'content': 'content'}}]"
    
    result = get_ddg_ai(prompt)
    if not result or result.startswith("Error:"):
        comment(issue_no, f"AI Provider failed: {result}")
        return

    clean = result.strip()
    if clean.startswith("```json"): clean = clean[7:]
    if clean.startswith("```"): clean = clean[3:]
    if clean.endswith("```"): clean = clean[:-3]
    
    try:
        changes = json.loads(clean)
        if not changes:
            comment(issue_no, "AI returned empty changes.")
            return
        
        branch = f"ai-solve-{issue_no}-{os.environ.get('GITHUB_RUN_ID', '0')}"
        subprocess.run(["git", "checkout", "-b", branch])
        
        for c in changes:
            path = c['path']
            content = c['content']
            os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
            with open(path, "w") as f: f.write(content)
            
        subprocess.run(["git", "config", "user.name", "AI Solver"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", f"fix: AI resolve #{issue_no}"])
        subprocess.run(["git", "push", "origin", branch, "--force"])
        
        subprocess.run(["gh", "pr", "create", "--title", f"AI Fix for #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "🤖 AI fix proposed and PR created. Issue closed automatically."])
    except Exception as e:
        comment(issue_no, f"Parsing/Git Error: {e}\nRaw Output: {result[:500]}")

if __name__ == "__main__":
    main()
