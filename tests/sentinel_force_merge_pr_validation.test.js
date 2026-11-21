const { execFileSync } = require('child_process')
const path = require('path')

describe('Sentinel Security: force_merge_pr.py Validation', () => {
  test('is_safe_repo and is_safe_ref validate valid and invalid strings correctly', () => {
    const scriptsDir = path.join(__dirname, '..', 'scripts')
    const pythonScript = `import sys
import os
sys.path.insert(0, r"${scriptsDir}")
from force_merge_pr import is_safe_repo, is_safe_ref

valid_repos = ["owner/repo", "my-org/my_repo.js", "v1/repo-name"]
invalid_repos = ["-R/repo", "--repo=evil/repo", "owner/repo;calc", "../etc/passwd", "", "justrepo"]

valid_refs = ["main", "feature/login-fix", "fix_123", "v1.0.0"]
invalid_refs = ["--upload-pack=evil", "-b", "--help", ";rm -rf /", "ref with spaces", ""]

for r in valid_repos:
    assert is_safe_repo(r) is True, f"Expected valid repo: {r}"

for r in invalid_repos:
    assert is_safe_repo(r) is False, f"Expected invalid repo: {r}"

for r in valid_refs:
    assert is_safe_ref(r) is True, f"Expected valid ref: {r}"

for r in invalid_refs:
    assert is_safe_ref(r) is False, f"Expected invalid ref: {r}"

print("OK")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toBe('OK')
  })
})
