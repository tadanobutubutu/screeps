import os, sys, requests, json, subprocess, time, urllib.parse

def get_repo_context():
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

    commits = subprocess.run(["git", "log", "-n", "5", "--pretty=format:%s"], capture_output=True, text=True).stdout
    ai_activity = subprocess.run(["git", "log", "-n", "10", "--grep=AI", "--pretty=format:%s"], capture_output=True, text=True).stdout

    return {
        "workflows": workflows,
        "roles": roles,
        "js_files_count": len(js_files),
        "total_lines": total_lines,
        "recent_commits": commits,
        "ai_activity": ai_activity
    }

def main():
    print("🚀 AI README Updater started.")
    key = os.environ.get("GEMINI_API_KEY")
    ctx = get_repo_context()
    
    prompt = f"""
    Create a highly professional and dynamic GitHub README in Japanese for a Screeps AI project.
    
    Context:
    - Fully automated repo.
    - Statistics: {ctx['workflows']} workflows, {ctx['roles']} roles, {ctx['js_files_count']} JS files.
    - Recent AI Success: {ctx['ai_activity'] if ctx['ai_activity'] else 'Initial setup and optimization'}
    - Recent Commits: {ctx['recent_commits']}
    
    Structure:
    1. Catchy Title and Badges
    2. Dynamic Overview (mention automation)
    3. Recent AI Activities section (list the recent AI achievements)
    4. Repo Statistics
    5. How it works (AI resolvers)
    
    Return ONLY markdown.
    """

    result = ""
    # Strategy 1: Gemini Direct (Correct ID)
    if key:
        print("☁️ Trying Gemini...")
        for model in ["gemini-1.5-flash", "gemini-pro"]:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
            try:
                r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=60)
                if r.status_code == 200:
                    result = r.json()['candidates'][0]['content']['parts'][0]['text']
                    break
            except: pass

    # Strategy 2: Pollinations AI (GET is more stable)
    if not result:
        print("☁️ Trying Pollinations (Fallback)...")
        try:
            encoded_prompt = urllib.parse.quote(prompt[:1000])
            url = f"https://text.pollinations.ai/{encoded_prompt}?model=openai"
            r = requests.get(url, timeout=60)
            if r.status_code == 200:
                result = r.text
        except: pass

    if not result:
        print("❌ AI failed. Using static template.")
        return

    clean = result.strip()
    if "```markdown" in clean: clean = clean.split("```markdown")[1].split("```")[0]
    elif "```" in clean: clean = clean.split("```")[1].split("```")[0]

    with open("README.md", "w") as f:
        f.write(clean)
    print("✅ README.md updated!")

if __name__ == "__main__":
    main()
