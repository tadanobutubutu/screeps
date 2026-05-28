/**
 * Sentinel Security Test: Path Redaction
 * Verifies that absolute internal file paths are redacted from error logs.
 */

const fs = require('fs');
const path = require('path');

// Mock Screeps environment
global.Game = { time: 100 };
global.Memory = {};

// Mock Constants for src/utils/logger
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

// Mock console.log to avoid noise
const originalLog = console.log;
beforeAll(() => {
    console.log = jest.fn();
});
afterAll(() => {
    console.log = originalLog;
});

const utilsLogging = require('../utils.logging');
const srcLogger = require('../src/utils/logger');

describe('Sentinel: Path Redaction Security', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
        srcLogger.setLevel(0); // DEBUG
    });

    describe('utils.logging.js', () => {
        test('tryCatch redacts absolute paths from error messages', () => {
            const fn = () => {
                const err = new Error('Cannot find module "/abs/path/to/secret.js"');
                throw err;
            };

            utilsLogging.tryCatch(fn, 'test_context');

            const lastLog = Memory.logs[Memory.logs.length - 1];
            expect(lastLog.level).toBe('error');
            expect(lastLog.message).toContain('[REDACTED]');
            expect(lastLog.message).not.toContain('/abs/path/to/');
        });

        test('getSafeStack redacts absolute paths from the first line', () => {
            const stack =
                'Error: Failed at /home/user/app/main.js\n    at Object.run (/home/user/app/main.js:10:5)';
            const safeStack = utilsLogging.getSafeStack(stack);

            expect(safeStack).toContain('[REDACTED]');
            expect(safeStack).not.toContain('/home/user/app/');
        });

        test('getSafeStack redacts Windows-style absolute paths', () => {
            const stack =
                'Error: Failed at C:\\Users\\Admin\\project\\main.js\n    at Object.run (C:\\Users\\Admin\\project\\main.js:10:5)';
            const safeStack = utilsLogging.getSafeStack(stack);

            expect(safeStack).toContain('[REDACTED]');
            expect(safeStack).not.toContain('C:\\Users\\Admin');
        });
    });

    describe('src/utils/logger.js', () => {
        test('error() redacts absolute paths from error messages', () => {
            const err = new Error('Failed to load /var/www/html/config.php');
            srcLogger.error('Initialization failed', err);

            // src/utils/logger records to internal _history array
            const history = srcLogger.getHistory(1);
            const lastEntry = history[0];

            expect(lastEntry.level).toBe('error');
            expect(lastEntry.message).toContain('[REDACTED]');
            expect(lastEntry.message).not.toContain('/var/www/html/');
        });

        test('getSafeStack redacts absolute paths from the first line', () => {
            const stack =
                'Error: Internal failure in /opt/screeps/server.js\n    at Server.start (/opt/screeps/server.js:50:12)';
            const safeStack = srcLogger.getSafeStack(stack);

            expect(safeStack).toContain('[REDACTED]');
            expect(safeStack).not.toContain('/opt/screeps/');
        });

        test('getSafeStack redacts Windows-style absolute paths', () => {
            const stack =
                'Error: Internal failure in D:\\Screeps\\main.js\n    at Object.run (D:\\Screeps\\main.js:5:10)';
            const safeStack = srcLogger.getSafeStack(stack);

            expect(safeStack).toContain('[REDACTED]');
            expect(safeStack).not.toContain('D:\\Screeps');
        });
    });
});
