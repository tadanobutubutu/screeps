import os, sys, json, subprocess, time, urllib.request

def main():
    print("🚀 AI Conservative Branch Cleanup started.")
    
    # 1. 物理的な保護リスト（絶対に触らない）
    PROTECTED_PATTERNS = ["main", "master", "prod", "production", "ptr", "gh-pages", "documentation"]
    
    # 2. オープンなPRに関連するブランチを取得
    res_pr = subprocess.run(["gh", "pr", "list", "--state", "open", "--json", "headRefName"], capture_output=True, text=True)
    open_prs = [p['headRefName'] for p in json.loads(res_pr.stdout)]
    
    # 3. 全ブランチの詳細情報を取得
    # %(refname:short)|%(authordate:unix)|%(authorname)|%(subject)|%(upstream:track)
    fmt = "%(refname:short)|%(authordate:unix)|%(authorname)|%(subject)|%(upstream:track)"
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
        author = parts[2]
        subject = parts[3]
        track = parts[4]
        
        # --- 強力な保護フィルター ---
        
        # 1. 直接的な保護名
        if any(p in name.lower() for p in PROTECTED_PATTERNS):
            continue
        
        # 2. オープンなPRがある
        if name in open_prs:
            continue
            
        # 3. 最近活動があった（14日以内は無条件でキープ）
        age_days = (now - last_commit_time) // 86400
        if age_days < 14:
            continue

        # 4. 特定のシステムが使いそうな名前 (Kodiak, gitstream, renovate等)
        if any(sys_name in name.lower() for sys_name in ["kodiak", "gitstream", "renovate", "dependabot", "mergify"]):
            # システム系はマージ済み(gone)でない限り慎重に扱う
            if "gone" not in track:
                continue

        branch_data.append({
            "name": name,
            "author": author,
            "subject": subject,
            "age_days": age_days,
            "status": "merged/gone" if "gone" in track or not track else "unmerged/active"
        })

    if not branch_data:
        print("✅ No redundant branches identified for analysis.")
        return

    # 4. AIによる「意図」の解析
    # ブランチ名とコミットメッセージから、それが「捨てていいゴミ」か「大事な作業の残骸」か判断させる
    prompt = f"""
    You are an expert Git administrator. Decide which of these STALE branches (no activity for 14+ days) are safe to DELETE.
    
    Data: {json.dumps(branch_data)}
    
    Policy:
    - BE EXTREMELY CONSERVATIVE. If you are unsure, do NOT delete.
    - DELETE if: 
        1. It is clearly a temporary test (e.g., 'test-xyz', 'debug-123').
        2. It is 'merged/gone' and the commit message indicates a completed task.
    - KEEP if:
        1. It is a 'fix/' or 'feat/' branch that might be a work-in-progress even if old.
        2. It belongs to a human developer who might return to it.
        3. The commit message looks like an important unmerged feature.
    
    Respond ONLY with a JSON array of branch names to delete: ["name1", "name2"]
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

    if not result:
        # Fallback: 消さない（安全第一）
        print("⚠️ AI evaluation failed or skipped. Deleting nothing for safety.")
        to_delete = []
    else:
        try:
            to_delete = json.loads(result)
            # 念のため、to_deleteに含まれるものが本当にbranch_dataにあるか（AIの幻覚対策）
            allowed_names = [b['name'] for b in branch_data]
            to_delete = [n for n in to_delete if n in allowed_names]
        except:
            to_delete = []

    # 5. 実行
    deleted_count = 0
    for branch in to_delete:
        # 最終的な防衛ライン（コード上でも絶対に消さないものを再定義）
        if branch.lower() in ["main", "master", "prod", "ptr", "gh-pages"]:
            continue
            
        print(f"🗑️ Deleting stale branch: {branch}")
        subprocess.run(["git", "push", "origin", "--delete", branch])
        deleted_count += 1

    print(f"🚀 Cleanup finished. Deleted {deleted_count} branches.")

if __name__ == "__main__":
    main()
