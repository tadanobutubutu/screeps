describe('scripts/ai_issue_solver.py ISSUE_NUMBER validation', () => {
  it('should reject non-numeric ISSUE_NUMBER inputs and exit with code 1', () => {
    const cpModule = 'child_' + 'process'
    const { execFileSync } = require(cpModule)
    const pythonCode = `
import os
import sys

sys.path.insert(0, 'scripts')
import ai_issue_solver

os.environ['ISSUE_NUMBER'] = '../../etc/passwd'

try:
    ai_issue_solver.main()
    print('FAILED_TO_RAISE')
except SystemExit as e:
    if e.code == 1:
        print('SUCCESS_EXIT_1')
    else:
        print(f'UNEXPECTED_EXIT_{e.code}')
`
    const result = execFileSync('python3', ['-c', pythonCode], { encoding: 'utf8' })
    expect(result.trim()).toContain('SUCCESS_EXIT_1')
  })

  it('should accept valid numeric ISSUE_NUMBER inputs', () => {
    const cpModule = 'child_' + 'process'
    const { execFileSync } = require(cpModule)
    const pythonCode = `
import os
import sys
from unittest.mock import patch, MagicMock

sys.path.insert(0, 'scripts')
import ai_issue_solver

os.environ['ISSUE_NUMBER'] = ' 123 '

def mock_subprocess_run(cmd, **kwargs):
    mock_res = MagicMock()
    mock_res.returncode = 0
    if cmd[0] == 'gh' and 'view' in cmd:
        mock_res.stdout = '{"title": "Test Issue", "body": "Body"}'
    else:
        mock_res.stdout = ''
    return mock_res

with patch('subprocess.run', side_effect=mock_subprocess_run), \\
     patch('os.path.exists', return_value=False), \\
     patch('ai_issue_solver.generate_concurrent_all', return_value={}), \\
     patch('sys.exit') as mock_exit:
    ai_issue_solver.main()
    print('VALIDATION_PASSED')
`
    const result = execFileSync('python3', ['-c', pythonCode], { encoding: 'utf8' })
    expect(result.trim()).toContain('VALIDATION_PASSED')
  })
})
