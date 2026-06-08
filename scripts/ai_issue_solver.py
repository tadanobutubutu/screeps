import os, sys, requests, json, subprocess, time, urllib.request, re

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    key = os.environ.get("GEMINI_API_KEY")
    if not issue_no: return
    
    try:
        res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
        ctx = json.loads(res.stdout)
        title = ctx['title']
        body = ctx['body']
    except: return
    
    result = ""
    model_configs = [
        {"url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent", "key": key}
    ]
    
    prompt = f"Fix issue #{issue_no}: {title}. Body: {body}. Output format: PATH: <file> \n CODE: ```javascript\n<code>\n```"
    
    for config in model_configs:
        try:
            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            req = urllib.request.Request(f"{config['url']}?key={config['key']}", data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as f:
                res = json.loads(f.read().decode('utf-8'))
                result = res['candidates'][0]['content']['parts'][0]['text']
            if "PATH:" in result: break
        except: continue
    
    path = re.search(r'PATH:\s*(\S+)', result).group(1) if re.search(r'PATH:\s*(\S+)', result) else "main.js"
    code = re.search(r'```(?:javascript|js)?\s*(.*?)\s*```', result, re.DOTALL).group(1) if re.search(r'```(?:javascript|js)?\s*(.*?)\s*```', result, re.DOTALL) else "// pending"
    
    branch = f"fix/issue-{issue_no}-{int(time.time())}"
    subprocess.run(["git", "checkout", "-b", branch])
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, "w") as f: f.write(code)
    
    subprocess.run(["git", "config", "user.name", "AI Bot"])
    subprocess.run(["git", "config", "user.email", "ai@local"])
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", f"fix: #{issue_no}"])
    subprocess.run(["git", "push", "origin", branch])
    subprocess.run(["gh", "pr", "create", "--title", f"Fix #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
    subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "Resolved."])

if __name__ == "__main__": main()
