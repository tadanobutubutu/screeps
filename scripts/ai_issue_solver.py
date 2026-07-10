import os, sys, json, subprocess, time, urllib.request, re

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    hf_token = os.environ.get("HUGGINGFACE_TOKEN")
    if not issue_no or not hf_token: return
    
    # 1. Fetch Issue
    try:
        res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
        ctx = json.loads(res.stdout)
    except: return
    
    # 2. Call HF
    model_url = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct"
    prompt = f"Fix this JS code error: {ctx['title']}. {ctx['body']}. Provide ONLY code block."
    
    try:
        payload = {"inputs": prompt, "parameters": {"max_new_tokens": 1000}}
        headers = {"Authorization": f"Bearer {hf_token}", "Content-Type": "application/json"}
        req = urllib.request.Request(model_url, data=json.dumps(payload).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req, timeout=60) as f:
            res = json.loads(f.read().decode('utf-8'))
            result = res[0].get('generated_text', '')
    except: result = "// Fix pending"
    
    # 3. Apply
    code = re.search(r"```(?:javascript|js)?\s*(.*?)\s*```", result, re.DOTALL)
    code = code.group(1) if code else result
    
    branch = f"fix/ai-{issue_no}"
    subprocess.run(["git", "checkout", "-b", branch])
    with open("main.js", "w") as f: f.write(code)
    
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", f"fix: {issue_no}"])
    subprocess.run(["git", "push", "origin", branch])
    subprocess.run(["gh", "pr", "create", "--title", f"Fix #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
    subprocess.run(["gh", "issue", "close", str(issue_no)])

if __name__ == "__main__": main()
