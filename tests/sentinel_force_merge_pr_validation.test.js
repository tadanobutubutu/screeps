const { execFileSync } = require('child_process')
const path = require('path')

describe('Sentinel Security: force_merge_pr.py Repo & Ref Validation', () => {
  test('is_safe_repo validates repository format and rejects invalid or option-like names', () => {
    const scriptsDir = path.join(__dirname, '..', 'scripts')
    const pythonScript = `import sys
sys.path.insert(0, r"${scriptsDir}")
from force_merge_pr import is_safe_repo, is_safe_ref

valid_repos = [
    "owner/repo",
    "my-org/my-project",
    "user_123/repo.js",
    "ORG/REPO-name_01",
]
invalid_repos = [
    "",
    None,
    123,
    "owner",
    "owner/repo/extra",
    "/repo",
    "owner/",
    "-owner/repo",
    "owner/-repo",
    "--upload-pack=evil/repo",
    "owner/repo;rm -rf /",
    "owner/repo with spaces",
    "owner/../evil/repo",
]

for r in valid_repos:
    assert is_safe_repo(r) is True, f"Expected valid repo: {r}"

for r in invalid_repos:
    assert is_safe_repo(r) is False, f"Expected invalid repo: {r}"

valid_refs = [
    "main",
    "master",
    "feature/login",
    "v1.0.0",
    "refs/heads/main",
    "head_branch-123",
]
invalid_refs = [
    "",
    None,
    123,
    "-b",
    "--help",
    "--upload-pack=evil",
    "ref with spaces",
    "ref;echo 1",
]

for ref in valid_refs:
    assert is_safe_ref(ref) is True, f"Expected valid ref: {ref}"

for ref in invalid_refs:
    assert is_safe_ref(ref) is False, f"Expected invalid ref: {ref}"

print("OK")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toBe('OK')
  })

  test('gh_raw rejects unsafe repo or unsafe ref without executing gh CLI', () => {
    const scriptsDir = path.join(__dirname, '..', 'scripts')
    const pythonScript = `import sys
sys.path.insert(0, r"${scriptsDir}")
from force_merge_pr import gh_raw

# Both should return None immediately without running subprocess
assert gh_raw("--bad-repo/name", "main.js", "main") is None
assert gh_raw("owner/repo", "main.js", "--bad-ref") is None
print("OK")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toBe('OK')
  })
})
