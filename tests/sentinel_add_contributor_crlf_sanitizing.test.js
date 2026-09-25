describe('scripts/add-contributor.js header sanitization', () => {
  test('githubRequest sanitizes CRLF characters from request headers', async () => {
    const { githubRequest } = require('../scripts/add-contributor.js');
    const https = require('https');

    let capturedOptions;
    const originalRequest = https.request;
    https.request = jest.fn((url, options, callback) => {
      capturedOptions = options;
      const req = {
        on: jest.fn(),
        write: jest.fn(),
        end: jest.fn(() => {
          if (callback) {
            const res = {
              statusCode: 200,
              on: jest.fn((event, handler) => {
                if (event === 'data') handler(JSON.stringify({ ok: true }));
                if (event === 'end') handler();
              })
            };
            callback(res);
          }
        })
      };
      return req;
    });

    try {
      process.env.GITHUB_TOKEN = 'test-token\r\nBadHeader: injected';
      await githubRequest('/user', {
        headers: {
          'X-Custom\r\nHeader': 'value\r\nLine'
        }
      });

      expect(capturedOptions.headers['Authorization']).toBe('token test-tokenBadHeader: injected');
      expect(capturedOptions.headers['X-CustomHeader']).toBe('valueLine');
    } finally {
      https.request = originalRequest;
    }
  });
});
