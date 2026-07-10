"""共有AIプロバイダー・フォールバック層（キー不要優先）。"""

import json
import re
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


def call_openrouter(prompt, token):
    token = normalize_token(token)
    if not token:
        return None
    headers = {
        "Authorization": f"Bearer {token}",
        "X-Title": "screeps-ai-fallback",
        "HTTP-Referer": "https://github.com/tadanobutubutu/screeps",
    }
    for model in OPENROUTER_MODELS:
        try:
            print(f"Trying OpenRouter ({model})...")
            result = _openai_chat(
                "https://openrouter.ai/api/v1/chat/completions",
                model,
                prompt,
                headers=headers,
                timeout=90,
            )
            if result:
                return result
        except Exception as exc:
            print(f"OpenRouter ({model}) failed: {exc}")
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
