/**
 * utils.logging.js のユニットテスト
 */

global.Game = { time: 100 };
global.Memory = {};

// console.logをモック
const originalLog = console.log;
beforeAll(() => {
    console.log = jest.fn();
});
afterAll(() => {
    console.log = originalLog;
});

const utilsLogging = require('../utils.logging');

describe('utils.logging', () => {
    test('モジュールが正しく読み込める', () => {
        expect(utilsLogging).toBeDefined();
    });

    test('log関数が存在すれば呼び出せる', () => {
        if (typeof utilsLogging.log === 'function') {
            expect(() => utilsLogging.log('test message')).not.toThrow();
        }
    });

    test('info関数が存在すれば呼び出せる', () => {
        if (typeof utilsLogging.info === 'function') {
            expect(() => utilsLogging.info('info message')).not.toThrow();
        }
    });

    test('warn関数が存在すれば呼び出せる', () => {
        if (typeof utilsLogging.warn === 'function') {
            expect(() => utilsLogging.warn('warn message')).not.toThrow();
        }
    });

    test('error関数が存在すれば呼び出せる', () => {
        if (typeof utilsLogging.error === 'function') {
            expect(() => utilsLogging.error('error message')).not.toThrow();
        }
    });

    test('エクスポートされた関数が少なくとも1つある', () => {
        const keys = Object.keys(utilsLogging);
        expect(keys.length).toBeGreaterThan(0);
    });

    test('log function truncates long messages', () => {
        const longMessage = 'A'.repeat(600);
        utilsLogging.log('info', longMessage);

        expect(Memory.logs[Memory.logs.length - 1].message.length).toBe(500);
        expect(Memory.logs[Memory.logs.length - 1].message).toBe('A'.repeat(500));
    });

    test('log function handles arrays', () => {
        utilsLogging.log('info', [1, 2, 3]);
        expect(Memory.logs).toBeDefined();
    });

    test('log function handles objects', () => {
        utilsLogging.log('info', { key: 'value' });
        expect(Memory.logs).toBeDefined();
    });

    test('error function exists and can be called', () => {
        if (typeof utilsLogging.error === 'function') {
            utilsLogging.error('error message');
            expect(Memory.logs[Memory.logs.length - 1].level).toBe('error');
        }
    });

    test('getSafeStack processes stack trace correctly', () => {
        const stack =
            'Error: test\n    at Object.<anonymous> (/workspace/test.js:10:5)\n    at Function.test (/workspace/test2.js:20:10)';
        const result = utilsLogging.getSafeStack(stack);
        expect(result).toContain('[REDACTED]');

        expect(result).not.toContain('/workspace/');
    });

    test('getSafeStack redacts lines that look like paths but do not match the pattern', () => {
        const stack = 'Error: test\n    at /secret/path/to/internal/file.js';
        const result = utilsLogging.getSafeStack(stack);
        // Current behavior: leaks the path
        // Desired behavior: redacts it
        expect(result).not.toContain('/secret/path/');
    });

    test('getSafeStack returns empty string for null input', () => {
        const result = utilsLogging.getSafeStack(null);
        expect(result).toBe('');
    });

    test('getSafeStack returns empty string for undefined input', () => {
        const result = utilsLogging.getSafeStack(undefined);
        expect(result).toBe('');
    });

    test('getSafeStack returns empty string for empty string input', () => {
        const result = utilsLogging.getSafeStack('');
        expect(result).toBe('');
    });

    test('tryCatch executes function and returns result', () => {
        const fn = () => 'result';
        const result = utilsLogging.tryCatch(fn, 'test');
        expect(result).toBe('result');
    });

    test('tryCatch catches and logs errors', () => {
        const fn = () => {
            throw new Error('test error');
        };
        const result = utilsLogging.tryCatch(fn, 'test');
        expect(result).toBeUndefined();
        expect(Memory.logs.length).toBeGreaterThan(0);
        expect(Memory.logs[Memory.logs.length - 1].level).toBe('error');
    });

    test('getRecentLogs returns recent logs', () => {
        utilsLogging.log('info', 'message1');
        utilsLogging.log('info', 'message2');
        const logs = utilsLogging.getRecentLogs(1);
        expect(logs.length).toBe(1);
        expect(logs[0].message).toBe('message2');
    });

    test('getRecentLogs returns all logs when count exceeds', () => {
        utilsLogging.log('info', 'message1');
        const logs = utilsLogging.getRecentLogs(100);
        expect(logs.length).toBeGreaterThan(0);
    });

    test('getErrors returns only error logs', () => {
        global.Memory.logs = [];
        utilsLogging.log('error', 'error message');
        utilsLogging.log('info', 'info message');
        const errors = utilsLogging.getErrors();
        expect(errors.length).toBe(1);
        expect(errors[0].level).toBe('error');
    });

    test('clear removes all logs', () => {
        utilsLogging.log('info', 'message');
        utilsLogging.clear();
        expect(Memory.logs.length).toBe(0);
    });

    test('getStats returns correct statistics', () => {
        global.Memory.logs = [];
        utilsLogging.log('error', 'error1');
        utilsLogging.log('warn', 'warn1');
        utilsLogging.log('info', 'info1');
        utilsLogging.log('debug', 'debug1');
        const stats = utilsLogging.getStats();
        expect(stats.total).toBe(4);
        expect(stats.errors).toBe(1);
        expect(stats.warns).toBe(1);
        expect(stats.info).toBe(1);
        expect(stats.debugs).toBe(1);
    });

    test('getStats returns empty object when no logs', () => {
        global.Memory.logs = undefined;
        const stats = utilsLogging.getStats();
        expect(stats).toEqual({debugs: 0, errors: 0, info: 0, total: 0, traces: 0, warns: 0});
    });

    test('debug function exists and can be called', () => {
        if (typeof utilsLogging.debug === 'function') {
            utilsLogging.debug('debug message');
            expect(Memory.logs[Memory.logs.length - 1].level).toBe('debug');
        }
    });

    test('init function limits logs to 100', () => {
        global.Memory.logs = [];
        for (let i = 0; i < 150; i++) {
            utilsLogging.log('info', 'message' + i);
        }
        utilsLogging.init();
        expect(Memory.logs.length).toBeLessThanOrEqual(100);
    });

    test('log function prevents infinite recursion when both arguments are levels', () => {
        // This used to cause infinite recursion: log('info', 'warn') -> log('warn', 'info') -> log('info', 'warn')...
        // Now it should just treat them as (message, level) without swapping.
        expect(() => utilsLogging.log('info', 'warn')).not.toThrow();
        const lastLog = Memory.logs[Memory.logs.length - 1];
        expect(lastLog.level).toBe('info');
        expect(lastLog.message).toBe('warn');
    });

    test('log function still supports (message, level) signature when appropriate', () => {
        utilsLogging.log('test message', 'error');
        const lastLog = Memory.logs[Memory.logs.length - 1];
        expect(lastLog.level).toBe('error');
        expect(lastLog.message).toBe('test message');
    });

    describe('_redactPaths', () => {
        test('returns non-string input as is', () => {
            expect(utilsLogging._redactPaths(null)).toBeNull();
            expect(utilsLogging._redactPaths(undefined)).toBeUndefined();
            expect(utilsLogging._redactPaths(123)).toBe(123);
            const obj = { key: 'value' };
            expect(utilsLogging._redactPaths(obj)).toBe(obj);
        });

        test('returns string without paths or secrets as is', () => {
            const normalStr = 'This is a normal message.';
            expect(utilsLogging._redactPaths(normalStr)).toBe(normalStr);
        });

        test('redacts Unix style absolute paths', () => {
            const str1 = 'Error in /var/log/app.log occurred';
            expect(utilsLogging._redactPaths(str1)).toBe('Error in [REDACTED] occurred');
            const str2 = '/usr/local/bin/node failed';
            expect(utilsLogging._redactPaths(str2)).toBe('[REDACTED] failed');
        });

        test('redacts Windows style absolute paths', () => {
            const str1 = 'C:\\Users\\Admin\\config.json not found';
            expect(utilsLogging._redactPaths(str1)).toBe('[REDACTED] not found');
            const str2 = 'Error: D:\\Project\\src\\main.js';
            expect(utilsLogging._redactPaths(str2)).toBe('Error: [REDACTED]');
        });

        test('redacts secrets (token, password, etc.)', () => {
            const str1 = 'token: dummy_token_123';
            expect(utilsLogging._redactPaths(str1)).toBe('token: [REDACTED]');
            const str2 = 'PASSWORD = "super_secret_password"';
            expect(utilsLogging._redactPaths(str2)).toBe('PASSWORD = "[REDACTED]"');
            const str3 = 'apiKey  12345-67890';
            expect(utilsLogging._redactPaths(str3)).toBe('apiKey  [REDACTED]');
            const str4 = '{"secret": "my-secret-key"}';
            expect(utilsLogging._redactPaths(str4)).toBe('{"secret": "[REDACTED]"}');
            const str5 = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.x';
            expect(utilsLogging._redactPaths(str5)).toBe('Bearer [REDACTED]');
        });

        test('redacts strings with multiple paths and secrets', () => {
            const mixedStr = 'Saved settings to /home/user/.config password: 12345, token=abcd';
            const expectedStr = 'Saved settings to [REDACTED] password: [REDACTED] token=[REDACTED]';
            expect(utilsLogging._redactPaths(mixedStr)).toBe(expectedStr);
        });
    });
});
