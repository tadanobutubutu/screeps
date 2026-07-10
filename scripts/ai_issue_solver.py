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
                    break
        except Exception as e:
            print(f"Thread [OpenRouter ({model})]: Failed: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python ai_issue_solver.py '<prompt>'")
        sys.exit(1)

    prompt = sys.argv[1]
    # Load keys from environment variables or provide placeholders
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    openrouter_token = os.getenv("OPENROUTER_TOKEN", "")

    if not gemini_key and not openrouter_token:
        print("No API credentials found. Set GEMINI_API_KEY and/or OPENROUTER_TOKEN environment variables.")
        sys.exit(1)

    results = [None, None]
    threads = []

    if gemini