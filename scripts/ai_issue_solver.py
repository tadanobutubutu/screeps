import os, sys, requests, json, subprocess, time, urllib.parse

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    if not issue_no: return
    
    prompt = "Create a JSON array with one object: path is 'AI_SUCCESS.txt', content is 'AI HAS RESOLVED'. JSON ONLY."
    
    print("☁️ Calling Pollinations AI (GET)...")
    try:
        url = f"https://text.pollinations.ai/{urllib.parse.quote(prompt)}?model=openai"
        r = requests.get(url, timeout=30)
        result = r.text
        print(f"RAW: {result}")
        
        if "[" in result and "]" in result:
            clean = result[result.find("["):result.rfind("]")+1]
            changes = json.loads(clean)
            branch = f"ai-verify-{int(time.time())}"
            subprocess.run(["git", "checkout", "-b", branch])
            for c in changes:
                with open(c['path'], "w") as f: f.write(c['content'])
            subprocess.run(["git", "config", "user.name", "AI Solver"])
            subprocess.run(["git", "config", "user.email", "ai@example.com"])
            subprocess.run(["git", "add", "."])
            subprocess.run(["git", "commit", "-m", "fix: AI auto-verify"])
            subprocess.run(["git", "push", "origin", branch])
            subprocess.run(["gh", "pr", "create", "--title", "AI Verification", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
            subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "✅ AI test successful!"])
        else:
            comment(issue_no, f"AI returned non-JSON: {result[:200]}")
    except Exception as e:
        comment(issue_no, f"Error: {e}")

if __name__ == "__main__":
    main()
