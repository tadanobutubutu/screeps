"""共有AIプロバイダー・フォールバック層（キー不要優先）。

追加プロバイダー（2026-07）:
  - Puter.js AI REST API (anonymous, keyless)
  - HuggingFace Serverless Inference API (anonymous)
  - AI Horde (anonymous apikey=0000000000)
"""

import json
import re
import time
import threading
import urllib.parse
import urllib.request

POLLINATIONS_GET_MODELS = ["openai-fast", "openai"]
POLLINATIONS_POST_MODELS = ["openai", "openai-fast"]

OVH_BASE = "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions"
OVH_MODELS = [
    "Mistral-7B-Instruct-v0.3",
    "Llama-3.1-8B-Instruct",
    "Meta-Llama-3_3-70B-Instruct",
    "Qwen3-Coder-30B-A3B-Instruct",
    "gpt-oss-20b",
]

KILO_BASE = "https://api.kilo.ai/api/gateway/chat/completions"
KILO_MODELS = [
    "openrouter/free",
    "minimax/minimax-m2.5:free",
    "x-ai/grok-code-fast-1:free",
]

OPENROUTER_MODELS = [
    "openrouter/free",
    "qwen/qwen3-coder:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "openai/gpt-oss-120b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "poolside/laguna-m.1:free",
    "deepseek/deepseek-r1-0528:free",
    "microsoft/phi-4-reasoning-plus:free",
    "google/gemini-2.5-flash:free",
]

PUTER_BASE = "https://api.puter.com/puterai/openai/v1/chat/completions"
PUTER_MODELS = ["gpt-4o-mini", "gpt-4o", "claude-3-5-haiku"]

HF_MODELS = [
    "Qwen/Qwen2.5-Coder-32B-Instruct",
    "meta-llama/Llama-3.2-3B-Instruct",
    "mistralai/Mistral-7B-Instruct-v0.3",
]

INVALID_RESPONSE_MARKERS = (
    "fix pending due to api errors",
    "model not found",
    "api rate limit exceeded",
    "missing api key",
)


def normalize_token(value):
    if not value:
        return None
    token = value.strip().strip('"').strip("'")
    return token or None


def _openai_chat(url, model, prompt, headers=None, timeout=90):
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
    }
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=req_headers,
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        data = json.loads(response.read().decode("utf-8"))
        if "choices" in data and data["choices"]:
            content = data["choices"][0]["message"]["content"]
            if content and content.strip():
                return content.strip()
    return None


def is_valid_response(text, min_length=50):
    if not text or not text.strip():
        return False
    normalized = text.strip().lower()
    if len(normalized) < min_length:
        return False
    if any(marker in normalized for marker in INVALID_RESPONSE_MARKERS):
        return False
    return True


def call_pollinations_get(prompt, model="openai-fast"):
    try:
        print(f"Trying Pollinations GET ({model})...")
        encoded = urllib.parse.quote(prompt[:3000])
        url = f"https://text.pollinations.ai/{encoded}?model={model}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=90) as response:
            text = response.read().decode("utf-8").strip()
            if text and not text.startswith("{"):
                return text
    except Exception as exc:
        print(f"Pollinations GET ({model}) failed: {exc}")
    return None


def call_pollinations_post(prompt, model="openai"):
    try:
        print(f"Trying Pollinations POST ({model})...")
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "model": model,
        }
        req = urllib.request.Request(
            "https://text.pollinations.ai/",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0",
            },
        )
        with urllib.request.urlopen(req, timeout=90) as response:
            text = response.read().decode("utf-8").strip()
            if text and not text.startswith("{"):
                return text
    except Exception as exc:
        print(f"Pollinations POST ({model}) failed: {exc}")
    return None


def call_kilo_gateway(prompt):
    for model in KILO_MODELS:
        try:
            print(f"Trying Kilo Gateway ({model})...")
            result = _openai_chat(KILO_BASE, model, prompt, timeout=90)
            if result:
                return result
        except Exception as exc:
            print(f"Kilo Gateway ({model}) failed: {exc}")
    return None


def call_ovh_anonymous(prompt):
    for model in OVH_MODELS:
        try:
            print(f"Trying OVH AI Endpoints ({model})...")
            result = _openai_chat(OVH_BASE, model, prompt, timeout=90)
            if result:
                return result
        except Exception as exc:
            print(f"OVH ({model}) failed: {exc}")
    return None


def call_openrouter_model(prompt, token, model):
    token = normalize_token(token)
    if not token:
        return None
    headers = {
        "Authorization": f"Bearer {token}",
        "X-Title": "screeps-ai-fallback",
        "HTTP-Referer": "https://github.com/tadanobutubutu/screeps",
    }
    try:
        print(f"Trying OpenRouter ({model})...")
        return _openai_chat(
            "https://openrouter.ai/api/v1/chat/completions",
            model,
            prompt,
            headers=headers,
            timeout=90,
        )
    except Exception as exc:
        print(f"OpenRouter ({model}) failed: {exc}")
    return None


def call_openrouter(prompt, token):
    for model in OPENROUTER_MODELS:
        result = call_openrouter_model(prompt, token, model)
        if result:
            return result
    return None


def call_gemini(prompt, key):
    key = normalize_token(key)
    if not key:
        return None
    try:
        print("Trying Google Gemini API (gemini-1.5-flash-latest)...")
        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"gemini-1.5-flash-latest:generateContent?key={key}"
        )
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=90) as response:
            data = json.loads(response.read().decode("utf-8"))
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as exc:
        print(f"Gemini API failed: {exc}")
    return None


