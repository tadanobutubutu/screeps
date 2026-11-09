const { execFileSync } = require('child_process')
const path = require('path')

describe('Sentinel Security: force_merge_pr.py Repository Validation', () => {
  const scriptsDir = path.join(__dirname, '..', 'scripts')

  test('is_safe_repo_name function validates valid and invalid repository names correctly', () => {
    const pythonScript = `import sys
sys.path.insert(0, r"${scriptsDir}")
from force_merge_pr import is_safe_repo_name

valid_repos = [
    "owner/repo",
    "tadanobutubutu/screeps",
    "org-name/repo.js",
    "user_123/my-repo_v2.0",
]

invalid_repos = [
    "--help",
    "-R/evil",
    "--repo=evil/repo",
    "owner",
    "owner/repo/sub",
    ";rm -rf /",
    "owner/repo with spaces",
    "owner/evil;cmd",
    "-owner/repo",
    "",
    None,
    12345,
]

for r in valid_repos:
    assert is_safe_repo_name(r) is True, f"Expected valid repo: {r}"

for r in invalid_repos:
    assert is_safe_repo_name(r) is False, f"Expected invalid repo: {r}"

print("OK")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toBe('OK')
  })

  test('main() rejects invalid GITHUB_REPOSITORY environment variable', () => {
    const pythonScript = `import sys
import os
sys.path.insert(0, r"${scriptsDir}")
import force_merge_pr

os.environ["GITHUB_REPOSITORY"] = "--malicious-flag"
ret = force_merge_pr.main([])
assert ret == 1, f"Expected returncode 1, got {ret}"
print("REJECTED_SAFELY")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toContain('REJECTED_SAFELY')
  })
})
