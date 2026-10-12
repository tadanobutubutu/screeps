#!/usr/bin/env python3
"""GitHub Actions 用 — 登録済みシークレットのプロバイダー接続テスト。"""

import os
import sys

from ai_providers import (
    call_cerebras,
    call_cloudflare,
    call_cohere,
    call_kilo_gateway,
    call_mistral,
    call_pollinations_get,
    call_zhipu,
)

sys.path.insert(0, os.path.dirname(__file__))

PROMPT = "Reply with exactly: OK"

KEYLESS = [
    ("pollinations-get", call_pollinations_get),
    ("kilo-gateway", call_kilo_gateway),
]

SECRET_PROVIDERS = [
    ("CEREBRAS_API_KEY", "cerebras", call_cerebras),
    ("MISTRAL_API_KEY", "mistral", call_mistral),
    ("CLOUDFLARE_API_TOKEN", "cloudflare", call_cloudflare),
    ("ZHIPU_API_KEY", "zhipu", call_zhipu),
    ("COHERE_API_KEY", "cohere", call_cohere),
]


def main():
    ok = 0
    skip = 0
    fail = 0

    print("=== Keyless providers ===")
    for name, fn in KEYLESS:
        try:
            res = fn(PROMPT)
            if res:
                print(f"✅ {name}")
                ok += 1
            else:
                print(f"❌ {name} (no response)")
                fail += 1
        except Exception as exc:
            print(f"❌ {name}: {exc}")
            fail += 1

    print("\n=== Secret-based providers ===")
    for secret_name, label, fn in SECRET_PROVIDERS:
        if secret_name == "CLOUDFLARE_API_TOKEN":
            if not os.environ.get("CLOUDFLARE_API_TOKEN") or not os.environ.get(
                "CLOUDFLARE_ACCOUNT_ID"
            ):
                print(f"⏭️  {label}: CLOUDFLARE_API_TOKEN/ACCOUNT_ID not set")
                skip += 1
                continue
        elif not os.environ.get(secret_name):
            print(f"⏭️  {label}: {secret_name} not set")
            skip += 1
            continue
        try:
            res = fn(PROMPT)
            if res:
                print(f"✅ {label} ({secret_name})")
                ok += 1
            else:
                print(f"❌ {label} ({secret_name}) — no response")
                fail += 1
        except Exception as exc:
            print(f"❌ {label}: {exc}")
            fail += 1

    print(f"\nSummary: {ok} ok, {skip} skipped (no secret), {fail} failed")
    sys.exit(0 if fail == 0 else 1)


if __name__ == "__main__":
    main()
