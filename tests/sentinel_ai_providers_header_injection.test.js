const { execFileSync } = require('child_process');

describe('scripts/ai_providers.py header sanitization', () => {
    it('should sanitize CRLF characters in sanitize_header and normalize_token', () => {
        const pythonCode = `
import sys
sys.path.insert(0, 'scripts')
from ai_providers import sanitize_header, normalize_token

assert sanitize_header('Authorization: Bearer test\\r\\nX-Injected: true') == 'Authorization: Bearer testX-Injected: true'
assert normalize_token('  "secret_token\\r\\nwith_newline"  ') == 'secret_tokenwith_newline'
print('SUCCESS')
`;
        const result = execFileSync('python3', ['-c', pythonCode], { encoding: 'utf8' });
        expect(result.trim()).toBe('SUCCESS');
    });

    it('should sanitize headers in _openai_chat when constructing Request', () => {
        const pythonCode = `
import sys
import urllib.request
from unittest.mock import patch, MagicMock
sys.path.insert(0, 'scripts')
from ai_providers import _openai_chat

with patch('urllib.request.urlopen') as mock_urlopen:
    mock_resp = MagicMock()
    mock_resp.read.return_value = b'{"choices": [{"message": {"content": "ok"}}]}'
    mock_resp.__enter__.return_value = mock_resp
    mock_urlopen.return_value = mock_resp

    headers = {'X-Custom\\r\\nHeader': 'val\\r\\ninjected'}
    res = _openai_chat('http://example.com', 'model', 'prompt', headers=headers)

    # Verify the request header passed to Request
    args, kwargs = mock_urlopen.call_args
    req = args[0]
    assert 'X-customheader' in req.headers
    assert req.headers['X-customheader'] == 'valinjected'
    assert 'X-custom\\r\\nheader' not in req.headers

print('SUCCESS')
`;
        const result = execFileSync('python3', ['-c', pythonCode], { encoding: 'utf8' });
        expect(result.trim()).toBe('SUCCESS');
    });
});
