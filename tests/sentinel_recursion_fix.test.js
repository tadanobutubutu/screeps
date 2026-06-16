const logger = require('../utils.logging');

describe('Sentinel: Infinite Recursion Fix', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
        global.Game = { time: 12345 };
    });

    test('logger.log should not cause stack overflow when level and message are both valid levels', () => {
        // This would previously cause "Maximum call stack size exceeded"
        expect(() => {
            logger.log('info', 'warn');
        }).not.toThrow();

        expect(Memory.logs.length).toBe(1);
        expect(Memory.logs[0].level).toBe('warn');
        expect(Memory.logs[0].message).toBe('info');
    });

    test('logger.log should still support swapped arguments for legacy reasons', () => {
        // level: 'info', message: 'Something happened'
        logger.log('Something happened', 'info');
        expect(Memory.logs[0].level).toBe('info');
        expect(Memory.logs[0].message).toBe('Something happened');

        // Swap test
        Memory.logs = [];
        logger.log('info', 'Something happened');
        expect(Memory.logs[0].level).toBe('info');
        expect(Memory.logs[0].message).toBe('Something happened');
    });
});
