const { execFileSync } = require('child_process');

describe('scripts/ai_providers.py call_gemini header transmission', () => {
    it('should pass API key via x-goog-api-key header and not in URL query parameters', () => {
        const pythonCode = `
import sys
import urllib.request
from unittest.mock import patch, MagicMock
sys.path.insert(0, 'scripts')
from ai_providers import call_gemini

with patch('urllib.request.urlopen') as mock_urlopen:
    mock_resp = MagicMock()
    mock_resp.read.return_value = b'{"candidates": [{"content": {"parts": [{"text": "response_text"}]}}]}'
    mock_resp.__enter__.return_value = mock_resp
    mock_urlopen.return_value = mock_resp

    test_key = 'AIzaSyTestSecretApiKey123'
    result = call_gemini('test prompt', test_key)

    assert result == 'response_text'
    args, kwargs = mock_urlopen.call_args
    req = args[0]

    # Assert API key is passed via x-goog-api-key header (stored normalized lowercase by urllib Request)
    assert 'X-goog-api-key' in req.headers
    assert req.headers['X-goog-api-key'] == test_key

    # Assert URL does NOT contain the key in query parameters
    assert '?key=' not in req.full_url
    assert test_key not in req.full_url

print('SUCCESS')
`;
        const result = execFileSync('python3', ['-c', pythonCode], { encoding: 'utf8' });
        expect(result.trim()).toContain('SUCCESS');
    });
});
