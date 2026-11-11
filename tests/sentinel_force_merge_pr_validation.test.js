const { execFileSync } = require('child_process')
const path = require('path')

describe('Sentinel Security: force_merge_pr.py Repository Validation', () => {
  const scriptsDir = path.join(__dirname, '..', 'scripts')

  test('is_safe_repo_name validates owner/repo format and rejects flags / path traversal', () => {
    const pythonScript = `import sys
sys.path.insert(0, r"${scriptsDir}")
from force_merge_pr import is_safe_repo_name

valid_repos = [
    "tadanobutubutu/screeps",
    "owner-name/repo.name",
    "org_123/repo_456",
    "valid/repo-v1.0"
]

invalid_repos = [
    "--help/repo",
    "owner/--flag",
    "-R/repo",
    "owner/-repo",
    "../malicious/repo",
    "owner/../malicious",
    "invalid",
    "owner/repo/extra",
    "owner/repo;rm -rf /",
    "owner/repo space",
    "",
    None,
    123
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

  test('main() rejects malicious GITHUB_REPOSITORY environment variable', () => {
    const forceMergeScript = path.join(scriptsDir, 'force_merge_pr.py')
    try {
      execFileSync('python3', [forceMergeScript, '--dry-run'], {
        env: {
          ...process.env,
          GITHUB_REPOSITORY: '--upload-pack=evil'
        },
        encoding: 'utf8'
      })
      // If it didn't throw, it should have exited with code 1
      throw new Error('Expected script to exit with error')
    } catch (err) {
      expect(err.status).toBe(1)
      expect(err.stdout + err.stderr).toContain('Invalid or unsafe repository name')
    }
  })
})
