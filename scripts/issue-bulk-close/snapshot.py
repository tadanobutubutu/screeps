#!/usr/bin/env python3
"""リポジトリの open issue 一覧をカーソルページングで取得して保存する。

GitHub の REST issue 一覧は大規模データセットでは page パラメータが使えないため、
Link ヘッダの next カーソルを辿って全件取得する。

使い方:
    python3 snapshot.py --out open_issues.txt
"""
import argparse
import json
import sys
import time
import urllib.error
import urllib.request

REPO = "tadanobutubutu/screeps"
UA = {"User-Agent": "issue-bulk-closer/1.0", "Accept": "application/vnd.github+json"}


def get(url, retries=5):
    """GET してレスポンス本文と Link ヘッダを返す。5xx/タイムアウトは再試行する。"""
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r), r.headers.get("Link", "")
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"GET failed: {url}: {last}")


def next_link(link_header):
    """Link ヘッダから rel="next" の URL を取り出す。"""
    for part in link_header.split(","):
        if 'rel="next"' in part:
            return part.split(";")[0].strip().strip("<>")
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="open_issues.txt")
    ap.add_argument("--repo", default=REPO)
    args = ap.parse_args()

    url = (
        f"https://api.github.com/repos/{args.repo}/issues"
        "?state=open&per_page=100&sort=created&direction=asc"
    )
    seen = set()
    pages = 0
    out = open(args.out, "w")
    t0 = time.time()
    while url:
        data, link = get(url)
        if not isinstance(data, list):
            print(f"unexpected response: {str(data)[:200]}", file=sys.stderr)
            break
        for item in data:
            # PR は issue 一覧に混ざるので除外する
            if "pull_request" in item:
                continue
            seen.add(item["number"])
        pages += 1
        url = next_link(link)
        if pages % 25 == 0 or not url:
            print(
                f"pages={pages} issues={len(seen)} elapsed={time.time() - t0:.0f}s",
                file=sys.stderr,
                flush=True,
            )
    for num in sorted(seen):
        out.write(f"{num}\n")
    out.close()
    print(f"done pages={pages} issues={len(seen)} out={args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
