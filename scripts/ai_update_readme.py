import os, sys, requests, json, subprocess, time, urllib.parse

def get_repo_context():
    # 1. Get stats
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

    # 2. Get recent activity
    commits = subprocess.run(["git", "log", "-n", "10", "--pretty=format:%s"], capture_output=True, text=True).stdout
    
    # 3. Get contributor stats
    contributors = subprocess.run(["git", "shortlog", "-sn", "HEAD"], capture_output=True, text=True).stdout

    return {
        "workflows": workflows,
        "roles": roles,
        "js_files_count": len(js_files),
        "total_lines": total_lines,
        "recent_commits": commits,
        "contributors": contributors
    }

def main():
    print("🚀 AI README Updater started (Professional Edition).")
    key = os.environ.get("GEMINI_API_KEY")
    ctx = get_repo_context()
    
    # Guidelines for high-quality README (Gitty-optimized structure)
    prompt = f"""
    Generate a high-quality, professional, and visually appealing GitHub README in Japanese for this Screeps AI project.
    
    Project Context:
    - Fully Autonomous Screeps AI Colony.
    - Features 'AI Sentinel' (self-monitoring) and 'AI Issue Resolver' (self-healing).
    - Current Stats: {ctx['workflows']} automation workflows, {ctx['roles']} specialized roles, {ctx['total_lines']} LOC.
    - Recent Activity: {ctx['recent_commits']}
    
    Structure Requirements:
    1. **Project Title & Catchy Badges**: Use badges for build status, license, coverage, and 'AI-powered'.
    2. **Executive Summary**: 2-3 sentences explaining the "Autonomous Evolution" core concept.
    3. **Core Features**: Highlight 'Self-Healing (Issue/Conflict resolution)' and 'Dynamic Role Generation'.
    4. **System Architecture**: Brief explanation of how Sentinel, Resolver, and Game Logic interact.
    5. **Getting Started**: Clear installation and execution commands.
    6. **AI Evolution Log**: A dynamic section summarizing recent AI-driven improvements based on commit history.
    7. **Contribution & License**: Professional placeholders.
    
    Tone: Sophisticated, innovative, reliable. 
    Language: Japanese (Technical terms can remain in English).
    Return ONLY RAW MARKDOWN. NO CODE BLOCKS.
    """

    result = ""
    if key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
        try:
            r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=60)
            if r.status_code == 200:
                result = r.json()['candidates'][0]['content']['parts'][0]['text']
        except: pass

    if not result:
        try:
            encoded = urllib.parse.quote(prompt[:2000])
            url = f"https://text.pollinations.ai/{encoded}?model=openai"
            r = requests.get(url, timeout=60)
            if r.status_code == 200:
                result = r.text
        except: pass

    if not result: return

    clean = result.strip()
    # Ensure no markdown wrapping
    if "```" in clean:
        parts = clean.split("```")
        for p in parts:
            if "# " in p:
                clean = p
                if clean.startswith("markdown"): clean = clean[8:]
                break

    with open("README.md", "w") as f:
        f.write(clean)
    
    print("✅ README.md updated with professional AI content!")

if __name__ == "__main__":
    main()
