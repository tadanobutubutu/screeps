const logger = require('../utils.logging');

describe('Sentinel: Logging Security Hardening', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
        global.Game = { time: 100 };
        // Mock console.log
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getSafeStack should truncate very long stacks', () => {
        const longStack = 'a'.repeat(3000);
        const safeStack = logger.getSafeStack(longStack);
        // Should be at most 2000 chars
        expect(safeStack.length).toBeLessThanOrEqual(2000);
    });

    test('log should handle corrupted Memory.logs', () => {
        global.Memory.logs = { not: 'an array' };
        logger.info('test message');
        expect(Array.isArray(global.Memory.logs)).toBe(true);
        expect(global.Memory.logs.length).toBe(1);
    });

    test('log should use safe emoji lookup and prevent prototype pollution', () => {
        // Attempt prototype pollution
        const maliciousLevel = 'toString';
        logger.log('test message', maliciousLevel);

        const lastLog = Memory.logs[Memory.logs.length - 1];
        expect(lastLog.level).toBe('info');
        expect(lastLog.message).toBe('test message');
    });

    test('log should work correctly with standard levels', () => {
        logger.error('error message');
        const errorLog = Memory.logs[Memory.logs.length - 1];
        expect(errorLog.level).toBe('error');
        expect(errorLog.message).toBe('error message');

        logger.warn('warn message');
        const warnLog = Memory.logs[Memory.logs.length - 1];
        expect(warnLog.level).toBe('warn');
        expect(warnLog.message).toBe('warn message');
    });
});
