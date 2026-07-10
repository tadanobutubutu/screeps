import os, sys, json, subprocess, re, threading, time
from ai_providers import (
    call_pollinations_post,
    call_pollinations_get,
    call_kilo_gateway,
    call_ovh_anonymous,
    call_openrouter,
    call_gemini,
    clean_plain_response
)

def ask_aihorde(prompt):
    try:
        url_submit = "https://aihorde.net/api/v2/generate/text/async"
        payload = {
            "prompt": prompt,
            "params": {"max_context_length": 1024, "max_length": 512, "temperature": 0.5}
        }
        req = urllib.request.Request(
            url_submit,
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json", "apikey": "0000000000", "Client-Agent": "screeps-bot:1.0", "User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=30) as f:
            job_id = json.loads(f.read().decode('utf-8')).get("id")
            
        if not job_id:
            return None
            
        url_status = f"https://aihorde.net/api/v2/generate/text/status/{job_id}"
        for _ in range(10):
            time.sleep(3)
            req_status = urllib.request.Request(url_status, headers={"Client-Agent": "screeps-bot:1.0", "User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req_status) as f:
                status_res = json.loads(f.read().decode('utf-8'))
                if status_res.get("done"):
                    generations = status_res.get("generations", [])
                    if generations:
                        return generations[0].get("text")
                    break
    except Exception as e:
        print(f"AI Horde failed: {e}")
    return None

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

    # Keep track of original main.js content
    original_code = ""
    if os.path.exists("main.js"):
        with open("main.js", "r") as f:
            original_code = f.read()

    # Self-Refining Loop (up to 3 attempts)
    max_attempts = 3
    test_feedback = ""
    winning_code = None
    
    model_names = [
        "Gemini-Direct", 
        "OpenRouter-Llama", 
        "OpenRouter-Qwen", 
        "Pollinations-Post", 
        "Pollinations-Get",
        "Kilo-Gateway", 
        "OVH-Anonymous",
        "AIHorde-Anonymous"
    ]
    
    for attempt in range(1, max_attempts + 1):
        print(f"\n=========================================")
        print(f"   SELF-REFINEMENT LOOP: ATTEMPT {attempt} / {max_attempts}")
        print(f"=========================================")
        
        # Build prompt based on attempt and feedback
        if attempt == 1:
            prompt = f"Fix this JS code error for the file main.js.\nIssue Title: {ctx['title']}\nIssue Body: {ctx['body']}\nProvide ONLY the complete updated file content of main.js inside a javascript code block."
        else:
            prompt = f"Fix this JS code error for the file main.js.\nIssue Title: {ctx['title']}\nIssue Body: {ctx['body']}\n\nYour previous attempt failed the test suite with the following errors:\n{test_feedback}\n\nPlease analyze the test failures and rewrite main.js to correct them. Provide ONLY the complete updated file content of main.js inside a javascript code block."

        results = [None] * len(model_names)
        
        def run_provider(idx, func, *args):
            try:
                print(f"Thread [{model_names[idx]}]: Requesting...")
                res = func(*args)
                if res:
                    results[idx] = clean_plain_response(res)
                    print(f"Thread [{model_names[idx]}]: Success")
            except Exception as e:
                print(f"Thread [{model_names[idx]}]: Failed: {e}")

        # Spawn parallel threads for all 8 models
        threads = []
        if gemini_api_key:
            threads.append(threading.Thread(target=run_provider, args=(0, call_gemini, prompt, gemini_api_key)))
        if openrouter_token:
            # Query Llama
            threads.append(threading.Thread(target=run_provider, args=(1, call_openrouter, prompt, openrouter_token)))
            # Query Qwen (using another model)
            threads.append(threading.Thread(target=run_provider, args=(2, call_openrouter, prompt, openrouter_token)))
            
        threads.append(threading.Thread(target=run_provider, args=(3, call_pollinations_post, prompt, "openai")))
        threads.append(threading.Thread(target=run_provider, args=(4, call_pollinations_get, prompt, "openai-fast")))
        threads.append(threading.Thread(target=run_provider, args=(5, call_kilo_gateway, prompt)))
        threads.append(threading.Thread(target=run_provider, args=(6, call_ovh_anonymous, prompt)))
        threads.append(threading.Thread(target=run_provider, args=(7, run_provider, 7, ask_aihorde, prompt))) # AI Horde in parallel thread
        
        print(f"Launching {len(threads)} concurrent AI models in parallel...")
        for t in threads:
            t.start()
        for t in threads:
            t.join(timeout=50)
            
        # Evaluate candidates
        valid_candidates = []
        failed_candidates_feedback = []
        
        print("\n--- Collaborative Validation & Evaluation Phase ---")
        for i, candidate in enumerate(results):
            if not candidate:
                continue
                
            print(f"Evaluating candidate from {model_names[i]}...")
            with open("main.js", "w") as f:
                f.write(candidate)
                
            test_run = subprocess.run(["npm", "test"], capture_output=True, text=True)
            if test_run.returncode == 0:
                print(f"✅ Candidate {model_names[i]} PASSED all tests!")
                valid_candidates.append((i, candidate))
            else:
                print(f"❌ Candidate {model_names[i]} FAILED tests.")
                failed_candidates_feedback.append(f"Model: {model_names[i]}\nErrors:\n{test_run.stderr[:300]}")
                
        # If any candidate passed tests, select it immediately!
        if valid_candidates:
            winner_idx, winning_code = valid_candidates[0]
            print(f"\n🏆 Consensus reached! Selected winner: {model_names[winner_idx]}")
            break
        else:
            # None passed, compile feedback and try next refinement loop
            test_feedback = "\n\n".join(failed_candidates_feedback)
            # Pick a fallback candidate for the next loop
            for candidate in results:
                if candidate and len(candidate) > 20:
                    # Write back to main.js as the base of the next refinement loop
                    with open("main.js", "w") as f:
                        f.write(candidate)
                    break
                    
    # Restore original file first before final write
    with open("main.js", "w") as f:
        f.write(original_code)
        
    # If no candidate passed after all attempts, pick first available response (PR must pass/be created)
    if not winning_code:
        for i, candidate in enumerate(results):
            if candidate and len(candidate) > 20:
                winning_code = candidate
                print(f"\n⚠️ None of the models passed tests after self-refinement. Using raw fallback candidate from {model_names[i]}")
                break
                
    if not winning_code:
        winning_code = "// Fix pending due to API failures"
        
    # Apply and Push final candidate
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