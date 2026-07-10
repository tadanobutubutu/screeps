"""共有AIプロバイダー層 — 8〜12モデル並行実行対応。"""

import json
import os
import re
import time
import urllib.parse
import urllib.request

POLLINATIONS_GET_MODELS = ["openai-fast", "openai"]
POLLINATIONS_POST_MODELS = ["openai", "openai-fast"]

OVH_BASE = "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions"
OVH_MODELS = [
    "Mistral-7B-Instruct-v0.3",
    "Qwen3-Coder-30B-A3B-Instruct",
    "Meta-Llama-3_3-70B-Instruct",
]

KILO_BASE = "https://api.kilo.ai/api/gateway/chat/completions"
KILO_MODELS = ["openrouter/free", "minimax/minimax-m2.5:free"]

OPENROUTER_FREE_MODELS = [
    "qwen/qwen3-coder:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "openai/gpt-oss-120b:free",
    "poolside/laguna-m.1:free",
    "openrouter/free",
]

PUTER_BASE = "https://api.puter.com/puterai/openai/v1/chat/completions"
PUTER_MODELS = ["gpt-5.3-codex", "gpt-4o-mini"]

HF_INFERENCE_MODELS = [
    "Qwen/Qwen2.5-Coder-7B-Instruct",
    "meta-llama/Meta-Llama-3.1-8B-Instruct",
]
HF_INFERENCE_URL = "https://api-inference.huggingface.co/models/{model}"
HF_ROUTER_URL = "https://router.huggingface.co/v1/chat/completions"

AI_HORDE_SUBMIT = "https://aihorde.net/api/v2/generate/text/async"
AI_HORDE_STATUS = "https://aihorde.net/api/v2/generate/text/status"
AI_HORDE_ANON_KEY = "00000000000000000000000000000000"

