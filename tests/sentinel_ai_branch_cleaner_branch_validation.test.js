const { execFileSync } = require('child_process')
const path = require('path')

describe('Sentinel Security: ai_branch_cleaner.py get_recent_runs validation', () => {
  it('should return [] for invalid or flag-like branch names and avoid calling gh subprocess', () => {
    const scriptsDir = path.join(__dirname, '..', 'scripts')
    const pythonScript = `import sys
import os
from unittest.mock import patch, MagicMock

sys.path.insert(0, r"${scriptsDir}")
import ai_branch_cleaner

with patch('subprocess.run') as mock_run:
    # Invalid or flag injection attempts
    assert ai_branch_cleaner.get_recent_runs('--help') == []
    assert ai_branch_cleaner.get_recent_runs('-b') == []
    assert ai_branch_cleaner.get_recent_runs('--repo=malicious/repo') == []
    assert ai_branch_cleaner.get_recent_runs('branch with spaces') == []
    assert ai_branch_cleaner.get_recent_runs('branch;evil_cmd') == []
    assert ai_branch_cleaner.get_recent_runs('') == []
    assert ai_branch_cleaner.get_recent_runs(None) == []
    assert ai_branch_cleaner.get_recent_runs(123) == []
    assert not mock_run.called

    # Valid branch names should invoke subprocess
    mock_run.return_value = MagicMock(returncode=0, stdout='[{"status": "completed", "conclusion": "success"}]')
    res = ai_branch_cleaner.get_recent_runs('fix/issue-123')
    assert mock_run.called
    assert res == [{"status": "completed", "conclusion": "success"}]

print("OK")
`
    const output = execFileSync('python3', ['-c', pythonScript], { encoding: 'utf8' })
    expect(output.trim()).toBe('OK')
  })
})
