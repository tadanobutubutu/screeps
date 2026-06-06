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

    commits = subprocess.run(["git", "log", "-n", "10", "--pretty=format:%s"], capture_output=True, text=True).stdout
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
    print("🚀 AI README Updater started (2026 Edition).")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    openrouter_token = os.environ.get("OPENROUTER_TOKEN")
    ctx = get_repo_context()
    
    prompt = f"""
    Create a highly professional and dynamic GitHub README in Japanese for a Screeps AI project.
    
    Stats: {ctx['workflows']} workflows, {ctx['roles']} roles, {ctx['js_files_count']} files.
    Recent AI Success: {ctx['ai_activity'] if ctx['ai_activity'] else 'Full automation integrated.'}
    Recent Activity: {ctx['recent_commits']}
    
    Requirements:
    - Use cool badges.
    - Mention the 'Ultimate Automation' system (Issue/Conflict Resolver).
    - Use Japanese.
    - Return RAW markdown only.
    """

    result = ""
    
    # Strategy 1: Gemini Direct (2026 Model IDs)
    if gemini_key and not result:
        print("☁️ Trying Gemini Direct (v1beta)...")
        models = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-1.5-flash"]
        for model in models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key}"
            try:
                r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=30)
                if r.status_code == 200:
                    result = r.json()['candidates'][0]['content']['parts'][0]['text']
                    print(f"✅ Success with {model}!")
                    break
            except: pass

    # Strategy 2: OpenRouter (Resilient Fallback)
    if openrouter_token and not result:
        print("☁️ Trying OpenRouter...")
        models = ["anthropic/claude-3.5-sonnet", "google/gemini-flash-1.5:free"]
        for model in models:
            try:
                r = requests.post("https://openrouter.ai/api/v1/chat/completions",
                                  headers={"Authorization": f"Bearer {openrouter_token}"},
                                  json={"model": model, "messages": [{"role": "user", "content": prompt}]})
                if r.status_code == 200:
                    result = r.json()['choices'][0]['message']['content']
                    print(f"✅ Success with OpenRouter ({model})!")
                    break
            except: pass

    # Strategy 3: Pollinations AI (Absolute Fallback)
    if not result:
        print("☁️ Trying Pollinations...")
        try:
            r = requests.post("https://text.pollinations.ai/", json={"messages": [{"role": "user", "content": prompt}], "model": "openai"})
            if r.status_code == 200:
                result = r.text
                print("✅ Success with Pollinations!")
        except: pass

    if not result:
        print("❌ All AI failed.")
        return

    clean = result.strip()
    if "```" in clean:
        parts = clean.split("```")
        for p in parts:
            if "# " in p:
                clean = p
                if clean.startswith("markdown"): clean = clean[8:]
                break

    with open("README.md", "w") as f:
        f.write(clean)
    print("✅ README.md updated!")

if __name__ == "__main__":
    main()
