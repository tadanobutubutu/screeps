import os, sys, json, subprocess, time, urllib.request

def main():
    print("🚀 AI Branch Cleanup script started.")
    
    # 1. Get all branches and metadata
    # Format: refname, last commit date (ISO), upstream merge status
    res = subprocess.run(["git", "for-each-ref", "--format=%(refname:short)|%(authordate:iso8601)|%(upstream:track)", "refs/remotes/origin"], capture_output=True, text=True)
    branches_raw = res.stdout.strip().split('\n')
    
    # 2. Get branches with open PRs
    res_pr = subprocess.run(["gh", "pr", "list", "--state", "open", "--json", "headRefName"], capture_output=True, text=True)
    open_prs = [p['headRefName'] for p in json.loads(res_pr.stdout)]
    
    branch_data = []
    for line in branches_raw:
        if not line: continue
        parts = line.split('|')
        name = parts[0].replace('origin/', '')
        date = parts[1]
        track = parts[2]
        
        # Protective filters:
        if name in ["main", "master", "HEAD"]: continue
        if name in open_prs: continue
        
        branch_data.append({
            "name": name,
            "last_commit": date,
            "status": "merged" if "gone" in track or not track else "active"
        })

    if not branch_data:
        print("✅ No branches to cleanup.")
        return

    # 3. AI Judgment
    prompt = f"""
    You are a repo maintainer. Decide which branches to DELETE. 
    Branches list: {json.dumps(branch_data)}
    
    Criteria:
    - DELETE if merged/gone.
    - DELETE if no activity for 30+ days and no open PR.
    - KEEP if it looks like a long-term feature or protected branch.
    
    Respond ONLY with a JSON array of branch names to delete: ["branch1", "branch2"]
    """
    
    result = ""
    # Try Gemini Direct
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
        try:
            payload = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"response_mime_type": "application/json"}}
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=30) as f:
                res_json = json.loads(f.read().decode('utf-8'))
                result = res_json['candidates'][0]['content']['parts'][0]['text']
        except: pass

    if not result:
        # Fallback: simple logic (delete merged ones)
        print("⚠️ AI failed, using safe fallback logic.")
        to_delete = [b['name'] for b in branch_data if b['status'] == "merged"]
    else:
        try:
            to_delete = json.loads(result)
        except:
            to_delete = [b['name'] for b in branch_data if b['status'] == "merged"]

    # 4. Execute Deletion
    for branch in to_delete:
        # Final safety check: never delete main/master
        if branch in ["main", "master"]: continue
        print(f"🗑️ Deleting branch: {branch}")
        subprocess.run(["git", "push", "origin", "--delete", branch])

    print("🚀 Cleanup finished!")

if __name__ == "__main__":
    main()
