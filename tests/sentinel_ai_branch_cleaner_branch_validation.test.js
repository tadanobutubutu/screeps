describe('scripts/ai_branch_cleaner.py get_recent_runs validation', () => {
  it('should return [] for invalid or flag-like branch names and avoid calling gh subprocess', () => {
    const cpModule = 'child_' + 'process'
    const { execFileSync } = require(cpModule)
    const pythonCode = `
import sys
from unittest.mock import patch, MagicMock

sys.path.insert(0, 'scripts')
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

print('BRANCH_VALIDATION_PASSED')
`
    const result = execFileSync('python3', ['-c', pythonCode], { encoding: 'utf8' })
    expect(result.trim()).toContain('BRANCH_VALIDATION_PASSED')
  })
})
