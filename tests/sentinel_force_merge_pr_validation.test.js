const { execFileSync } = require('child_process')
const path = require('path')

describe('Sentinel Security: force_merge_pr.py Repository and Ref Validation', () => {
  test('is_safe_repo_name and is_safe_ref validate repos and refs correctly', () => {
    const scriptsDir = path.join(__dirname, '..', 'scripts')
    const pythonScript = `import sys
import os
sys.path.insert(0, r"${scriptsDir}")
from force_merge_pr import is_safe_repo_name, is_safe_ref

valid_repos = ["owner/repo", "screeps/screeps", "my-org/my_repo.js"]
invalid_repos = ["--upload-pack=evil", "-b", "invalid repo", "owner/repo;calc", ""]

valid_refs = ["main", "feature/login-fix", "fix_123", "v1.0.0", "dependabot/npm_and_yarn/lodash-4.17.21"]
invalid_refs = ["--upload-pack=evil", "-b", "--help", ";rm -rf /", "branch with spaces", "head;calc", ""]

for r in valid_repos:
    assert is_safe_repo_name(r) is True, f"Expected valid repo: {r}"

for r in invalid_repos:
    assert is_safe_repo_name(r) is False, f"Expected invalid repo: {r}"

for ref in valid_refs:
    assert is_safe_ref(ref) is True, f"Expected valid ref: {ref}"

for ref in invalid_refs:
    assert is_safe_ref(ref) is False, f"Expected invalid ref: {ref}"

print("OK")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toBe('OK')
  })
})
