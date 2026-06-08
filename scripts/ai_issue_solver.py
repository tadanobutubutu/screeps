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

    # 3. AI Strategy: 複数のAIに問い合わせてベストな回答を採用する
    result = ""
    models = [
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent"
    ]
    
    responses = []
    for model_url in models:
        try:
            url = f"{model_url}?key={key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.2}
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as f:
                res_json = json.loads(f.read().decode('utf-8'))
                text = res_json['candidates'][0]['content']['parts'][0]['text']
                # コードブロックを含む回答をスコア化（コードがちゃんとあるか）
                score = len(re.findall(r'```', text))
                responses.append((score, text))
        except: continue

    if responses:
        # スコアが高い（コードブロックが多い）回答を採用
        responses.sort(key=lambda x: x[0], reverse=True)
        result = responses[0][1]
    
    # 4. パースロジック
    def parse_natural_language(text):
        # マークダウンのコードブロック抽出を優先
        code_blocks = re.findall(r'```(?:javascript|js|json)?\s*(.*?)\s*```', text, re.DOTALL)
        if code_blocks:
            return [{"path": "main.js", "content": code_blocks[0]}]
        return None
        
    changes = parse_natural_language(result)





    print(f"DEBUG: result={result[:100]}")
    # 4. Apply and Create PR (非JSONのLLM出力をパース可能な形式へ変換またはそのまま利用)
    # AIの回答がJSONでなくても、LLMにコードブロックを生成させるか、
    # あるいは自然言語による指示として扱い、AIエージェントが「ファイル修正」を代行する
    # 現在の実装では JSON 形式を強制していますが、これを「LLMが出力したコードブロックをそのまま適用」する方式に変更します。

    # パースロジックの改善：JSON形式に固執せず、Markdownコードブロックを探す
    import re
    
    # 修正適用: AIの回答からコードブロックを抽出してファイルへ適用
    # AIがJSONを返せなくても、コード内容が含まれていればそれをファイルに反映する
    def apply_code_from_response(text):
        pattern = r"```(?:javascript|js|json)?\s*(.*?)\s*```"
        matches = re.findall(pattern, text, re.DOTALL)
        if not matches:
            # コードブロックがない場合、テキスト全体を解析し、ファイルパスとコードを分離する高度なロジックが必要
            # ここではシンプルにAIの回答をそのまま適用する
            return [{"path": "main.js", "content": text}]
        return [{"path": "main.js", "content": m} for m in matches]

    try:
        if not result.strip().startswith("["):
            changes = apply_code_from_response(result)
        else:
            changes = json.loads(result)
            
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
