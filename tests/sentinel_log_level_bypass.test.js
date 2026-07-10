/**
 * tests/sentinel_log_level_bypass.test.js
 * Reproduction and verification of log-level bypass vulnerability fixes.
 */

const logger = require('../src/utils/logger');
const { LOG_LEVEL } = require('../src/constants');

describe('src/utils/logger security: log-level bypass', () => {
    let logSpy;

    beforeEach(() => {
        global.Game = { time: 100 };
        global.Memory = {};
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        logger.clear();
        logger.resetStats();
        logger.setLevel(LOG_LEVEL.INFO); // Reset to default safe level
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('init() should not allow Memory.logLevel to bypass level gating', () => {
        // GIVEN: Memory.logLevel is set to an invalid value that might bypass comparisons
        global.Memory.logLevel = 'invalid';

        // WHEN: Logger is initialized
        logger.init();

        // THEN: It should fallback to a safe level (INFO) and NOT show DEBUG logs
        logger.debug('This should be suppressed');

        const debugLogs = logSpy.mock.calls.filter((call) => call[0].includes('DEBUG'));
        expect(debugLogs.length).toBe(0);
    });

    test('init() should default to INFO on invalid numeric Memory.logLevel', () => {
        // Maliciously set Memory.logLevel to -1 to bypass gates
        // If bug exists, _level is now -1.
        // debug gate: if (_level > LOG_LEVEL.DEBUG) return;
        // if (-1 > 0) return; -> false, so it logs!
        global.Memory.logLevel = -1; // Invalid negative value

        logger.init();

        // Verify that debug log is NOT shown
        logger.debug('This should be hidden');

        expect(logger.getLevel()).toBe(LOG_LEVEL.INFO);
        expect(logSpy).not.toHaveBeenCalled();
    });

    test('init() should default to INFO on invalid string Memory.logLevel', () => {
        global.Memory.logLevel = 'INVALID_STRING';

        logger.init();

        logger.debug('Debug message');

        expect(logger.getLevel()).toBe(LOG_LEVEL.INFO);
        expect(logSpy).not.toHaveBeenCalled();
    });

    test('init() should accept valid Memory.logLevel', () => {
        global.Memory.logLevel = LOG_LEVEL.WARN;

        logger.init();

        logger.info('Info message');

        expect(logger.getLevel()).toBe(LOG_LEVEL.WARN);
        expect(logSpy).not.toHaveBeenCalled();

        logger.warn('Warning message');
        expect(logSpy).toHaveBeenCalled();
    });

    test('init() should handle null/boolean/empty string/arrays from Memory securely', () => {
        const trickyValues = [null, false, '', [], ' ', true];

        trickyValues.forEach((val) => {
            global.Memory.logLevel = val;
            logger.init();

            // Should fallback to INFO and NOT show DEBUG
            logger.debug('This should be suppressed');
            const debugLogs = logSpy.mock.calls.filter((call) => call[0].includes('DEBUG'));
            expect(debugLogs.length).toBe(0);

            // Reset for next iteration
            logSpy.mockClear();
        });
    });

    test('init() should correctly handle numeric strings from Memory', () => {
        global.Memory.logLevel = '2'; // WARN
        logger.init();

        logger.info('This should be suppressed');
        logger.warn('This should be shown');

        const infoLogs = logSpy.mock.calls.filter((call) => call[0].includes('INFO'));
        const warnLogs = logSpy.mock.calls.filter((call) => call[0].includes('WARN'));

        expect(infoLogs.length).toBe(0);
        expect(warnLogs.length).toBe(1);
    });
});
