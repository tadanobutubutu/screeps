#!/usr/bin/env python3
"""
scripts/batch_merge_all_prs.py

廃止。以前のこのスクリプトは PR を git merge して main に直接 push し、
衝突時は PR 側のファイル全体で上書きしていた（main.js の内容が消えた原因の一つ）。

PR の一括マージは scripts/force_merge_pr.py（検証付き・API マージ）を使うこと。
"""

import sys

if __name__ == "__main__":
    print(
        "scripts/batch_merge_all_prs.py は廃止されました。"
        "scripts/force_merge_pr.py を使ってください（--dry-run で判定だけ確認できます）。"
    )
    sys.exit(1)
