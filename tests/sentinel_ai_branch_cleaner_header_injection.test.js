const { execFileSync } = require('child_process');

describe('scripts/ai_branch_cleaner.py header injection and auth hardening', () => {
  it('should sanitize CRLF characters in GEMINI_API_KEY and set x-goog-api-key header', () => {
    const pythonCode = `
import os
import sys
import urllib.request
from unittest.mock import patch, MagicMock

sys.path.insert(0, 'scripts')
import ai_branch_cleaner

os.environ['GEMINI_API_KEY'] = 'test_key\\r\\nX-Injected-Header: malicious'

def mock_subprocess_run(cmd, **kwargs):
    mock_res = MagicMock()
    mock_res.returncode = 0
    if cmd[0] == 'gh' and 'pr' in cmd:
        mock_res.stdout = '[]'
    elif cmd[0] == 'git' and 'for-each-ref' in cmd:
        mock_res.stdout = 'origin/stale_branch|1600000000|Author|author@github.com|Subject|track'
    elif cmd[0] == 'git' and 'rev-list' in cmd:
        mock_res.stdout = '0 1'
    elif cmd[0] == 'git' and 'diff' in cmd:
        mock_res.stdout = 'main.js'
    else:
        mock_res.stdout = ''
    return mock_res

with patch('subprocess.run', side_effect=mock_subprocess_run), patch('urllib.request.urlopen') as mock_urlopen:
    mock_resp = MagicMock()
    mock_resp.read.return_value = b'{"candidates": [{"content": {"parts": [{"text": "[]"}]}}]}'
    mock_resp.__enter__.return_value = mock_resp
    mock_urlopen.return_value = mock_resp

    ai_branch_cleaner.main()

    assert mock_urlopen.called
    args, kwargs = mock_urlopen.call_args
    req = args[0]

    assert 'X-goog-api-key' in req.headers
    assert req.headers['X-goog-api-key'] == 'test_keyX-Injected-Header: malicious'
    assert '\\r' not in req.headers['X-goog-api-key']
    assert '\\n' not in req.headers['X-goog-api-key']

print('SUCCESS')
`;
    const result = execFileSync('python3', ['-c', pythonCode], { encoding: 'utf8' });
    expect(result.trim()).toContain('SUCCESS');
  });
});
