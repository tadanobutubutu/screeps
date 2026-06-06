import os, sys, requests, json, subprocess, time, urllib.parse

def get_repo_context():
    # 1. Get stats (number of files, workflows, roles)
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

    # 2. Get recent commits (last 10)
    commits = subprocess.run(["git", "log", "-n", "10", "--pretty=format:%s"], capture_output=True, text=True).stdout
    
    # 3. Get recent AI activity
    ai_activity = subprocess.run(["git", "log", "-n", "20", "--grep=AI", "--pretty=format:%s"], capture_output=True, text=True).stdout

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
    Create a modern, professional, and highly engaging GitHub README for a Screeps AI project.
    
    Project Context:
    - This project is a fully automated Screeps AI.
    - It features AI-driven issue resolution and conflict merging.
    - Statistics:
      - {ctx['workflows']} Automation Workflows
      - {ctx['roles']} Specialized Creep Roles
      - {ctx['js_files_count']} JS Files ({ctx['total_lines']} lines of code)
    
    Recent Activities:
    {ctx['recent_commits']}
    
    AI Achievements:
    {ctx['ai_activity']}
    
    Requirements:
    - Use impressive badges.
    - Add a section about the "Ultimate Automation" (AI Issue Resolver, AI Conflict Resolver).
    - Make it sound cutting-edge and "alive".
    - Include a dynamic "Recent AI Activity" section based on the context.
    - Use Japanese as the primary language (since the user requested it previously).
    
    Return ONLY the raw markdown content. No explanations.
    """

    result = ""
    # Strategy 1: Gemini Direct
    if key:
        print("☁️ Trying Gemini...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
        try:
            r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=60)
            if r.status_code == 200:
                result = r.json()['candidates'][0]['content']['parts'][0]['text']
                print("✅ Gemini responded.")
        except: pass

    # Strategy 2: Pollinations AI
    if not result:
        print("☁️ Trying Pollinations...")
        try:
            url = f"https://text.pollinations.ai/{urllib.parse.quote(prompt[:2000])}?model=openai"
            r = requests.get(url, timeout=60)
            if r.status_code == 200:
                result = r.text
                print("✅ Pollinations responded.")
        except: pass

    if not result:
        print("❌ All AI failed.")
        return

    # Clean markdown
    clean = result.strip()
    if clean.startswith("```markdown"): clean = clean[11:]
    if clean.startswith("```"): clean = clean[3:]
    if clean.endswith("```"): clean = clean[:-3]

    with open("README.md", "w") as f:
        f.write(clean)
    
    print("✅ README.md updated with AI content!")

if __name__ == "__main__":
    main()
