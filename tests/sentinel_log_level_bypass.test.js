/**
 * tests/sentinel_log_level_bypass.test.js
 * Verification for log-level bypass via Memory.logLevel
 */

const logger = require('../src/utils/logger');

describe('src/utils/logger init bypass', () => {
    beforeEach(() => {
        global.Game = { time: 100 };
        global.Memory = {};
        // Mock console.log to avoid cluttering test output and to track calls
        jest.spyOn(console, 'log').mockImplementation(() => {});
        logger.clear();
        logger.resetStats();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('init should not allow invalid Memory.logLevel to bypass level gates', () => {
        // Initially set to ERROR (3)
        logger.setLevel(logger.LOG_LEVEL.ERROR);
        expect(logger.getLevel()).toBe(logger.LOG_LEVEL.ERROR);

        // Debug message should be suppressed
        logger.debug('should not see this');
        expect(console.log).not.toHaveBeenCalled();

        // Maliciously set Memory.logLevel to -1 to bypass gates
        global.Memory.logLevel = -1;
        logger.init();

        // If bug exists, _level is now -1
        // debug gate: if (_level > LOG_LEVEL.DEBUG) return;
        // if (-1 > 0) return; -> false, so it logs!
        logger.debug('bypassed debug');

        // Check if it was logged
        const stats = logger.getStats();
        // If it was bypassed, stats.debug will be 1
        expect(stats.debug).toBe(0); // This should fail before the fix
    });

    test('init should use setLevel for validation', () => {
        global.Memory.logLevel = 'invalid';
        logger.init();

        // Should fallback to INFO (1) if it uses setLevel
        expect(logger.getLevel()).toBe(logger.LOG_LEVEL.INFO);
    });
});
