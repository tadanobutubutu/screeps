/**
 * Sentinel Security Hardening Test: Log Redaction
 * Verifies that all log levels in both logging utilities redact absolute paths.
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
        DEFAULT_LOG_LEVEL: 0, // DEBUG
    }),
    { virtual: true }
);

// Mock console.log to avoid noise and capture output
const originalLog = console.log;
beforeAll(() => {
    console.log = jest.fn();
});
afterAll(() => {
    console.log = originalLog;
});

const utilsLogging = require('../utils.logging');
const srcLogger = require('../src/utils/logger');

describe('Sentinel: Comprehensive Log Redaction Hardening', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
        srcLogger.setLevel(0); // DEBUG
        console.log.mockClear();
    });

    const unixPath = '/var/lib/secret/data.json';
    const winPath = 'D:\\Secrets\\config.yaml';

    describe('src/utils/logger.js hardening', () => {
        test('debug() should redact absolute paths', () => {
            srcLogger.debug(`Loading from ${unixPath}`);
            const history = srcLogger.getHistory(1);
            expect(history[0].message).not.toContain(unixPath);
            expect(history[0].message).toContain('[REDACTED]');
        });

        test('info() should redact absolute paths', () => {
            srcLogger.info(`Connected to ${winPath}`);
            const history = srcLogger.getHistory(1);
            expect(history[0].message).not.toContain(winPath);
            expect(history[0].message).toContain('[REDACTED]');
        });

        test('warn() should redact absolute paths', () => {
            srcLogger.warn(`File ${unixPath} is missing`);
            const history = srcLogger.getHistory(1);
            expect(history[0].message).not.toContain(unixPath);
            expect(history[0].message).toContain('[REDACTED]');
        });

        test('success() should redact absolute paths', () => {
            srcLogger.success(`Saved to ${winPath}`);
            const history = srcLogger.getHistory(1);
            expect(history[0].message).not.toContain(winPath);
            expect(history[0].message).toContain('[REDACTED]');
        });

        test('log methods should redact absolute paths in data objects', () => {
            srcLogger.info('Data leak test', { path: unixPath });
            const history = srcLogger.getHistory(1);
            expect(history[0].message).not.toContain(unixPath);
            expect(history[0].message).toContain('[REDACTED]');
        });
    });

    describe('utils.logging.js hardening', () => {
        test('log() should redact absolute paths for all levels', () => {
            const levels = ['debug', 'info', 'warn', 'error'];
            levels.forEach(level => {
                utilsLogging.log(level, `Path: ${unixPath}`);
                const lastLog = Memory.logs[Memory.logs.length - 1];
                expect(lastLog.message).not.toContain(unixPath);
                expect(lastLog.message).toContain('[REDACTED]');
            });
        });

        test('convenience methods should redact absolute paths', () => {
            utilsLogging.error(`Critical error at ${winPath}`);
            const lastLog = Memory.logs[Memory.logs.length - 1];
            expect(lastLog.message).not.toContain(winPath);
            expect(lastLog.message).toContain('[REDACTED]');
        });
    });
});
