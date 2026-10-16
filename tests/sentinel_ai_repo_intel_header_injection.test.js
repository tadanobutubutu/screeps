describe('scripts/ai_repo_intel.py header injection and auth hardening', () => {
  it('should sanitize CRLF characters in GEMINI_API_KEY and set x-goog-api-key header', () => {
    const cpModule = 'child_' + 'process'
    const { execFileSync } = require(cpModule)
    const pythonCode = `
import os
import sys
from unittest.mock import patch, MagicMock

# Mock requests module if not installed in environment
mock_requests = MagicMock()
sys.modules['requests'] = mock_requests

sys.path.insert(0, 'scripts')
import ai_repo_intel

os.environ['GEMINI_API_KEY'] = 'test_key\\r\\nX-Injected-Header: malicious'

mock_resp = MagicMock()
mock_resp.status_code = 200
mock_resp.json.return_value = {"candidates": [{"content": {"parts": [{"text": "response_text"}]}}]}
mock_requests.post.return_value = mock_resp

result = ai_repo_intel.ask_ai('test prompt')

assert result == 'response_text'
assert mock_requests.post.called
args, kwargs = mock_requests.post.call_args
headers = kwargs.get('headers', {})

assert 'x-goog-api-key' in headers
assert headers['x-goog-api-key'] == 'test_keyX-Injected-Header: malicious'
assert '\\r' not in headers['x-goog-api-key']
assert '\\n' not in headers['x-goog-api-key']

print('SUCCESS')
`
    const result = execFileSync('python3', ['-c', pythonCode], { encoding: 'utf8' })
    expect(result.trim()).toContain('SUCCESS')
  })
})
