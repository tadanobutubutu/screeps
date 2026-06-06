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
    
    prompt = f"Create a professional dynamic GitHub README in Japanese for a Screeps AI project. Stats: {ctx['workflows']} workflows, {ctx['roles']} roles. Recent Activities: {ctx['recent_commits']}. Respond ONLY with raw markdown."

    result = ""
    if key:
        print(f"☁️ Trying Gemini...")
        # Use v1 endpoint and latest model IDs
        models = ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-pro"]
        for model in models:
            url = f"https://generativelanguage.googleapis.com/v1/models/{model}:generateContent?key={key}"
            print(f"   -> Testing model: {model}")
            try:
                r = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=30)
                if r.status_code == 200:
                    result = r.json()['candidates'][0]['content']['parts'][0]['text']
                    print(f"✅ Success with {model}!")
                    break
                else:
                    print(f"⚠️ {model} failed (HTTP {r.status_code}): {r.text[:200]}")
            except Exception as e:
                print(f"⚠️ {model} error: {e}")

    if not result:
        print("☁️ Trying Pollinations (Fallback)...")
        # Try multiple retry for 429
        for i in range(3):
            try:
                url = "https://text.pollinations.ai/"
                payload = {"messages": [{"role": "user", "content": prompt}], "model": "openai"}
                r = requests.post(url, json=payload, timeout=60)
                if r.status_code == 200:
                    result = r.text
                    print("✅ Pollinations responded.")
                    break
                elif r.status_code == 429:
                    print(f"⏳ Rate limited, retrying ({i+1})...")
                    time.sleep(5)
                else:
                    print(f"⚠️ Pollinations failed (HTTP {r.status_code})")
                    break
            except Exception as e:
                print(f"⚠️ Pollinations error: {e}")
                break

    if not result:
        print("❌ All AI failed. No update made.")
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
