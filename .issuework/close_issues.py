"""Close a chunk of verified fixed-in-code issues with an evidence comment."""
import json
import subprocess
import sys
import time

CUR_SHA = 'f17afcf'


def build_comment(rec):
    if rec['kind'] == 'C':
        return (
            '✅ コード側で修正済みのため Close します（fixed in code, not yet closed）.\n\n'
            '根拠 / Evidence:\n'
            f"- {rec['evidence']}\n"
            f"- 確認時のリポジトリ状態: commit `{CUR_SHA}` (main)\n\n"
            '_自動棚卸し: 修正済みIssueのClose処理_'
        )
    todo = (rec.get('todo_text') or '').replace('\n', ' / ')[:300]
    return (
        '✅ コード側で修正済みのため Close します（fixed in code, not yet closed）.\n\n'
        '根拠 / Evidence:\n'
        '- このIssueが追跡していた TODO コメントは `main.js` 内で **FIXED** としてマークされていました。\n'
        f"- todo-hash: `{rec.get('todo_hash')}`（`sha1(\"main.js:\" + TODO本文)` で整合性検証済み）\n"
        f"- TODO本文: `{todo}`\n"
        f"- 当該 TODO コメントは現在の `main.js`（commit `{CUR_SHA}`）には存在しません（修正により削除済み）。\n
        '- 対応する修正コードが現行 `main.js` に存在します（`addLangAttribute()` / `fixTableStructure()` / '
        '`fixAllTables()` / `addMainLandmark()` / `validateLandmarkRequired()` など）。\n\n'
        '_自動棚卸し: 修正済みIssueのClose処理_'
    )


def main():
    chunk_file, log_file = sys.argv[1], sys.argv[2]
    records = json.load(open(chunk_file))
    log = open(log_file, 'a')
    ok = fail = 0
    for rec in records:
        n = rec['number']
        comment = build_comment(rec)
        for attempt in range(4):
            p = subprocess.run(
                ['gh', 'issue', 'close', str(n), '--reason', 'completed', '--comment', comment],
                capture_output=True, text=True)
            if p.returncode == 0:
                log.write(f'OK {n}\n')
                ok += 1
                break
            err = ((p.stderr or '') + (p.stdout or '')).strip().replace('\n', ' ')
            if 'rate limit' in err.lower() or 'abuse' in err.lower():
                time.sleep(20)
                continue
            log.write(f'FAIL {n} {err[:250]}\n')
            fail += 1
            break
        else:
            log.write(f'FAIL {n} retries-exhausted\n')
            fail += 1
        log.flush()
    print(f'{chunk_file}: ok={ok} fail={fail}')
    log.close()


if __name__ == '__main__':
    main()
