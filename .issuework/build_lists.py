"""Build the final close lists (verified fixed-in-code, not-yet-closed issues)."""
import json
from loader import load_jsonl
from todoparse import parse_issue_body, verify_hash

CUR_SHA = 'f17afcf'

A = [o for o in load_jsonl('fixed_open.jsonl') if 'number' in o]
A_ids = {o['number'] for o in A}
B = [o for o in load_jsonl('fixed_any_open.jsonl') if 'number' in o and o['number'] not in A_ids]

list_a = []   # title carries the "— FIXED" marker
for it in A:
    p = parse_issue_body(it['body'])
    list_a.append({
        'number': it['number'],
        'title': it['title'],
        'todo_text': p['todo_text'],
        'todo_hash': p['todo_hash'],
        'hash_ok': verify_hash(p),
        'kind': 'A',
    })

list_b = []   # tracked TODO block marks every item FIXED / DONE
for it in B:
    p = parse_issue_body(it['body'])
    t = p['todo_text'] or ''
    first = t.split('\n')[0]
    if not first.startswith('// TODO: Address accessibility issues from insight report') and not first.startswith('// TODO: Fix 26 table structure issues'):
        continue
    if not ('✓ FIXED' in t or 'DONE:' in t):
        continue
    list_b.append({
        'number': it['number'],
        'title': it['title'],
        'todo_text': t,
        'todo_hash': p['todo_hash'],
        'hash_ok': verify_hash(p),
        'kind': 'B',
    })

list_c = [
    {'number': 253559, 'kind': 'C', 'evidence': 'daily-challenge.js の構文エラー（Unterminated template, line 124）は解消済み。`node --check daily-challenge.js` が成功。'},
    {'number': 253560, 'kind': 'C', 'evidence': "deploy.js の構文エラー（Unexpected character '’', line 1）は解消済み。`node --check deploy.js` が成功。"},
    {'number': 253561, 'kind': 'C', 'evidence': 'main.js の構文エラー（Unexpected token ., line 50）は解消済み。`node --check main.js` が成功。'},
    {'number': 253562, 'kind': 'C', 'evidence': 'memory.visualizer.js の構文エラー（Unexpected token ., line 31）は解消済み。`node --check memory.visualizer.js` が成功。'},
    {'number': 253563, 'kind': 'C', 'evidence': 'utils.emotions.js の構文エラー（Unexpected token ), line 365）は解消済み。`node --check utils.emotions.js` が成功。'},
    {'number': 258130, 'kind': 'C', 'evidence': "ESLint の `Cannot find module 'globals'` は解消済み。`package.json` の dependencies に `globals@^17.13.0` が追加され、`eslint.config.js` が `require('globals')` で参照している。"},
]

already = {170258}  # closed during the pilot test

allrecs = [r for r in (list_a + list_b + list_c) if r['number'] not in already]
json.dump(allrecs, open('close_list.json', 'w'), ensure_ascii=False, indent=1)
print('A:', len(list_a), 'B:', len(list_b), 'C:', len(list_c))
print('total (excl. already closed):', len(allrecs))
print('hash integrity failures A+B:', sum(1 for r in list_a + list_b if not r['hash_ok']))
