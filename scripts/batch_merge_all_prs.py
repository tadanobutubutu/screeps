#!/usr/bin/env python3
"""
scripts/batch_merge_all_prs.py

Batch merge all open PRs in chronological order (oldest first).
Automatically resolves merge conflicts using --theirs / clean logic.
Increments commit count with zero manual intervention.
"""

import argparse
import json
import os
import subprocess
import sys
import time

from force_merge_pr import merge_single_pr, run_cmd, setup_git_config


def fetch_all_oldest_pr_numbers(max_count=None):
    """Retrieve all open PR numbers sorted from oldest to newest."""
    print("Fetching open PR list from GitHub...")
    # Fetch in pages of 100
    prs = []
    page = 1
    per_page = 100
    
    while True:
        limit = per_page
        if max_count and len(prs) + limit > max_count:
            limit = max_count - len(prs)
            if limit <= 0:
                break

        res = run_cmd([
            "gh", "api",
            f"repos/tadanobutubutu/screeps/pulls?state=open&sort=created&direction=asc&per_page={limit}&page={page}",
            "--jq", ".[].number"
        ], check=False)

        if res.returncode != 0 or not res.stdout.strip():
            break

        lines = [int(line.strip()) for line in res.stdout.strip().splitlines() if line.strip().isdigit()]
        if not lines:
            break

        prs.extend(lines)
        print(f"  Loaded {len(prs)} PRs so far (latest fetched: #{prs[-1]})...")

        if len(lines) < limit:
            break
        page += 1
        if max_count and len(prs) >= max_count:
            break

    return prs


def main():
    parser = argparse.ArgumentParser(description="Batch merge all PRs oldest-first")
    parser.add_argument("--count", type=int, default=50, help="Number of PRs to merge (default 50)")
    parser.add_argument("--all", action="store_true", help="Merge ALL open PRs")
    args = parser.parse_args()

    max_count = None if args.all else args.count
    setup_git_config()

    print("==================================================")
    print("🔥 SCREEPS ULTRA BATCH PR MERGER (OLDEST-FIRST) 🔥")
    print("==================================================")

    pr_list = fetch_all_oldest_pr_numbers(max_count=max_count)
    total = len(pr_list)
    print(f"\nTotal open PRs queued for merging: {total}")

    success_count = 0
    fail_count = 0

    for idx, pr_no in enumerate(pr_list, 1):
        print(f"\n[{idx}/{total}] Processing PR #{pr_no}...")
        ok = merge_single_pr(pr_no)
        if ok:
            success_count += 1
        else:
            fail_count += 1
        
        # Short cooldown to avoid aggressive GitHub rate limits
        time.sleep(0.5)

    print("\n==================================================")
    print(f"🎉 Batch Merge Complete! Merged: {success_count}, Failed: {fail_count}")
    print("==================================================")


if __name__ == "__main__":
    main()
