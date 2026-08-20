/**
 * tests/security_logger_robustness.test.js
 * Hardening tests for src/utils/logger.js
 */

const logger = require('../src/utils/logger');

describe('src/utils/logger robustness', () => {
    beforeEach(() => {
        global.Game = { time: 100 };
        global.Memory = {};
        // Mock console.log to avoid cluttering test output
        jest.spyOn(console, 'log').mockImplementation(() => {});
        logger.setLevel(logger.LOG_LEVEL.DEBUG); // Need to set to DEBUG so debug() is actually logged
        logger.clear(); // Clear history
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('_safeStringify should not throw on functions', () => {
        // This previously threw because JSON.stringify returns undefined
        expect(() => logger.info('test', () => {})).not.toThrow();
    });

    test('setLevel should not allow invalid levels that bypass checks', () => {
        // Set level to undefined
        logger.setLevel(undefined);

        // Should fallback to INFO (1)
        expect(logger.getLevel()).toBe(logger.LOG_LEVEL.INFO);

        // Set to string that can be parsed as number
        logger.setLevel('2');
        expect(logger.getLevel()).toBe(logger.LOG_LEVEL.WARN);

        // Set to invalid number
        logger.setLevel(99);
        expect(logger.getLevel()).toBe(logger.LOG_LEVEL.INFO);
    });

    test('_safeStringify should handle BigInts safely without crashing', () => {
        const data = { val: 42n };

        // This should not throw an error
        expect(() => {
            logger.debug('Test BigInt', data);
        }).not.toThrow();

        const history = logger.getHistory(1);
        expect(history.length).toBeGreaterThan(0);
        expect(history[0].message).toContain('42n');
    });
});
