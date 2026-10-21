const { execFileSync } = require('child_process')

describe('scripts/force_merge_pr.py argument validation hardening', () => {
  const runPythonScript = (code) => {
    return execFileSync('python3', ['-c', code], {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    })
  }

  test('rejects invalid repo names starting with hyphen or invalid characters', () => {
    const code = `
import sys
from scripts.force_merge_pr import validate_repo

invalid_repos = ["--help", "-R/repo", "user/repo; injection", "user/repo space", ""]
for repo in invalid_repos:
    try:
        validate_repo(repo)
        print(f"FAILED: {repo} was accepted")
        sys.exit(1)
    except ValueError:
        pass
print("OK")
`
    const output = runPythonScript(code)
    expect(output.trim()).toBe('OK')
  })

  test('accepts valid repo names', () => {
    const code = `
from scripts.force_merge_pr import validate_repo

valid_repos = ["owner/repo", "my-org/my_repo.js", "123user/456repo"]
for repo in valid_repos:
    res = validate_repo(repo)
    assert res == repo, f"Expected {repo}, got {res}"
print("OK")
`
    const output = runPythonScript(code)
    expect(output.trim()).toBe('OK')
  })

  test('rejects invalid refs starting with hyphen or containing forbidden characters', () => {
    const code = `
import sys
from scripts.force_merge_pr import validate_ref

invalid_refs = ["--option", "-b", "main; rm -rf", "head ref with spaces", ""]
for ref in invalid_refs:
    try:
        validate_ref(ref)
        print(f"FAILED: {ref} was accepted")
        sys.exit(1)
    except ValueError:
        pass
print("OK")
`
    const output = runPythonScript(code)
    expect(output.trim()).toBe('OK')
  })

  test('accepts valid refs and commit SHAs', () => {
    const code = `
from scripts.force_merge_pr import validate_ref

valid_refs = ["main", "feature/branch-1", "v1.0.0", "a1b2c3d4e5f67890123456789012345678901234"]
for ref in valid_refs:
    res = validate_ref(ref)
    assert res == ref, f"Expected {ref}, got {res}"
print("OK")
`
    const output = runPythonScript(code)
    expect(output.trim()).toBe('OK')
  })

  test('rejects non-numeric PR issue numbers', () => {
    const code = `
import sys
from scripts.force_merge_pr import validate_number

invalid_numbers = ["--help", "123; calc", "abc", "-10", 0, -5]
for num in invalid_numbers:
    try:
        validate_number(num)
        print(f"FAILED: {num} was accepted")
        sys.exit(1)
    except ValueError:
        pass
print("OK")
`
    const output = runPythonScript(code)
    expect(output.trim()).toBe('OK')
  })

  test('accepts valid numeric PR issue numbers', () => {
    const code = `
from scripts.force_merge_pr import validate_number

valid_numbers = [1, 123, "456", "  789  "]
expected = ["1", "123", "456", "789"]
for num, exp in zip(valid_numbers, expected):
    res = validate_number(num)
    assert res == exp, f"Expected {exp}, got {res}"
print("OK")
`
    const output = runPythonScript(code)
    expect(output.trim()).toBe('OK')
  })
})
