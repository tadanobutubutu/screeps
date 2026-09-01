import json
import os
import subprocess
import sys
import time
import urllib.parse

import requests


def get_repo_stats():
    workflows = len(
        [f for f in os.listdir(".github/workflows") if f.endswith((".yml", ".yaml"))]
    )
    roles = len(
        [f for f in os.listdir(".") if f.startswith("role.") and f.endswith(".js")]
    )
    js_files = []
    for root, dirs, files in os.walk("."):
        if "node_modules" in dirs:
            dirs.remove("node_modules")
        if ".git" in dirs:
            dirs.remove(".git")
        for file in files:
            if file.endswith(".js"):
                js_files.append(os.path.join(root, file))

    total_lines = 0
    for f in js_files:
        try:
            with open(f, "r") as file:
                total_lines += len(file.readlines())
        except:
            pass

    commits = subprocess.run(
        ["git", "log", "-n", "20", "--pretty=format:%h|%an|%as|%s"],
        capture_output=True,
        text=True,
    ).stdout
    return {
        "workflows": workflows,
        "roles": roles,
        "js_files": len(js_files),
        "total_lines": total_lines,
        "commits": commits,
    }


def ask_ai(prompt):
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
        try:
            r = requests.post(
                url,
                json={"contents": [{"parts": [{"text": prompt}]}]},
                timeout=60,
                params={"key": key},
            )
            if r.status_code == 200:
                return r.json()["candidates"][0]["content"]["parts"][0]["text"]
        except:
            pass

    # Fallback to Pollinations (sanitized URL)
    try:
        safe_prompt = prompt[:2000]
        encoded = urllib.parse.quote(safe_prompt)
        url = f"https://text.pollinations.ai/{encoded}?model=openai"
        r = requests.get(url, timeout=60)
        if r.status_code == 200:
            return r.text
    except:
        pass
    return None


def main():
    print("🚀 AI Repo Intelligence System started.")
    stats = get_repo_stats()

    # 1. Update CHANGELOG.md (Dynamic Strategic Log)
    changelog_prompt = f"""
    Create a strategic, professional CHANGELOG in Japanese based on these recent commits:
    {stats["commits"]}
    
    Focus on the VALUE added (e.g., 'Enhanced security through AI-driven Gitleaks integration').
    Format as beautiful Markdown.
    """
    changelog_content = ask_ai(changelog_prompt)
    if changelog_content:
        with open("CHANGELOG.md", "w") as f:
            f.write(
                "# 📈 開発・進化の記録 (Strategic Evolution Log)\n\n"
                + changelog_content.strip()
            )
        print("✅ CHANGELOG.md updated.")

    # 2. Update CONTRIBUTORS.md (Dynamic recognition)
    contributor_prompt = f"""
    Create a highly engaging CONTRIBUTORS.md in Japanese. 
    Main Lead: @tadanobutubutu (Architect of ACE).
    AI Systems: AI Sentinel, AI Issue Resolver, AI Conflict Resolver.
    
    Summarize the roles of the lead developer and the autonomous AI agents.
    Make it look like a team of the future.
    """
    contributor_content = ask_ai(contributor_prompt)
    if contributor_content:
        with open("CONTRIBUTORS.md", "w") as f:
            f.write(contributor_content.strip())
        print("✅ CONTRIBUTORS.md updated.")

    # 3. Update PERFORMANCE_REPORT.md
    perf_prompt = f"""
    Analyze these repo stats and write a professional Performance & Intelligence Report in Japanese.
    Workflows: {stats["workflows"]}
    Roles: {stats["roles"]}
    LOC: {stats["total_lines"]}
    
    Include a section on 'Autonomous Optimization' and 'System Health'.
    Suggest 2-3 advanced Screeps optimization ideas.
    """
    perf_content = ask_ai(perf_prompt)
    if perf_content:
        with open("PERFORMANCE_REPORT.md", "w") as f:
            f.write(
                "# ⚡ AI 自律解析レポート (Intelligence Report)\n\n"
                + perf_content.strip()
            )
        print("✅ PERFORMANCE_REPORT.md updated.")

    # 4. Clean up old/static files by turning them into pointers or deleting
    for old_file in ["META-CHANGELOG.md", "GAME_STATS.md", "WORKFLOW_HEALTH.md"]:
        if os.path.exists(old_file):
            with open(old_file, "w") as f:
                f.write(
                    f"# {old_file}\n\nこのファイルの情報は現在 [CHANGELOG.md](./CHANGELOG.md) および [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md) に統合され、AIによって動的に管理されています。"
                )


if __name__ == "__main__":
    main()
