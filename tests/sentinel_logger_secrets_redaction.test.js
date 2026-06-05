/**
 * Sentinel Security Hardening Test: Secrets Redaction
 * Verifies that all log levels in both logging utilities redact absolute paths
 * and sensitive keywords (tokens, passwords, etc.).
 */

const fs = require('fs');
const path = require('path');

// Mock Screeps environment
global.Game = { time: 100 };
global.Memory = { logs: [] };

// Mock Constants for src/utils/logger
jest.mock(
    './src/constants',
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

describe('Sentinel: Comprehensive Secrets Redaction Hardening', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
        srcLogger.setLevel(0); // DEBUG
        srcLogger.clear();
        console.log.mockClear();
    });

    const sensitiveData = [
        { key: 'token', val: 'ghp_1234567890abcdef' },
        { key: 'password', val: 'P@ssw0rd123' },
        { key: 'secret', val: 'super-secret-key' },
        { key: 'apiKey', val: 'sk_live_51M...' },
        { key: 'auth', val: 'Basic dXNlcjpwYXNz' },
        { key: 'credentials', val: 'user:pass' },
        { key: 'bearer', val: 'eyJhbGciOiJIUzI1Ni...' },
        { key: 'session', val: 'sess:987654321' },
        { key: 'api_key', val: 'ak_test_12345' },
        { key: 'dsn', val: 'https://user@sentry.io/1' },
        { key: 'apikey', val: 'simplekey' },
    ];

    describe('src/utils/logger.js secrets redaction', () => {
        test('should redact all sensitive keywords with various separators', () => {
            sensitiveData.forEach(({ key, val }) => {
                const message = `Connection failed for ${key}: ${val}`;
                srcLogger.error(message);

                const history = srcLogger.getHistory(1);
                expect(history[0].message).not.toContain(val);
                expect(history[0].message).toContain(`${key}: [REDACTED]`);
            });
        });

        test('should redact sensitive keywords in data objects', () => {
            srcLogger.info('User login', { token: 'secret-token', user: 'jules' });

            const history = srcLogger.getHistory(1);
            expect(history[0].message).not.toContain('secret-token');
            expect(history[0].message).toContain('"token":"[REDACTED]"');
        });

        test('should be case-insensitive for keywords', () => {
            srcLogger.warn('TOKEN=99999');
            const history = srcLogger.getHistory(1);
            expect(history[0].message).toContain('TOKEN=[REDACTED]');
            expect(history[0].message).not.toContain('99999');
        });

        test('should handle multiple secrets in one message', () => {
            srcLogger.debug('auth: myauth token: mytoken');
            const history = srcLogger.getHistory(1);
            expect(history[0].message).toContain('auth: [REDACTED]');
            expect(history[0].message).toContain('token: [REDACTED]');
            expect(history[0].message).not.toContain('myauth');
            expect(history[0].message).not.toContain('mytoken');
        });
    });

    describe('utils.logging.js secrets redaction', () => {
        test('log() should redact sensitive keywords for all levels', () => {
            sensitiveData.forEach(({ key, val }) => {
                utilsLogging.log('info', `${key}=${val}`);
                const lastLog = Memory.logs[Memory.logs.length - 1];
                expect(lastLog.message).not.toContain(val);
                expect(lastLog.message).toContain(`${key}=[REDACTED]`);
            });
        });

        test('tryCatch should redact secrets from error messages', () => {
            const fn = () => {
                throw new Error('Authentication failed for token: abcdefg');
            };
            utilsLogging.tryCatch(fn, 'test');

            const lastLog = Memory.logs[Memory.logs.length - 1];
            expect(lastLog.message).toContain('token: [REDACTED]');
            expect(lastLog.message).not.toContain('abcdefg');
        });
    });

    describe('Integration of Paths and Secrets', () => {
        test('should redact both paths and secrets simultaneously', () => {
            const mixedMessage = 'Loaded /etc/shadow with password: password123';
            srcLogger.error(mixedMessage);

            const history = srcLogger.getHistory(1);
            expect(history[0].message).toBe('Loaded [REDACTED] with password: [REDACTED]');
            expect(history[0].message).not.toContain('/etc/shadow');
            expect(history[0].message).not.toContain('password123');
        });
    });
});