def generate_with_fallback(
    prompt, gemini_key=None, openrouter_token=None, min_length=50
):
    """キー不要プロバイダーを優先し、順次フォールバックする。"""
    providers = []

    for model in POLLINATIONS_GET_MODELS:
        providers.append(
            (
                f"pollinations-get:{model}",
                lambda m=model: call_pollinations_get(prompt, m),
            )
        )
    for model in POLLINATIONS_POST_MODELS:
        providers.append(
            (
                f"pollinations-post:{model}",
                lambda m=model: call_pollinations_post(prompt, m),
            )
        )
    providers.append(("kilo-gateway", lambda: call_kilo_gateway(prompt)))
    providers.append(("ovh-anonymous", lambda: call_ovh_anonymous(prompt)))

    if gemini_key:
        providers.append(("gemini", lambda: call_gemini(prompt, gemini_key)))
    if openrouter_token:
        providers.append(
            ("openrouter", lambda: call_openrouter(prompt, openrouter_token))
        )

    for name, caller in providers:
        result = caller()
        if is_valid_response(result, min_length=min_length):
            print(f"✅ Success via {name}")
            return result, name
        if result:
            print(f"⚠️ Rejected short/invalid response from {name}")

    return None, None


def call_puter(prompt):
    """Puter.js REST API - anonymous / keyless endpoint."""
    for model in PUTER_MODELS:
        try:
            print(f"Trying Puter.js API ({model})...")
            result = _openai_chat(
                PUTER_BASE, model, prompt,
                headers={"Authorization": "Bearer anonymous"},
                timeout=60,
            )
            if result:
                return result
        except Exception as exc:
            print(f"Puter.js ({model}) failed: {exc}")
    return None


def call_huggingface(prompt):
    """HuggingFace Serverless Inference API - anonymous / keyless."""
    for model in HF_MODELS:
        try:
            print(f"Trying HuggingFace Serverless ({model})...")
            url = f"https://api-inference.huggingface.co/models/{model}/v1/chat/completions"
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1024,
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=60) as response:
                data = json.loads(response.read().decode("utf-8"))
                if "choices" in data and data["choices"]:
                    content = data["choices"][0]["message"]["content"]
                    if content and content.strip():
                        return content.strip()
        except Exception as exc:
            print(f"HuggingFace ({model}) failed: {exc}")
    return None


def call_aihorde(prompt):
    """AI Horde - anonymous text generation via apikey=0000000000."""
    try:
        print("Trying AI Horde (anonymous)...")
        payload = {
            "prompt": prompt[:3000],
            "params": {"max_context_length": 1024, "max_length": 512, "temperature": 0.5},
        }
        req = urllib.request.Request(
            "https://aihorde.net/api/v2/generate/text/async",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "apikey": "0000000000",
                "Client-Agent": "screeps-bot:1.0",
                "User-Agent": "Mozilla/5.0",
            },
        )
        with urllib.request.urlopen(req, timeout=30) as f:
            job_id = json.loads(f.read().decode("utf-8")).get("id")
        if not job_id:
            return None
        url_status = f"https://aihorde.net/api/v2/generate/text/status/{job_id}"
        for _ in range(15):
            time.sleep(4)
            req_s = urllib.request.Request(
                url_status,
                headers={"Client-Agent": "screeps-bot:1.0", "User-Agent": "Mozilla/5.0"},
            )
            with urllib.request.urlopen(req_s) as f:
                status = json.loads(f.read().decode("utf-8"))
                if status.get("done"):
                    gens = status.get("generations", [])
                    return gens[0].get("text") if gens else None
    except Exception as exc:
        print(f"AI Horde failed: {exc}")
    return None


def generate_concurrent_all(prompt, gemini_key=None, openrouter_token=None):
    """全プロバイダーを同時並行で呼び出し、生成された全結果をリストで返す。"""
    provider_calls = []

    for m in POLLINATIONS_GET_MODELS:
        provider_calls.append((f"pollinations-get:{m}", lambda m=m: call_pollinations_get(prompt, m)))
    for m in POLLINATIONS_POST_MODELS:
        provider_calls.append((f"pollinations-post:{m}", lambda m=m: call_pollinations_post(prompt, m)))
    provider_calls.append(("kilo-gateway", lambda: call_kilo_gateway(prompt)))
    provider_calls.append(("ovh-anonymous", lambda: call_ovh_anonymous(prompt)))
    provider_calls.append(("puter-js", lambda: call_puter(prompt)))
    provider_calls.append(("huggingface", lambda: call_huggingface(prompt)))
    provider_calls.append(("aihorde", lambda: call_aihorde(prompt)))
    if gemini_key:
        provider_calls.append(("gemini", lambda: call_gemini(prompt, gemini_key)))
    if openrouter_token:
        token = normalize_token(openrouter_token)
        for model in OPENROUTER_MODELS:
            slug = model.replace("/", "-").replace(":", "-")
            provider_calls.append(
                (
                    f"openrouter-{slug}",
                    lambda m=model, t=token: call_openrouter_model(prompt, t, m),
                )
            )

    results = {}
    lock = threading.Lock()

    def _run(name, fn):
        try:
            r = fn()
            if r:
                with lock:
                    results[name] = r.strip()
        except Exception as exc:
            print(f"[{name}] error: {exc}")

    threads = [threading.Thread(target=_run, args=(name, fn)) for name, fn in provider_calls]
    for t in threads:
        t.start()
    for t in threads:
        t.join(timeout=70)

    return results  # dict: {provider_name: response_text}


def extract_code_block(text):
    match = re.search(r"```(?:javascript|js)?\s*(.*?)\s*```", text, re.DOTALL)
    return match.group(1) if match else text


def clean_plain_response(content):
    content = content.strip()
    if content.startswith("```"):
        lines = content.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        content = "\n".join(lines).strip()
    return content
