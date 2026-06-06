import os, sys, requests, json, subprocess, time, urllib.request

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    title = os.environ.get("ISSUE_TITLE")
    body = os.environ.get("ISSUE_BODY")
    key = os.environ.get("GEMINI_API_KEY")
    # User's GitHub identity for credit
    user_author = "tadanobutubutu <tadanobutubutu@users.noreply.github.com>"
    
    if not issue_no: return
    
    # 1. Fetch Context
    if not title or not body:
        try:
            res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
            ctx = json.loads(res.stdout)
            title = ctx['title']
            body = ctx['body']
        except: return

    # 2. Code Context Search
    print("🔍 Searching for code context...")
    search_term = title.replace("🚨 Sentinel: ", "").split()[0]
    code_context = ""
    try:
        grep_res = subprocess.run(["grep", "-rn", search_term, ".", "--exclude-dir=.git", "--max-count=2"], capture_output=True, text=True)
        code_context = grep_res.stdout[:2000]
    except: pass

    prompt = f"Solve issue #{issue_no}: {title}. Body: {body}. Context: {code_context}. Respond ONLY with a JSON array: [{{'path': 'file', 'content': 'content'}}]"

    # 3. AI Strategy (Gemini Primary, Pollinations Fallback)
    result = ""
    if key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
        try:
            payload = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"temperature": 0.1}}
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as f:
                res_json = json.loads(f.read().decode('utf-8'))
                result = res_json['candidates'][0]['content']['parts'][0]['text']
        except: pass

    if not result or "[" not in result:
        try:
            url = "https://text.pollinations.ai/"
            payload = json.dumps({"messages": [{"role": "user", "content": prompt}], "model": "openai"}).encode('utf-8')
            req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as f:
                result = f.read().decode('utf-8')
        except: pass

    if not result or "[" not in result:
        comment(issue_no, "AI failed to generate a solution.")
        return

    # 4. Clean and Apply to NEW BRANCH
    clean = result.strip()
    if "```" in clean:
        clean = clean.split("```")[1]
        if clean.startswith("json"): clean = clean[4:]
    
    try:
        changes = json.loads(clean)
        if not changes: return

        branch = f"fix/issue-{issue_no}-{int(time.time())}"
        subprocess.run(["git", "checkout", "-b", branch])
        
        for c in changes:
            os.makedirs(os.path.dirname(c['path']) or '.', exist_ok=True)
            with open(c['path'], "w") as f: f.write(c['content'])
        
        # Give user credit by making them the author
        subprocess.run(["git", "config", "user.name", "tadanobutubutu"])
        subprocess.run(["git", "config", "user.email", "tadanobutubutu@users.noreply.github.com"])
        subprocess.run(["git", "add", "."])
        # Commit message without mentioning Gitty or credit
        commit_msg = f"fix: resolve issue #{issue_no}\n\nAutomated fix provided by AI Sentinel.\nAuthor: {user_author}"
        subprocess.run(["git", "commit", "-m", commit_msg, f"--author={user_author}"])
        subprocess.run(["git", "push", "origin", branch])
        
        # Create PR
        pr_body = f"This automated PR resolves issue #{issue_no}.\n\n- Fixes: {title}\n- Contributor: @tadanobutubutu\n\nCloses #{issue_no}"
        subprocess.run(["gh", "pr", "create", "--title", f"fix: resolve issue #{issue_no}", "--body", pr_body, "--head", branch, "--base", "main"])
        
        # Don't close issue yet - wait for PR merge
        subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", "🤖 AI solution has been proposed in a new PR. Please review and merge."])
    except Exception as e:
        comment(issue_no, f"Error during PR creation: {e}")

if __name__ == "__main__":
    main()
