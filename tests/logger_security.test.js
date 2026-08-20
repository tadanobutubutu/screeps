/**
 * src/utils/logger.js のセキュリティ（DoS対策）テスト
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

describe('logger security (DoS protection)', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
        global.Game.time = 100;
        console.log = jest.fn();
        logger.setLevel(0);
        logger.clear();
    });

    test('long info message should be truncated', () => {
        const longMessage = 'A'.repeat(1000);
        logger.info(longMessage);

        const history = logger.getHistory(1);
        expect(history[0].message.length).toBe(500);
        expect(history[0].message).toBe('A'.repeat(500));
    });

    test('falsy values like 0 should be logged correctly', () => {
        logger.info(0);
        const history = logger.getHistory(1);
        expect(history[0].message).toBe('0');
    });

    test('falsy values like false should be logged correctly', () => {
        logger.info(false);
        const history = logger.getHistory(1);
        expect(history[0].message).toBe('false');
    });

    test('long error object message should be truncated', () => {
        const longErrorMessage = 'E'.repeat(1000);
        const error = new Error(longErrorMessage);
        // Explicitly clear stack to focus on message truncation
        error.stack = '';
        logger.error('Context', error);

        const history = logger.getHistory(1);
        expect(history[0].message).toContain('Context');
        expect(history[0].message).toContain('E'.repeat(500));
        expect(history[0].message).not.toContain('E'.repeat(501));
        // Full string: "Context" + " | " + 500 Es = 7 + 3 + 500 = 510
        expect(history[0].message.length).toBe(7 + 3 + 500);
    });

    test('extremely long stack trace should be truncated in getSafeStack', () => {
        const longStack = 'at someFunction (/path/to/file.js:1:1)\n'.repeat(100);
        const safeStack = logger.getSafeStack(longStack);

        // MAX_STACK_TRACE_LENGTH is 2000.
        // Truncating to 2000 chars should happen before splitting.
        expect(longStack.length).toBeGreaterThan(2000);

        // The number of lines is also limited by .slice(0, 5)
        const lines = safeStack.split('\n');
        expect(lines.length).toBeLessThanOrEqual(5);
    });

    test('getSafeStack redacts lines that look like paths but do not match the pattern', () => {
        const stack = 'Error: test\n    at /secret/path/to/internal/file.js';
        const result = logger.getSafeStack(stack);
        expect(result).not.toContain('/secret/path/');
    });
});
