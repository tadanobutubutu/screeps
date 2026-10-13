#!/usr/bin/env python3
"""issue 番号リストを受け取り、並列 REST PATCH でまとめて close する。

使い方:
    python3 closer.py --list shard_1.txt --concurrency 30 --progress progress_1.json

- 404/410 (存在しない・削除済み) はスキップ扱い
- 5xx / タイムアウト / 429 は指数バックオフで再試行
- 進捗は定期的に progress ファイルへ書き出す
"""
import argparse
import json
import os
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

REPO = "tadanobutubutu/screeps"
UA = {"User-Agent": "issue-bulk-closer/1.0", "Accept": "application/vnd.github+json"}
LOCK = threading.Lock()
STATS = {"ok": 0, "skip": 0, "fail": 0, "req": 0}
FAILED = []


def close_issue(num, retries=4):
    """1 件の issue を close する。戻り値は 'ok' / 'skip' / 'fail'。"""
    body = json.dumps({"state": "closed", "state_reason": "completed"}).encode()
    url = f"https://api.github.com/repos/{REPO}/issues/{num}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url,
                data=body,
                headers={**UA, "Content-Type": "application/json"},
                method="PATCH",
            )
            with urllib.request.urlopen(req, timeout=45) as r:
                r.read()
                return "ok"
        except urllib.error.HTTPError as e:
            if e.code in (404, 410):
                return "skip"  # PR 番号や削除済みは対象外
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(1.5 * (attempt + 1) + (num % 7) * 0.1)
                continue
            return "fail"
        except Exception:  # noqa: BLE001
            time.sleep(1.0 * (attempt + 1))
    return "fail"


def worker(num):
    res = close_issue(num)
    with LOCK:
        STATS["req"] += 1
        STATS[res] += 1
        if res == "fail":
            FAILED.append(num)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", required=True)
    ap.add_argument("--concurrency", type=int, default=30)
    ap.add_argument("--progress", default=None)
    ap.add_argument("--failed-out", default=None)
    ap.add_argument("--shard-name", default="")
    args = ap.parse_args()

    nums = [int(x) for x in open(args.list) if x.strip()]
    total = len(nums)
    print(f"[{args.shard_name}] start total={total} conc={args.concurrency}", flush=True)

    t0 = time.time()
    last_report = 0.0
    with ThreadPoolExecutor(max_workers=args.concurrency) as ex:
        for _ in ex.map(worker, nums):
            now = time.time()
            if now - last_report >= 20 or STATS["req"] == total:
                last_report = now
                elapsed = now - t0
                done = STATS["req"]
                rate = done / elapsed if elapsed else 0
                eta = (total - done) / rate if rate else 0
                print(
                    f"[{args.shard_name}] {done}/{total} ok={STATS['ok']} "
                    f"skip={STATS['skip']} fail={STATS['fail']} "
                    f"rate={rate:.1f}/s eta={eta / 60:.1f}min",
                    flush=True,
                )
                if args.progress:
                    tmp = f"{args.progress}.tmp"
                    with open(tmp, "w") as f:
                        json.dump(
                            {
                                "shard": args.shard_name,
                                "total": total,
                                "done": done,
                                "ok": STATS["ok"],
                                "skip": STATS["skip"],
                                "fail": STATS["fail"],
                                "rate": round(rate, 2),
                                "eta_sec": round(eta),
                                "elapsed": round(elapsed),
                            },
                            f,
                        )
                    os.replace(tmp, args.progress)

    elapsed = time.time() - t0
    print(
        f"[{args.shard_name}] DONE total={total} ok={STATS['ok']} "
        f"skip={STATS['skip']} fail={STATS['fail']} elapsed={elapsed:.0f}s",
        flush=True,
    )
    if args.failed_out and FAILED:
        with open(args.failed_out, "w") as f:
            f.write("\n".join(str(n) for n in FAILED) + "\n")
    sys.exit(0 if STATS["fail"] == 0 else 2)


if __name__ == "__main__":
    main()
