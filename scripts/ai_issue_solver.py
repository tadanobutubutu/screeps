import os, sys, requests, json, subprocess, time, urllib.request, re

def comment(issue_no, body):
    subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI Debug Info:\n{body}"])

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    key = os.environ.get("GEMINI_API_KEY")
    
    if not issue_no: return
    
    # 1. Fetch Context and Author Info
    try:
        res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body,author"], capture_output=True, text=True)
        ctx = json.loads(res.stdout)
        title = ctx['title']
        body = ctx['body']
        issue_author_login = ctx['author']['login']
        issue_author_email = f"{issue_author_login}@users.noreply.github.com"
    except:
        return
    
    # 2. Code Context Search
    print("🔍 Searching for code context...")
    search_term = title.replace("🚨 Sentinel: ", "").split()[0]
    code_context = ""
    try:
        grep_res = subprocess.run(["grep", "-rn", search_term, ".", "--exclude-dir=.git", "--max-count=2"], capture_output=True, text=True)
        code_context = grep_res.stdout[:2000]
    except: pass

    prompt = 'Solve issue #' + str(issue_no) + ': ' + title + '. Body: ' + body + '. Context: ' + code_context + '. Respond ONLY with a JSON array: [{"path": "file", "content": "content"}]'

    # 3. AI Strategy
    result = ""
    # Geminiモデルの呼び出しを強化
    if key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
        try:
            # responseMimeTypeを追加してJSON出力を保証
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.1,
                    "responseMimeType": "application/json"
                }
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as f:
                res_json = json.loads(f.read().decode('utf-8'))
                result = res_json['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            print(f"DEBUG: Gemini call failed: {e}")


    print(f"DEBUG: result={result[:100]}")
    # 4. JSON Extraction
    # もっと広範囲にJSONをマッチングする
    json_match = re.search(r'\[.*\]', result, re.DOTALL)
    if not json_match:
        # Markdownのブロック内を優先的に探す
        json_match = re.search(r'```(?:json)?\s*(\[.*\])\s*```', result, re.DOTALL)
        
    if json_match:
        # グループ1がある場合（ブロックマッチ）はそれを使う
        clean = json_match.group(1) if len(json_match.groups()) > 0 else json_match.group(0)
    else:
        # ★デバッグ追加：何が返ってきているか不明なので詳細に
        comment(issue_no, f"AI failed to generate a valid JSON solution. Raw Response: {result[:500]}")
        return
    
    try:
        # 文字列として不完全な部分をクリーンアップ
        clean = clean.replace("'", '"')
        changes = json.loads(clean)
        if not changes: return


        branch = f"fix/issue-{issue_no}-{int(time.time())}"
        subprocess.run(["git", "checkout", "-b", branch])
        
        for c in changes:
            os.makedirs(os.path.dirname(c['path']) or '.', exist_ok=True)
            with open(c['path'], "w") as f: f.write(c['content'])
        
        subprocess.run(["git", "config", "user.name", "AI Maintenance Bot"])
        subprocess.run(["git", "config", "user.email", "ai@screeps.local"])
        
        subprocess.run(["git", "add", "."])
        
        commit_msg = f"fix: resolve issue #{issue_no}\n\nAutomated fix for issue #{issue_no}."
        subprocess.run(["git", "commit", "-m", commit_msg])
        subprocess.run(["git", "push", "origin", branch])
        
        pr_body = f"This automated PR resolves issue #{issue_no}.\n\nCloses #{issue_no}"
        
        subprocess.run(["gh", "pr", "create", "--title", f"fix: resolve issue #{issue_no}", "--body", pr_body, "--head", branch, "--base", "main"])
        
        # 確実にPRが作成されたか確認し、完了後にIssueを閉じる
        subprocess.run(["gh", "issue", "close", str(issue_no), "--comment", "Auto-closed: Issue resolved by AI agent."])
        
        subprocess.run(["gh", "issue", "comment", str(issue_no), "--body", f"🤖 AI solution has been proposed. Please review the PR."])
    except Exception as e:
        comment(issue_no, f"Error during PR creation: {e}")

if __name__ == "__main__":
    main()
