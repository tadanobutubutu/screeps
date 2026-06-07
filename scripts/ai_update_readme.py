import os, sys, requests, json, subprocess, time, urllib.parse

def get_repo_context():
    # 1. 基本統計
    workflows = len([f for f in os.listdir('.github/workflows') if f.endswith(('.yml', '.yaml'))])
    roles = len([f for f in os.listdir('.') if f.startswith('role.') and f.endswith('.js')])
    js_files = []
    for root, dirs, files in os.walk('.'):
        if 'node_modules' in dirs: dirs.remove('node_modules')
        if '.git' in dirs: dirs.remove('.git')
        for file in files:
            if file.endswith('.js'):
                js_files.append(os.path.join(root, file))
    
    total_lines = 0
    for f in js_files:
        try:
            with open(f, 'r') as file:
                total_lines += len(file.readlines())
        except: pass

    # 2. 最近の活動
    commits = subprocess.run(["git", "log", "-n", "10", "--pretty=format:%s"], capture_output=True, text=True).stdout
    
    # 3. エージェントの定義（AIに具体的に書かせるための材料）
    agents = {
        "AI Guardian": "セキュリティ（Gitleaks, CodeQL, SonarCloud）、ユニットテスト（Jest）、カバレッジ監視（100%目標）を24時間体制で実行し、問題を発見次第Issueを起票するエージェント。",
        "AI Auto-Coder": "起票された全Issueを分析し、コード修正・テスト作成を行い、あなた（tadanobutubutu）の名義でPRを作成。コンフリクト解消から自動マージ、ブランチ削除までを完遂する開発の核心エージェント。",
        "AI Repo Governance": "READMEやCHANGELOGのAI更新、不要ブランチのインテリジェント整理、新たなクリープロールの動的提案を司る統治エージェント。"
    }

    return {
        "workflows": workflows,
        "roles": roles,
        "js_files_count": len(js_files),
        "total_lines": total_lines,
        "recent_commits": commits,
        "agents_desc": agents
    }

def main():
    print("🚀 AI README Updater (Ultimate Perfection Mode) started.")
    key = os.environ.get("GEMINI_API_KEY")
    ctx = get_repo_context()
    
    # AIへの超詳細な指示
    prompt = f"""
    Screeps AIプロジェクト「ACE (Autonomous Colony Engine)」の、完璧でプロフェッショナルなREADME.mdを日本語で作成してください。
    
    【重要】中途半端な内容は許されません。「システムアーキテクチャ」セクションを含め、すべての項目を具体的かつ詳細に書き下ろしてください。
    
    【プロジェクト情報】
    - 統計: {ctx['workflows']}の自動化ワークフロー, {ctx['roles']}の動的ロール, {ctx['total_lines']}行のコード。
    - 最近の更新: {ctx['recent_commits']}
    
    【エージェント構成】
    1. AI Guardian: {ctx['agents_desc']['AI Guardian']}
    2. AI Auto-Coder: {ctx['agents_desc']['AI Auto-Coder']}
    3. AI Repo Governance: {ctx['agents_desc']['AI Repo Governance']}
    
    【構成案】
    1. **最上部**: キャッチーなタイトルと、build, license, coverage, AI-powered等のバッジ。
    2. **ACEの概要**: 自律進化・自己修復を核としたプロジェクトのビジョン。
    3. **システムアーキテクチャ (詳細)**: 
       - Guardian(監視) -> Auto-Coder(修復) -> Governance(統治) の三位一体ループを技術的に解説してください。
       - Mermaid記法のダイアグラムを必ず含めて視覚化してください。
    4. **コアテクノロジー**: AIによるコンフリクト解消、Issue自動解決、Gitty最適化READMEについて。
    5. **自律的成果ログ**: 最近のコミットから、AIがどのようにプロジェクトを進化させたか具体的に記述。
    6. **セットアップ**: 開発者が即座に開始できる手順。
    
    【ルール】
    - 出力はRAWマークダウンのみ。
    - 解説やバックティックス(```markdown)でのラップは厳禁。
    - 言葉遣いは、洗練され、未来志向で、信頼感のあるものにすること。
    """

    result = ""
    if key:
        print("☁️ Calling Gemini 1.5 Flash...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
        try:
            r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=90)
            if r.status_code == 200:
                result = r.json()['candidates'][0]['content']['parts'][0]['text']
        except: pass

    if not result:
        print("☁️ Falling back to Pollinations...")
        try:
            encoded = urllib.parse.quote(prompt[:3000])
            url = f"https://text.pollinations.ai/{encoded}?model=openai"
            r = requests.get(url, timeout=60)
            if r.status_code == 200:
                result = r.text
        except: pass

    if not result:
        print("❌ All AI failed.")
        return

    # クリーンアップ
    clean = result.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("markdown"): clean = clean[8:]

    with open("README.md", "w") as f:
        f.write(clean)
    
    print("✅ README.md has been PERFECTED by AI!")

if __name__ == "__main__":
    main()
