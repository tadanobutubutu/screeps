"""共有AIプロバイダー層 — 並行実行 + フォールバック。

キー不要（動作確認済み）:
  - Pollinations GET/POST, Kilo Gateway

オプションキー（GitHub Secrets）:
  - CEREBRAS_API_KEY — https://cloud.cerebras.ai/
  - MISTRAL_API_KEY — https://console.mistral.ai/api-keys
  - CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID — https://dash.cloudflare.com/
  - ZHIPU_API_KEY — https://open.bigmodel.cn/
  - COHERE_API_KEY — https://dashboard.cohere.com/api-keys
  - PUTER_AUTH_TOKEN — https://puter.com/dashboard#account
  - HF_TOKEN — https://huggingface.co/settings/tokens
  - LLM7_API_KEY — https://token.llm7.io
  - AI_HORDE_API_KEY — https://stablehorde.net/register

低優先（レート制限あり）:
  - OVH Anonymous (2 RPM/IP) — 単一モデルのみ呼び出し
  - MLVoca (mlvoca.com) — キー不要、不安定な場合あり
"""

import json
import os
import re
import threading
import time
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
    "Qwen/Qwen2.5-Coder-7B-Instruct",
    "meta-llama/Meta-Llama-3.1-8B-Instruct",
]

MLVOCA_BASE = "https://mlvoca.com/api/generate"
MLVOCA_MODELS = ["tinyllama", "deepseek-r1:1.5b"]

LLM7_BASE = "https://api.llm7.io/v1/chat/completions"
LLM7_MODELS = ["gpt-5.4-mini", "minimax-m2.7", "deepseek-v4-flash"]

AI_HORDE_ANON_KEY = "00000000000000000000000000000000"

CEREBRAS_BASE = "https://api.cerebras.ai/v1/chat/completions"
CEREBRAS_MODELS = ["gpt-oss-120b", "llama-3.3-70b"]

MISTRAL_BASE = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_MODELS = ["codestral-latest", "mistral-small-latest"]

CLOUDFLARE_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast"

ZHIPU_BASE = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
ZHIPU_MODELS = ["glm-4-flash", "glm-4.7-flash"]

COHERE_BASE = "https://api.cohere.com/v2/chat"
COHERE_MODELS = ["command-r7b-12-2024", "command-r-plus-08-2024"]

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


def call_ovh_anonymous(prompt, model=None):
    """OVH 匿名 — 2 RPM/IP のためデフォルトは単一モデルのみ（429 回避）。"""
    models = [model] if model else [OVH_MODELS[0]]
    for m in models:
        try:
            print(f"Trying OVH AI Endpoints ({m})...")
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
    """Puter.js OpenAI互換 API — PUTER_AUTH_TOKEN 必須（匿名は不可）。"""
    token = normalize_token(os.environ.get("PUTER_AUTH_TOKEN"))
    if not token:
        print("Puter: PUTER_AUTH_TOKEN not set (get from puter.com/dashboard)")
        return None
    for model in PUTER_MODELS:
        try:
            print(f"Trying Puter.js ({model})...")
            result = _openai_chat(
                PUTER_BASE,
                model,
                prompt,
                headers={"Authorization": f"Bearer {token}"},
                timeout=90,
            )
            if result:
                return result
        except Exception as exc:
            print(f"Puter.js ({model}) failed: {exc}")
    return None


def call_huggingface(prompt):
    """HuggingFace Router API — HF_TOKEN 必須（匿名アクセスは廃止）。"""
    token = normalize_token(
        os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")
    )
    if not token:
        print("HuggingFace: HF_TOKEN not set (huggingface.co/settings/tokens)")
        return None
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }
    for model in HF_MODELS:
        try:
            print(f"Trying HuggingFace Router ({model})...")
            result = _openai_chat(
                "https://router.huggingface.co/v1/chat/completions",
                model,
                prompt,
                headers=headers,
                timeout=90,
            )
            if result:
                return result
        except Exception as exc:
            print(f"HuggingFace ({model}) failed: {exc}")
    return None


