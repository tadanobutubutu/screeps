/**
 * tests/sentinel_console_injection.test.js
 * Comprehensive tests for Console Injection in src/utils/logger.js
 */

// グローバル設定
global.Game = { time: 100 };
global.Memory = { logs: [] };

jest.mock(
    '../src/constants',
    () => ({
        LOG_LEVEL: {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            NONE: 4,
        },
        DEFAULT_LOG_LEVEL: 1,
    }),
    { virtual: true }
);

const logger = require('../src/utils/logger');

describe('Sentinel: logger console injection hardening', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
        global.Game.time = 100;
        console.log = jest.fn();
        logger.setLevel(0);
        logger.clear();
        // Reset private history by calling clear
        logger.resetStats();
    });

    test('success() should escape HTML in log messages', () => {
        const maliciousMessage = '<img src=x onerror=alert(1)>';
        logger.success(maliciousMessage);

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('&lt;img'));
        expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining(maliciousMessage));
    });

    test('showDashboard() should escape HTML in log messages from history', () => {
        const maliciousMessage = '<script>alert("message")</script>';
        logger.info(maliciousMessage);

        // Clear console.log calls from logger.info
        jest.clearAllMocks();

        logger.showDashboard();

        const call = console.log.mock.calls.find((args) => args[0].includes('[T:100][info]'));
        expect(call).toBeDefined();
        expect(call[0]).not.toContain(maliciousMessage);
        expect(call[0]).toContain('&lt;script&gt;');
    });

    test('showDashboard() should escape HTML in log levels from history', () => {
        const maliciousLevel = '<script>alert("level")</script>';

        // Populate history with a standard log
        logger.info('test message');

        // Mutate the history entry to contain a malicious level string
        const history = logger.getHistory(1);
        expect(history.length).toBe(1);
        history[0].level = maliciousLevel;

        jest.clearAllMocks();
        logger.showDashboard();

        const call = console.log.mock.calls.find((args) =>
            args[0].includes('&lt;script&gt;alert(&quot;level&quot;)&lt;/script&gt;')
        );

        expect(call).toBeDefined();
        expect(call[0]).not.toContain(maliciousLevel);
    });
});
