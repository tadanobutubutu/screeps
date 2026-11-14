const { execFileSync } = require('child_process')
const path = require('path')

describe('Sentinel Security: force_merge_pr.py repo and ref validation', () => {
  const scriptsDir = path.join(__dirname, '..', 'scripts')

  test('is_safe_repo_name validates owner/repo format and rejects flag injection / path traversal', () => {
    const pythonScript = `
import sys
sys.path.insert(0, r"${scriptsDir}")
from force_merge_pr import is_safe_repo_name

valid_repos = [
    "owner/repo",
    "org-name/repo.js",
    "tadanobutubutu/screeps",
    "user_123/project_alpha",
    "foo-bar/baz.qux"
]

invalid_repos = [
    "--upload-pack=evil",
    "-R",
    "evil/repo; rm -rf /",
    "owner/repo/subpath",
    "../owner/repo",
    "/owner/repo",
    "owner",
    "owner/",
    "/repo",
    "",
    None,
    123,
    "owner/repo with spaces",
    "-owner/repo",
    "owner/-repo"
]

for r in valid_repos:
    assert is_safe_repo_name(r) is True, f"Expected valid repo: {r}"

for r in invalid_repos:
    assert is_safe_repo_name(r) is False, f"Expected invalid repo: {r}"

print("REPO_VALIDATION_PASSED")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toContain('REPO_VALIDATION_PASSED')
  })

  test('is_safe_ref validates ref strings and rejects flag injection / traversal', () => {
    const pythonScript = `
import sys
sys.path.insert(0, r"${scriptsDir}")
from force_merge_pr import is_safe_ref

valid_refs = [
    "main",
    "master",
    "feature/branch-name",
    "v1.0.0",
    "0123456789abcdef0123456789abcdef01234567",
    "refs/heads/main",
    "fix_issue_123"
]

invalid_refs = [
    "--help",
    "-b",
    "--upload-pack=evil",
    "; evil_cmd",
    "branch with spaces",
    "",
    None,
    123,
    "-leading-hyphen",
    "branch$(evil)"
]

for r in valid_refs:
    assert is_safe_ref(r) is True, f"Expected valid ref: {r}"

for r in invalid_refs:
    assert is_safe_ref(r) is False, f"Expected invalid ref: {r}"

print("REF_VALIDATION_PASSED")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toContain('REF_VALIDATION_PASSED')
  })

  test('gh_raw returns None and skips gh subprocess when repo or ref is invalid', () => {
    const pythonScript = `
import sys
from unittest.mock import patch, MagicMock

sys.path.insert(0, r"${scriptsDir}")
import force_merge_pr

with patch('subprocess.run') as mock_run:
    # Invalid repo
    res1 = force_merge_pr.gh_raw("--upload-pack=evil", "main.js", "main")
    assert res1 is None
    assert not mock_run.called

    # Invalid ref
    res2 = force_merge_pr.gh_raw("owner/repo", "main.js", "--upload-pack")
    assert res2 is None
    assert not mock_run.called

    # Valid call should invoke subprocess
    mock_run.return_value = MagicMock(returncode=0, stdout="console.log('hello');")
    res3 = force_merge_pr.gh_raw("owner/repo", "main.js", "main")
    assert mock_run.called
    assert res3 == "console.log('hello');"

print("GH_RAW_VALIDATION_PASSED")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toContain('GH_RAW_VALIDATION_PASSED')
  })
})
