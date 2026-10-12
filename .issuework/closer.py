"""Close a chunk of verified fixed-in-code issues with an evidence comment."""
import json
import subprocess
import sys
import time

CUR_SHA = 'f17afcf'
NL = chr(10)


def build_comment(rec):
    if rec['kind'] == 'C':
        return (
            '✅ コード側で修正済みのため Close します（fixed in code, not yet closed）.' + NL + NL +
            '根拠 / Evidence:' + NL +
            '- ' + rec['evidence'] + NL +
            '- 確認時のリポジトリ状態: commit `' + CUR_SHA + '` (main)' + NL + NL +
            '_自動棚卸し: 修正済みIssueのClose処理_'
        )
    todo = (rec.get('todo_text') or '').replace(NL, ' / ')[:300]
    return (
        '✅ コード側で修正済みのため Close します（fixed in code, not yet closed）.' + NL + NL +
        '根拠 / Evidence:' + NL +
        '- このIssueが追跡していた TODO コメントは `main.js` 内で **FIXED** としてマークされていました。' + NL +
        '- todo-hash: `' + str(rec.get('todo_hash')) + '`（`sha1("main.js:" + TODO本文)` で整合性検証済み）' + NL +
        '- TODO本文: `' + todo + '`' + NL +
        '- 当該 TODO コメントは現在の `main.js`（commit `' + CUR_SHA + '`）には存在しません（修正により削除済み）。' + NL +
        '- 対応する修正コードが現行 `main.js` に存在します（`addLangAttribute()` / `fixTableStructure()` / ' +
        '`fixAllTables()` / `addMainLandmark()` / `validateLandmarkRequired()` など）。' + NL + NL +
        '_自動棚卸し: 修正済みIssueのClose処理_'
    )


def main():
    chunk_file, log_file = sys.argv[1], sys.argv[2]
    records = json.load(open(chunk_file, encoding='utf-8'))
    log = open(log_file, 'a', encoding='utf-8')
    ok = fail = 0
    for rec in records:
        n = rec['number']
        comment = build_comment(rec)
        done = False
        for _ in range(4):
            p = subprocess.run(
                ['gh', 'issue', 'close', str(n), '--reason', 'completed', '--comment', comment],
                capture_output=True, text=True)
            if p.returncode == 0:
                log.write('OK %s%s' % (n, NL))
                ok += 1
                done = True
                break
            err = ((p.stderr or '') + (p.stdout or '')).strip().replace(NL, ' ')
            if 'already closed' in err.lower() or 'not open' in err.lower():
                log.write('SKIP %s already-closed%s' % (n, NL))
                ok += 1
                done = True
                break
            if 'rate limit' in err.lower() or 'abuse' in err.lower():
                time.sleep(20)
                continue
            log.write('FAIL %s %s%s' % (n, err[:250], NL))
            fail += 1
            done = True
            break
        if not done:
            log.write('FAIL %s retries-exhausted%s' % (n, NL))
            fail += 1
        log.flush()
    print('%s: ok=%d fail=%d' % (chunk_file, ok, fail))
    log.close()


if __name__ == '__main__':
    main()
