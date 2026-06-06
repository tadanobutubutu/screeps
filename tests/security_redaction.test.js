const { sanitizeLog } = require('../deploy');

describe('Security Redaction in deploy.js', () => {
    test('redacts tokens and other sensitive keywords', () => {
        expect(sanitizeLog('Deploying with token: abc-123')).toBe('Deploying with token: [REDACTED]');
        expect(sanitizeLog('Error: invalid pass=someval123')).toBe('Error: invalid pass=[REDACTED]');
        expect(sanitizeLog('{"apikey": "xyz-789"}')).toBe('{"apikey": "[REDACTED]"}');
        expect(sanitizeLog('Bearer MySessionToken')).toBe('Bearer [REDACTED]');
        expect(sanitizeLog('auth: user123')).toBe('auth: [REDACTED]');
        expect(sanitizeLog('credential=top-some-val')).toBe('credential=[REDACTED]');
        expect(sanitizeLog('session "sess-id-999"')).toBe('session "[REDACTED]"');
    });

    test('redacts absolute paths', () => {
        expect(sanitizeLog('Error at /usr/local/bin/node')).toBe('Error at [REDACTED]');
        expect(sanitizeLog('Windows path C:\\Users\\Admin\\main.js')).toBe('Windows path [REDACTED]');
    });

    test('preserves non-sensitive information', () => {
        expect(sanitizeLog('CPU usage: 1.5/10.0')).toBe('CPU usage: 1.5/10.0');
        expect(sanitizeLog('Status: 200 OK')).toBe('Status: 200 OK');
    });

    test('handles non-string inputs gracefully', () => {
        expect(sanitizeLog(null)).toBe(null);
        expect(sanitizeLog(undefined)).toBe(undefined);
        expect(sanitizeLog(123)).toBe(123);
    });
});
