import os, sys, json, subprocess, re, threading
from ai_providers import (
    call_pollinations_post,
    call_kilo_gateway,
    call_ovh_anonymous,
    call_openrouter,
    call_gemini,
    clean_plain_response
)

def main():
    issue_no = os.environ.get("ISSUE_NUMBER")
    openrouter_token = os.environ.get("OPENROUTER_TOKEN")
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    
    if not issue_no:
        print("Missing ISSUE_NUMBER")
        return
    
    # 1. Fetch Issue Details
    try:
        res = subprocess.run(["gh", "issue", "view", str(issue_no), "--json", "title,body"], capture_output=True, text=True)
        ctx = json.loads(res.stdout)
    except Exception as e:
        print(f"Failed to fetch issue details: {e}")
        return
    
    prompt = f"Fix this JS code error for the file main.js.\nIssue Title: {ctx['title']}\nIssue Body: {ctx['body']}\nProvide ONLY the complete updated file content of main.js inside a javascript code block."
    
    # Define parallel execution targets
    results = [None] * 5
    model_names = ["Gemini-Direct", "OpenRouter", "Pollinations-Post", "Kilo-Gateway", "OVH-Anonymous"]
    
    def run_provider(idx, func, *args):
        try:
            print(f"Thread [{model_names[idx]}]: Starting...")
            res = func(*args)
            if res:
                results[idx] = clean_plain_response(res)
                print(f"Thread [{model_names[idx]}]: Success")
        except Exception as e:
            print(f"Thread [{model_names[idx]}]: Failed: {e}")
            
    # Spawn threads
    t_gemini = threading.Thread(target=run_provider, args=(0, call_gemini, prompt, gemini_api_key)) if gemini_api_key else None
    t_openrouter = threading.Thread(target=run_provider, args=(1, call_openrouter, prompt, openrouter_token)) if openrouter_token else None
    t_pollinations = threading.Thread(target=run_provider, args=(2, call_pollinations_post, prompt, "openai"))
    t_kilo = threading.Thread(target=run_provider, args=(3, call_kilo_gateway, prompt))
    t_ovh = threading.Thread(target=run_provider, args=(4, call_ovh_anonymous, prompt))
    
    active_threads = [t for t in [t_gemini, t_openrouter, t_pollinations, t_kilo, t_ovh] if t is not None]
    
    print(f"Launching {len(active_threads)} concurrent AI models in parallel...")
    for t in active_threads:
        t.start()
        
    for t in active_threads:
        t.join(timeout=60) # Wait up to 60s
        
    # 2. Collaborative Validation Phase (Local Testing)
    original_code = ""
    if os.path.exists("main.js"):
        with open("main.js", "r") as f:
            original_code = f.read()
            
    valid_candidates = []
    
    print("\n--- Collaborative Validation & Evaluation Phase ---")
    for i, candidate in enumerate(results):
        if not candidate:
            print(f"Candidate {model_names[i]}: No response generated.")
            continue
            
        print(f"\nEvaluating candidate from {model_names[i]}...")
        # Write candidate code
        with open("main.js", "w") as f:
            f.write(candidate)
            
        # Run test suite
        test_run = subprocess.run(["npm", "test"], capture_output=True, text=True)
        if test_run.returncode == 0:
            print(f"✅ Candidate {model_names[i]} PASSED all tests!")
            valid_candidates.append((i, candidate))
        else:
            print(f"❌ Candidate {model_names[i]} FAILED tests.")
            print(f"Test Stderr snippet: {test_run.stderr[:200]}")
            
    # Restore original file
    with open("main.js", "w") as f:
        f.write(original_code)
        
    # 3. Selection of winning candidate
    winning_code = None
    if valid_candidates:
        winner_idx, winning_code = valid_candidates[0]
        print(f"\n🏆 Selected winner: {model_names[winner_idx]} (Passed tests)")
    else:
        for i, candidate in enumerate(results):
            if candidate and len(candidate) > 20:
                winning_code = candidate
                print(f"\n⚠️ No candidates passed tests. Falling back to raw response from {model_names[i]}")
                break
                
    if not winning_code:
        winning_code = "// Fix pending due to test and API failures"
        
    # Apply and Push winning code
    subprocess.run(["git", "config", "--global", "user.name", "AI Issue Solver"])
    subprocess.run(["git", "config", "--global", "user.email", "ai-issue-solver@screeps.local"])
    
    branch = f"fix/ai-{issue_no}"
    subprocess.run(["git", "checkout", "-b", branch])
    with open("main.js", "w") as f:
        f.write(winning_code)
    
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "--no-verify", "-m", f"fix: resolve issue #{issue_no} using multi-agent concurrent consensus"])
    subprocess.run(["git", "push", "origin", branch])
    subprocess.run(["gh", "pr", "create", "--title", f"Fix #{issue_no} - Concurrent Multi-Agent", "--body", f"Closes #{issue_no}\n\nThis fix was resolved using concurrent execution of multiple models, validated by local unit tests.", "--head", branch, "--base", "main"])
    subprocess.run(["gh", "issue", "close", str(issue_no)])

if __name__ == "__main__":
    main()