INVALID_RESPONSE_MARKERS = (
    "fix pending due to api errors",
    "model not found",
    "api rate limit exceeded",
    "missing api key",
    "authentication failed",
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


def is_valid_response(text, min_length=30):
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
        encoded = urllib.parse.quote(prompt[:4000])
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


def call_kilo_gateway(prompt, model=None):
    models = [model] if model else KILO_MODELS
    for m in models:
        try:
            print(f"Trying Kilo Gateway ({m})...")
            result = _openai_chat(KILO_BASE, m, prompt, timeout=90)
            if result:
                return result
        except Exception as exc:
            print(f"Kilo Gateway ({m}) failed: {exc}")
    return None


def call_ovh_anonymous(prompt, model=None):
    models = [model] if model else OVH_MODELS
    for m in models:
        try:
            print(f"Trying OVH ({m})...")
            result = _openai_chat(OVH_BASE, m, prompt, timeout=90)
            if result:
                return result
        except Exception as exc:
            print(f"OVH ({m}) failed: {exc}")
    return None


def call_openrouter_model(prompt, token, model):
    token = normalize_token(token)
    if not token:
        return None
    headers = {
        "Authorization": f"Bearer {token}",
        "X-Title": "screeps-ai-parallel",
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
    for model in OPENROUTER_FREE_MODELS:
        result = call_openrouter_model(prompt, token, model)
        if result:
            return result
    return None


def call_gemini(prompt, key):
    key = normalize_token(key)
    if not key:
        return None
    try:
        print("Trying Gemini API (gemini-1.5-flash-latest)...")
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


def call_puter(prompt, model="gpt-5.3-codex"):
    token = normalize_token(os.environ.get("PUTER_AUTH_TOKEN"))
    if not token:
        print("Puter: PUTER_AUTH_TOKEN not set, skipping")
        return None
    try:
        print(f"Trying Puter ({model})...")
        return _openai_chat(
            PUTER_BASE,
            model,
            prompt,
            headers={"Authorization": f"Bearer {token}"},
            timeout=90,
        )
    except Exception as exc:
        print(f"Puter ({model}) failed: {exc}")
    return None


def call_huggingface(prompt, model="Qwen/Qwen2.5-Coder-7B-Instruct"):
    token = normalize_token(
        os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")
    )
    headers = {"Content-Type": "application/json", "User-Agent": "screeps-ai/1.0"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    # Router API (OpenAI互換)
    try:
        print(f"Trying HuggingFace Router ({model})...")
        result = _openai_chat(
            HF_ROUTER_URL,
            model,
            prompt,
            headers=headers,
            timeout=90,
        )
        if result:
            return result
    except Exception as exc:
        print(f"HuggingFace Router ({model}) failed: {exc}")

    # Serverless Inference API
    try:
        print(f"Trying HuggingFace Inference ({model})...")
        url = HF_INFERENCE_URL.format(model=model)
        payload = {"inputs": prompt, "parameters": {"max_new_tokens": 2048}}
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
        )
        with urllib.request.urlopen(req, timeout=120) as response:
            data = json.loads(response.read().decode("utf-8"))
            if isinstance(data, list) and data and "generated_text" in data[0]:
                return data[0]["generated_text"]
            if isinstance(data, dict) and "generated_text" in data:
                return data["generated_text"]
    except Exception as exc:
        print(f"HuggingFace Inference ({model}) failed: {exc}")
    return None


def call_ai_horde(prompt):
    apikey = normalize_token(os.environ.get("AI_HORDE_API_KEY")) or AI_HORDE_ANON_KEY
    try:
        print("Trying AI Horde (async text)...")
        payload = {
            "prompt": prompt[:6000],
            "params": {"n": 1, "max_length": 2048, "temperature": 0.4},
            "models": ["Llama 3 8B Instruct"],
            "workers": 1,
        }
        req = urllib.request.Request(
            AI_HORDE_SUBMIT,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "apikey": apikey},
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            job = json.loads(response.read().decode("utf-8"))
        job_id = job.get("id")
        if not job_id:
            print(f"AI Horde: no job id ({job})")
            return None

        for _ in range(30):
            time.sleep(2)
            status_req = urllib.request.Request(
                f"{AI_HORDE_STATUS}/{job_id}",
                headers={"apikey": apikey},
            )
            with urllib.request.urlopen(status_req, timeout=30) as response:
                status = json.loads(response.read().decode("utf-8"))
            if status.get("done"):
                generations = status.get("generations") or []
                if generations:
                    text = generations[0].get("text", "").strip()
                    if text:
                        return text
                return None
            if status.get("faulted"):
                print(f"AI Horde job faulted: {status}")
                return None
    except Exception as exc:
        print(f"AI Horde failed: {exc}")
    return None


def build_parallel_providers(gemini_key=None, openrouter_token=None):
    """並行実行用プロバイダー一覧 (name, callable) を返す。"""
    providers = []

    if gemini_key:
        providers.append(("Gemini-Direct", lambda p: call_gemini(p, gemini_key)))

    token = normalize_token(openrouter_token)
    if token:
        for model in OPENROUTER_FREE_MODELS:
            slug = model.split("/")[-1].replace(":", "-")
            providers.append(
                (
                    f"OpenRouter-{slug}",
                    lambda p, m=model, t=token: call_openrouter_model(p, t, m),
                )
            )

    providers.append(
        ("Pollinations-GET", lambda p: call_pollinations_get(p, "openai-fast"))
    )
    providers.append(
        ("Pollinations-POST", lambda p: call_pollinations_post(p, "openai"))
    )
    providers.append(("Kilo-Gateway", call_kilo_gateway))
    providers.append(("OVH-Anonymous", call_ovh_anonymous))

    for model in PUTER_MODELS:
        providers.append((f"Puter-{model}", lambda p, m=model: call_puter(p, m)))

    for model in HF_INFERENCE_MODELS:
        slug = model.split("/")[-1]
        providers.append(
            (f"HuggingFace-{slug}", lambda p, m=model: call_huggingface(p, m))
        )

    providers.append(("AI-Horde", call_ai_horde))
    return providers


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


def generate_with_fallback(
    prompt, gemini_key=None, openrouter_token=None, min_length=50
):
    """順次フォールバック（resolve_conflicts 等向け）。"""
    for name, caller in build_parallel_providers(gemini_key, openrouter_token):
        result = caller(prompt)
        if is_valid_response(result, min_length=min_length):
            print(f"✅ Success via {name}")
            return result, name
    return None, None
