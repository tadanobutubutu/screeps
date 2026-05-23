/**
 * tests/sentinel_log_level_bypass.test.js
 * Verification test for log level bypass fix in src/utils/logger.js
 */

// Global mock setup
global.Game = { time: 100 };
global.Memory = { logLevel: undefined };

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
const { LOG_LEVEL } = require('../src/constants');

describe('Sentinel: Log Level Bypass Verification', () => {
    beforeEach(() => {
        global.Memory = {};
        global.Game.time = 100;
        console.log = jest.fn();
        logger.setLevel(LOG_LEVEL.INFO); // Reset to INFO
    });

    test('init() should default to INFO on invalid numeric Memory.logLevel', () => {
        // -1 is invalid
        global.Memory.logLevel = -1;

        logger.init();

        // Verify that debug log is NOT shown
        logger.debug('This should be hidden');

        expect(logger.getLevel()).toBe(LOG_LEVEL.INFO);
        expect(console.log).not.toHaveBeenCalled();
    });

    test('init() should default to INFO on invalid string Memory.logLevel', () => {
        global.Memory.logLevel = 'HACK';

        logger.init();

        logger.debug('Debug message');

        expect(logger.getLevel()).toBe(LOG_LEVEL.INFO);
        expect(console.log).not.toHaveBeenCalled();
    });

    test('init() should accept valid Memory.logLevel', () => {
        global.Memory.logLevel = LOG_LEVEL.WARN;

        logger.init();

        logger.info('Info message');

        expect(logger.getLevel()).toBe(LOG_LEVEL.WARN);
        expect(console.log).not.toHaveBeenCalled();

        logger.warn('Warning message');
        expect(console.log).toHaveBeenCalled();
    });
});
