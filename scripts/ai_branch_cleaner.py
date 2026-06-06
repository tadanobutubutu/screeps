import os, sys, json, subprocess, time, urllib.request, re

def get_issue_status(issue_id):
    if not issue_id: return None
    try:
        # Use gh api for issue check to be fast
        res = subprocess.run(["gh", "issue", "view", issue_id, "--json", "state"], capture_output=True, text=True)
        if res.returncode == 0:
            return json.loads(res.stdout).get('state')
    except: pass
    return None

def get_recent_runs(branch):
    try:
        res = subprocess.run(["gh", "run", "list", "--branch", branch, "--limit", "1", "--json", "status,conclusion"], capture_output=True, text=True)
        if res.returncode == 0:
            return json.loads(res.stdout)
    except: pass
    return []

def main():
    print("🚀 AI Hyper-Contextual Branch Cleanup started.")
    
    # 1. 物理的な絶対保護リスト
    PROTECTED_PATTERNS = ["main", "master", "prod", "production", "ptr", "gh-pages", "documentation", "stable", "release", " ACE"]
    
    # 2. オープンなPRに関連するブランチを取得
    res_pr = subprocess.run(["gh", "pr", "list", "--state", "open", "--json", "headRefName"], capture_output=True, text=True)
    open_prs = [p['headRefName'] for p in json.loads(res_pr.stdout)]
    
    # 3. ブランチ詳細情報の収集
    fmt = "%(refname:short)|%(authordate:unix)|%(authorname)|%(authoremail)|%(subject)|%(upstream:track)"
    res = subprocess.run(["git", "for-each-ref", "--format=" + fmt, "refs/remotes/origin"], capture_output=True, text=True)
    branches_raw = res.stdout.strip().split('\n')
    
    now = int(time.time())
    branch_data = []
    
    for line in branches_raw:
        if not line: continue
        parts = line.split('|')
        full_name = parts[0]
        name = full_name.replace('origin/', '')
        last_commit_time = int(parts[1])
        author_name = parts[2]
        author_email = parts[3]
        subject = parts[4]
        track = parts[5]
        
        # --- 基本的な保護フィルター ---
        if any(p in name.lower() for p in PROTECTED_PATTERNS): continue
        if name in open_prs: continue
        
        age_days = (now - last_commit_time) // 86400
        if age_days < 14: continue # 最近のものは絶対に消さない

        # --- コンテキスト情報の収集 ---
        
        # main との差分 (Ahead/Behind)
        dist_res = subprocess.run(["git", "rev-list", "--left-right", "--count", f"origin/main...{full_name}"], capture_output=True, text=True)
        behind, ahead = (0, 0)
        if dist_res.returncode == 0:
            behind, ahead = map(int, dist_res.stdout.split())

        # 変更されたファイルのサンプル
        diff_res = subprocess.run(["git", "diff", "--name-only", "origin/main", full_name], capture_output=True, text=True)
        files_changed = diff_res.stdout.strip().split('\n') if diff_res.returncode == 0 else []
        files_sample = [f for f in files_changed if f][:5]
        
        # 関連するIssueの状態 (名前に数字が含まれる場合)
        issue_match = re.search(r'(\d+)', name)
        issue_status = get_issue_status(issue_match.group(1)) if issue_match else None
        
        # 最近のワークフロー実行
        runs = get_recent_runs(name)
        
        # ボットかどうか
        is_bot = "github.com" in author_email.lower() or author_name.lower() in ["github actions", "github-actions"]

        branch_data.append({
            "name": name,
            "author": author_name,
            "is_bot": is_bot,
            "subject": subject,
            "age_days": age_days,
            "ahead": ahead,
            "behind": behind,
            "files_changed_count": len(files_changed),
            "files_sample": files_sample,
            "issue_status": issue_status,
            "recent_runs": runs,
            "is_merged": "gone" in track or (ahead == 0 and behind > 0)
        })

    if not branch_data:
        print("✅ No stale branches found for analysis.")
        return

    # 4. AIによる戦略的判断
    prompt = f"""
    You are an expert repository janitor. Decide which of these STALE branches should be DELETED.
    Data: {json.dumps(branch_data)}
    
    Deletion Rules:
    - DELETE if 'is_merged' is true and 'ahead' is 0.
    - DELETE if 'issue_status' is 'CLOSED' and 'ahead' is small (<3).
    - DELETE if created by a bot and has been idle for 30+ days.
    - KEEP if 'issue_status' is 'OPEN'.
    - KEEP if 'ahead' is significant (>5) - someone worked hard on this!
    - KEEP if it touches core engine files (like 'main.js') and is not merged.
    - KEEP if unsure. 'ACE' related branches are precious.
    
    Respond ONLY with a JSON array of names to delete: ["branch1", "branch2"]
    """
    
    result = ""
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
        try:
            payload = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"response_mime_type": "application/json"}}
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as f:
                res_json = json.loads(f.read().decode('utf-8'))
                result = res_json['candidates'][0]['content']['parts'][0]['text']
        except: pass

    to_delete = []
    if result:
        try:
            to_delete = json.loads(result)
            # Validation
            allowed_names = [b['name'] for b in branch_data]
            to_delete = [n for n in to_delete if n in allowed_names]
        except: pass

    # 5. 実行
    deleted_count = 0
    for branch in to_delete:
        if branch.lower() in ["main", "master", "prod", "gh-pages", "ptr"]: continue
        print(f"🗑️ Purging stale branch: {branch}")
        subprocess.run(["git", "push", "origin", "--delete", branch])
        deleted_count += 1

    print(f"🚀 Cleanup complete. {deleted_count} branches removed.")

if __name__ == "__main__":
    main()
