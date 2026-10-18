const { execFileSync } = require('child_process')
const path = require('path')

describe('Sentinel Security: resolve_conflicts.py Branch Validation', () => {
  test('is_safe_branch_name function validates valid and invalid branch names correctly', () => {
    const scriptsDir = path.join(__dirname, '..', 'scripts')
    const pythonScript = `import sys
import os
sys.path.insert(0, r"${scriptsDir}")
from resolve_conflicts import is_safe_branch_name

valid_branches = ["main", "feature/login-fix", "fix_123", "v1.0.0", "dependabot/npm_and_yarn/lodash-4.17.21"]
invalid_branches = ["--upload-pack=evil", "-b", "--help", ";rm -rf /", "branch with spaces", "head;calc", ""]

for b in valid_branches:
    assert is_safe_branch_name(b) is True, f"Expected valid branch: {b}"

for b in invalid_branches:
    assert is_safe_branch_name(b) is False, f"Expected invalid branch: {b}"

print("OK")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toBe('OK')
  })
})