def call_llm7(prompt):
    """LLM7.io — 無料登録で API キー取得可能（https://token.llm7.io）。"""
    token = normalize_token(os.environ.get("LLM7_API_KEY"))
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    for model in LLM7_MODELS:
        try:
            print(f"Trying LLM7 ({model})...")
            result = _openai_chat(LLM7_BASE, model, prompt, headers=headers, timeout=90)
            if result:
                return result
        except Exception as exc:
            print(f"LLM7 ({model}) failed: {exc}")
    return None


def call_mlvoca(prompt, model="tinyllama"):
    """MLVoca — キー不要 Ollama 互換 API（商用利用不可）。"""
    try:
        print(f"Trying MLVoca ({model})...")
        payload = {
            "model": model,
            "prompt": prompt[:4000],
            "stream": False,
        }
        req = urllib.request.Request(
            MLVOCA_BASE,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=90) as response:
            data = json.loads(response.read().decode("utf-8"))
            text = data.get("response", "").strip()
            if text:
                return text
    except Exception as exc:
        print(f"MLVoca ({model}) failed: {exc}")
    return None


def call_aihorde(prompt):
    """AI Horde — stablehorde.net 登録キー必須（匿名 000...00 は無効化済み）。"""
    apikey = normalize_token(os.environ.get("AI_HORDE_API_KEY")) or AI_HORDE_ANON_KEY
    client_agent = os.environ.get(
        "AI_HORDE_CLIENT_AGENT", "screeps-ai:1.0:ai-issue-solver@github.com"
    )
    try:
        print("Trying AI Horde...")
        payload = {
            "prompt": prompt[:4000],
            "params": {
                "max_context_length": 2048,
                "max_length": 1024,
                "temperature": 0.4,
            },
            "models": ["Llama 3 8B Instruct"],
        }
        req = urllib.request.Request(
            "https://aihorde.net/api/v2/generate/text/async",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "apikey": apikey,
                "Client-Agent": client_agent,
            },
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            job_id = json.loads(response.read().decode("utf-8")).get("id")
        if not job_id:
            return None
        status_url = f"https://aihorde.net/api/v2/generate/text/status/{job_id}"
        for _ in range(10):
            time.sleep(3)
            status_req = urllib.request.Request(
                status_url, headers={"apikey": apikey, "Client-Agent": client_agent}
            )
            with urllib.request.urlopen(status_req, timeout=30) as response:
                status = json.loads(response.read().decode("utf-8"))
            if status.get("done"):
                generations = status.get("generations") or []
                if generations:
                    return generations[0].get("text", "").strip()
                return None
            if status.get("faulted"):
                print(f"AI Horde faulted: {status}")
                return None
    except Exception as exc:
        print(f"AI Horde failed: {exc}")
    return None


def call_cerebras(prompt):
    key = normalize_token(os.environ.get("CEREBRAS_API_KEY"))
    if not key:
        print("Cerebras: CEREBRAS_API_KEY not set")
        return None
    headers = {"Authorization": f"Bearer {key}"}
    for model in CEREBRAS_MODELS:
        try:
            print(f"Trying Cerebras ({model})...")
            result = _openai_chat(
                CEREBRAS_BASE, model, prompt, headers=headers, timeout=90
            )
            if result:
                return result
        except Exception as exc:
            print(f"Cerebras ({model}) failed: {exc}")
    return None


def call_mistral(prompt):
    key = normalize_token(os.environ.get("MISTRAL_API_KEY"))
    if not key:
        print("Mistral: MISTRAL_API_KEY not set")
        return None
    headers = {"Authorization": f"Bearer {key}"}
    for model in MISTRAL_MODELS:
        try:
            print(f"Trying Mistral ({model})...")
            result = _openai_chat(
                MISTRAL_BASE, model, prompt, headers=headers, timeout=90
            )
            if result:
                return result
        except Exception as exc:
            print(f"Mistral ({model}) failed: {exc}")
    return None


