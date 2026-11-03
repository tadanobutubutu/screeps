const { execFileSync } = require('child_process')
const path = require('path')

describe('Sentinel Security: force_merge_pr.py Repository Validation', () => {
  test('is_safe_repo_name function validates valid and invalid repository names correctly', () => {
    const scriptsDir = path.join(__dirname, '..', 'scripts')
    const pythonScript = `import sys
import os
sys.path.insert(0, r"${scriptsDir}")
from force_merge_pr import is_safe_repo_name

valid_repos = ["owner/repo", "my-org/my_repo.js", "v1-user/project-123"]
invalid_repos = ["--help", "-R/evil", "owner/repo;calc", "owner repo", "owner/repo/extra", ""]

for r in valid_repos:
    assert is_safe_repo_name(r) is True, f"Expected valid repo: {r}"

for r in invalid_repos:
    assert is_safe_repo_name(r) is False, f"Expected invalid repo: {r}"

print("OK")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toBe('OK')
  })
})
