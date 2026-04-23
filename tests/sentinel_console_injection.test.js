const utilsLogging = require('../utils.logging');

describe('Sentinel: Console Injection in utils.logging.js', () => {
    beforeEach(() => {
        global.Game = { time: 100 };
        global.Memory = { logs: [] };
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('log() should escape HTML tags in the level parameter to prevent Console Injection', () => {
        const maliciousLevel = '<img src=x onerror=alert(1)>';
        utilsLogging.log(maliciousLevel, 'test message');

        const consoleCalls = console.log.mock.calls;
        expect(consoleCalls.length).toBe(1);

        // If it's not escaped, the console output will contain the raw HTML tags
        const output = consoleCalls[0][0];

        // We expect it to be escaped
        expect(output).not.toContain('<img');
        expect(output).toContain('&lt;img');
    });
});
