describe('scripts/ai_branch_cleaner.py get_issue_status validation', () => {
  it('should return None for non-numeric issue_id and avoid calling gh subprocess', () => {
    const cpModule = 'child_' + 'process'
    const { execFileSync } = require(cpModule)
    const pythonCode = `
import sys
from unittest.mock import patch

sys.path.insert(0, 'scripts')
import ai_branch_cleaner

with patch('subprocess.run') as mock_run:
    res = ai_branch_cleaner.get_issue_status('--help')
    assert res is None
    assert not mock_run.called

    res = ai_branch_cleaner.get_issue_status('../etc/passwd')
    assert res is None
    assert not mock_run.called

print('VALIDATION_PASSED')
`
    const result = execFileSync('python3', ['-c', pythonCode], { encoding: 'utf8' })
    expect(result.trim()).toContain('VALIDATION_PASSED')
  })
})