def call_cloudflare(prompt):
    token = normalize_token(os.environ.get("CLOUDFLARE_API_TOKEN"))
    account_id = normalize_token(os.environ.get("CLOUDFLARE_ACCOUNT_ID"))
    if not token or not account_id:
        print("Cloudflare: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID required")
        return None
    url = (
        f"https://api.cloudflare.com/client/v4/accounts/{account_id}"
        f"/ai/run/{CLOUDFLARE_MODEL}"
    )
    try:
        print(f"Trying Cloudflare Workers AI ({CLOUDFLARE_MODEL})...")
        payload = {"messages": [{"role": "user", "content": prompt}]}
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
        )
        with urllib.request.urlopen(req, timeout=90) as response:
            data = json.loads(response.read().decode("utf-8"))
            result = data.get("result", {})
            text = result.get("response") or result.get("result")
            if isinstance(text, str) and text.strip():
                return text.strip()
    except Exception as exc:
        print(f"Cloudflare failed: {exc}")
    return None


def call_zhipu(prompt):
    key = normalize_token(os.environ.get("ZHIPU_API_KEY"))
    if not key:
        print("Zhipu: ZHIPU_API_KEY not set")
        return None
    headers = {"Authorization": f"Bearer {key}"}
    for model in ZHIPU_MODELS:
        try:
            print(f"Trying Zhipu GLM ({model})...")
            result = _openai_chat(
                ZHIPU_BASE, model, prompt, headers=headers, timeout=90
            )
            if result:
                return result
        except Exception as exc:
            print(f"Zhipu ({model}) failed: {exc}")
    return None


def call_cohere(prompt):
    key = normalize_token(os.environ.get("COHERE_API_KEY"))
    if not key:
        print("Cohere: COHERE_API_KEY not set")
        return None
    for model in COHERE_MODELS:
        try:
            print(f"Trying Cohere ({model})...")
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
            }
            req = urllib.request.Request(
                COHERE_BASE,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                },
            )
            with urllib.request.urlopen(req, timeout=90) as response:
                data = json.loads(response.read().decode("utf-8"))
                message = data.get("message", {})
                content = message.get("content", [])
                if content and isinstance(content, list):
                    parts = [
                        p.get("text", "") for p in content if p.get("type") == "text"
                    ]
                    text = "".join(parts).strip()
                    if text:
                        return text
                text = data.get("text", "")
                if text:
                    return text.strip()
        except Exception as exc:
            print(f"Cohere ({model}) failed: {exc}")
    return None


def generate_concurrent_all(prompt, gemini_key=None, openrouter_token=None):
    """全プロバイダーを同時並行で呼び出し、生成された全結果をリストで返す。"""
    provider_calls = []

    for m in POLLINATIONS_GET_MODELS:
        provider_calls.append(
            (f"pollinations-get:{m}", lambda m=m: call_pollinations_get(prompt, m))
        )
    for m in POLLINATIONS_POST_MODELS:
        provider_calls.append(
            (f"pollinations-post:{m}", lambda m=m: call_pollinations_post(prompt, m))
        )
    provider_calls.append(("kilo-gateway", lambda: call_kilo_gateway(prompt)))
    for m in MLVOCA_MODELS:
        provider_calls.append((f"mlvoca-{m}", lambda m=m: call_mlvoca(prompt, m)))
    provider_calls.append(("llm7", lambda: call_llm7(prompt)))
    provider_calls.append(
        ("ovh-mistral-7b", lambda: call_ovh_anonymous(prompt, OVH_MODELS[0]))
    )
    provider_calls.append(("cerebras", lambda: call_cerebras(prompt)))
    provider_calls.append(("mistral", lambda: call_mistral(prompt)))
    provider_calls.append(("cloudflare", lambda: call_cloudflare(prompt)))
    provider_calls.append(("zhipu-glm", lambda: call_zhipu(prompt)))
    provider_calls.append(("cohere", lambda: call_cohere(prompt)))
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

    threads = [
        threading.Thread(target=_run, args=(name, fn)) for name, fn in provider_calls
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join(timeout=45)

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
