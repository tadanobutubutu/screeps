import os, sys, json, subprocess, urllib.request, re

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    key = os.environ.get("GEMINI_API_KEY")
    if not issue_no: return
    
    # データを取得してAIに投げる
    res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
    ctx = json.loads(res.stdout)
    prompt = f"Fix issue #{issue_no}: {ctx['title']}. Body: {ctx['body']}. Write ONLY code, no explanation, wrapped in ```javascript```"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key={key}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    with urllib.request.urlopen(req, timeout=60) as f:
        res = json.loads(f.read().decode('utf-8'))
        full_text = res['candidates'][0]['content']['parts'][0]['text']
    
    # デバッグ用に全テキストをコメントする
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"DEBUG: Model Response:\n{full_text[:500]}"])
    
    # ファイル名推定とコード抽出
    path = "main.js" # デフォルト
    code = full_text
    match = re.search(r"```(?:javascript|js)?\s*(.*?)\s*```", full_text, re.DOTALL)
    if match: code = match.group(1)

    # PR作成
    branch = f"fix/ai-{issue_no}"
    subprocess.run(["git", "checkout", "-b", branch])
    with open(path, "w") as f: f.write(code)
    subprocess.run(["git", "add", path])
    subprocess.run(["git", "commit", "-m", f"fix: {issue_no}"])
    subprocess.run(["git", "push", "origin", branch])
    subprocess.run(["gh", "pr", "create", "--title", f"Fix #{issue_no}", "--body", f"Closes #{issue_no}", "--head", branch, "--base", "main"])
    subprocess.run(["gh", "issue", "close", str(issue_no)])

if __name__ == "__main__": main()
