/**
 * tests/sentinel_log_level_bypass.test.js
 * Verification for log level bypass fix in src/utils/logger.js
 */
global.Game = { time: 100 };
global.Memory = {};

jest.mock(
    '../src/constants',
    () => ({
        LOG_LEVEL: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 },
        DEFAULT_LOG_LEVEL: 1,
    }),
    { virtual: true }
);

const logger = require('../src/utils/logger');
const { LOG_LEVEL } = require('../src/constants');

describe('Sentinel: Log Level Bypass Fix', () => {
    beforeEach(() => {
        global.Memory = {};
        console.log = jest.fn();
        logger.setLevel(LOG_LEVEL.INFO);
    });

    test('init() should default to INFO on invalid Memory.logLevel', () => {
        global.Memory.logLevel = -1;
        logger.init();
        expect(logger.getLevel()).toBe(LOG_LEVEL.INFO);

        global.Memory.logLevel = 'HACK';
        logger.init();
        expect(logger.getLevel()).toBe(LOG_LEVEL.INFO);
    });

    test('init() should accept valid Memory.logLevel', () => {
        global.Memory.logLevel = LOG_LEVEL.WARN;
        logger.init();
        expect(logger.getLevel()).toBe(LOG_LEVEL.WARN);
    });
});
