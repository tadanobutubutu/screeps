import os

file_path = '.github/workflows/ai-autocoder.yml'
with open(file_path, 'r') as f:
    content = f.read()

old_code = """              for FILE in $FILES; do
                PROMPT="Resolve merge conflicts in $FILE. Respond ONLY with code."
                ENCODED=$(jq -Rr @uri <<< "$PROMPT")
                RESOLVED=$(curl -s "https://text.pollinations.ai/$ENCODED?model=openai" || echo "")
                if [ -n "$RESOLVED" ] && [[ "$RESOLVED" != *"<!DOCTYPE html>"* ]]; then
                  echo "$RESOLVED" | sed '1{/^```/d;};${/^```/d;}' | sed '/^```javascript/d' | sed '/^```js/d' > "$FILE"
                  git add "$FILE"
                else
                  git checkout --ours "$FILE"
                  git add "$FILE"
                fi
              done"""

new_code = """              for FILE in $FILES; do
                PROMPT="Resolve merge conflicts in $FILE. Respond ONLY with code."
                ENCODED=$(jq -Rr @uri <<< "$PROMPT")
                RESOLVED=$(curl -s "https://text.pollinations.ai/$ENCODED?model=openai" || echo "")
                if [ -n "$RESOLVED" ] && [[ "$RESOLVED" != *"<!DOCTYPE html>"* ]]; then
                  echo "$RESOLVED" | sed '1{/^```/d;};${/^```/d;}' | sed '/^```javascript/d' | sed '/^```js/d' > "$FILE"
                  git add "$FILE" || git add -f "$FILE"
                else
                  git checkout --ours "$FILE"
                  git add "$FILE" || git add -f "$FILE"
                fi
              done"""

if old_code in content:
    new_content = content.replace(old_code, new_code)
    with open(file_path, 'w') as f:
        f.write(new_content)
    print("Patched successfully")
else:
    print("Could not find code to patch")
