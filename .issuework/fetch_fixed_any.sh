#!/bin/bash
# Open issues matching FIXED anywhere (title or body)
set -e
OUT=/workspace/.issuework/fixed_any_open.jsonl
: > "$OUT"
for p in 1 2 3 4 5 6 7 8 9 10 11 12; do
  gh api "search/issues?q=repo:tadanobutubutu/screeps+type:issue+state:open+FIXED&per_page=100&page=$p" \
    --jq '.items[] | {number,title,state,created_at,updated_at,author:.user.login,body}' >> "$OUT" 2>/dev/null || true
  n=$(wc -l < "$OUT")
  echo "page $p -> total $n"
  if [ "$n" -ge 786 ]; then break; fi
  sleep 3
done
