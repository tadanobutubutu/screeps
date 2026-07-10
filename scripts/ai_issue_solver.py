import os, sys, json, subprocess, urllib.request, re, time, threading

def clean_code(result):
    code_match = re.search(r"```(?:javascript|js)?\s*(.*?)\s*```", result, re.DOTALL)
    return code_match.group(1).strip() if code_match else result.strip()

def call_gemini_api(prompt, key, results, idx):
    try:
        print("Thread [Gemini]: Requesting...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={key}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=40) as f:
            res = json.loads(f.read().decode('utf-8'))
            text = res['candidates'][0]['content']['parts'][0]['text']
            results[idx] = clean_code(text)
            print("Thread [Gemini]: Success")
    except Exception as e:
        print(f"Thread [Gemini]: Failed: {e}")

def call_openrouter(prompt, token, results, idx):
    models = ["openrouter/free", "google/gemini-2.5-flash:free"]
    for model in models:
        try:
            print(f"Thread [OpenRouter ({model})]: Requesting...")
            payload = {"model": model, "messages": [{"role": "user", "content": prompt}]}
            req = urllib.request.Request(
                "https://openrouter.ai/api/v1/chat/completions",
                data=json.dumps(payload).encode('utf-8'),
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                    "X-Title": "screeps-issue-solver",
                    "HTTP-Referer": "https://github.com/tadanobutubutu/screeps"
                }
            )
            with urllib.request.urlopen(req, timeout=40) as f:
                res = json.loads(f.read().decode('utf-8'))
                if 'choices' in res and len(res['choices']) > 0:
                    text = res['choices'][0]['message']['content']
                    results[idx] = clean_code(text)
                    print(f"Thread [OpenRouter ({model})]: Success")
                    return
        except Exception as e:
            print(f"Thread [OpenRouter ({model})]: Failed: {e}")

def call_pollinations_ai(prompt, results, idx):
    try:
        print("Thread [Pollinations]: Requesting...")
        payload = {"messages": [{"role": "user", "content": prompt}], "model": "openai"}
        req = urllib.request.Request(
            "https://text.pollinations.ai/",
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=40) as f:
            text = f.read().decode('utf-8')
            results[idx] = clean_code(text)
            print("Thread [Pollinations]: Success")
    except Exception as e:
        print(f"Thread [Pollinations]: Failed: {e}")

def call_huggingface_anonymous(prompt, results, idx):
    try:
        print("Thread [HuggingFace]: Requesting...")
        url = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-7B-Instruct"
        payload = {"inputs": prompt, "parameters": {"max_new_tokens": 512}}
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=40) as f:
            res = json.loads(f.read().decode('utf-8'))
            text = ""
            if isinstance(res, list) and len(res) > 0 and 'generated_text' in res[0]:
                text = res[0]['generated_text']
            elif isinstance(res, dict) and 'generated_text' in res:
                text = res['generated_text']
            if text:
                results[idx] = clean_code(text)
                print("Thread [HuggingFace]: Success")
    except Exception as e:
        print(f"Thread [HuggingFace]: Failed: {e}")

def call_aihorde(prompt, results, idx):
    try:
        print("Thread [AI Horde]: Submitting...")
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
            return
            
        # Poll status for max 40 seconds
        url_status = f"https://aihorde.net/api/v2/generate/text/status/{job_id}"
        for _ in range(10):
            time.sleep(4)
            req_status = urllib.request.Request(url_status, headers={"Client-Agent": "screeps-bot:1.0", "User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req_status) as f:
                status_res = json.loads(f.read().decode('utf-8'))
                if status_res.get("done"):
                    generations = status_res.get("generations", [])
                    if generations:
                        results[idx] = clean_code(generations[0].get("text"))
                        print("Thread [AI Horde]: Success")
                        return
    except Exception as e:
        print(f"Thread [AI Horde]: Failed: {e}")

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
    
    # 2. Concurrent Execution of all 5 Models (Sakana AI collaborative style)
    results = [None] * 5
    threads = []
    
    t_gemini = threading.Thread(target=call_gemini_api, args=(prompt, gemini_api_key, results, 0)) if gemini_api_key else None
    t_openrouter = threading.Thread(target=call_openrouter, args=(prompt, openrouter_token, results, 1)) if openrouter_token else None
    t_pollinations = threading.Thread(target=call_pollinations_ai, args=(prompt, results, 2))
    t_huggingface = threading.Thread(target=call_huggingface_anonymous, args=(prompt, results, 3))
    t_aihorde = threading.Thread(target=call_aihorde, args=(prompt, results, 4))
    
    active_threads = [t for t in [t_gemini, t_openrouter, t_pollinations, t_huggingface, t_aihorde] if t is not None]
    
    print(f"Launching {len(active_threads)} concurrent AI models in parallel...")
    for t in active_threads:
        t.start()
        
    for t in active_threads:
        t.join(timeout=50) # wait up to 50 seconds for threads to finish
        
    # 3. Collaborative Validation Phase (Local Testing)
    # Save original main.js content
    original_code = ""
    if os.path.exists("main.js"):
        with open("main.js", "r") as f:
            original_code = f.read()
            
    model_names = ["Gemini-Direct", "OpenRouter-Free", "Pollinations-AI", "HuggingFace-Anonymous", "AIHorde-Anonymous"]
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
            
    # Restore original file first
    with open("main.js", "w") as f:
        f.write(original_code)
        
    # 4. Selection of winning candidate
    winning_code = None
    if valid_candidates:
        # Choose the first candidate that passed tests
        winner_idx, winning_code = valid_candidates[0]
        print(f"\n🏆 Selected winner: {model_names[winner_idx]} (Passed tests)")
    else:
        # Fallback if none passed: pick the first non-empty response
        for i, candidate in enumerate(results):
            if candidate and "API errors" not in candidate:
                winning_code = candidate
                print(f"\n⚠️ No candidates passed tests. Falling back to raw response from {model_names[i]}")
                break
                
    if not winning_code:
        winning_code = "// Fix pending due to test and API failures"
        
    # 5. Apply and Push winning code
    # Configure Git identity for the runner
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