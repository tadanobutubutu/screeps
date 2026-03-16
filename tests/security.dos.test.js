/**
 * Security DoS Protection Tests
 */

const memVis = require('../memory.visualizer');
const logger = require('../utils.logging');
const adaptive = require('../system.adaptive');

describe('Security: DoS Protections', () => {
    beforeEach(() => {
        global.Game = {
            time: 100,
            gcl: { level: 1 },
            cpu: { getUsed: () => 1.0, bucket: 10000 },
            rooms: {},
            creeps: {},
            flags: {},
            spawns: {}
        };
        global.Memory = {
            creeps: {},
            rooms: {},
            flags: {},
            spawns: {}
        };
        // Mock console.log to avoid cluttering test output
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Memory Visualizer: Backup Recursion Protection', () => {
        test('backup() should not include the backups array in its snapshot', () => {
            // Initial backup
            memVis.backup();
            expect(Memory.backups).toBeDefined();
            expect(Memory.backups.length).toBe(1);

            // The data in the first backup should NOT contain a 'backups' key
            expect(Memory.backups[0].data.backups).toBeUndefined();

            // Create another backup - if recursive, this would include the first backup
            memVis.backup();
            expect(Memory.backups.length).toBe(2);

            // The data in the second backup should also NOT contain a 'backups' key
            expect(Memory.backups[1].data.backups).toBeUndefined();

            // Verify it didn't strip other important keys
            expect(Memory.backups[1].data.creeps).toBeDefined();
        });
    });

    describe('Logging System: Mid-tick DoS Protection', () => {
        test('log() should rotate logs immediately when exceeding 100 entries', () => {
            // Fill logs to 100
            for (let i = 0; i < 100; i++) {
                logger.info(`Log ${i}`);
            }
            expect(Memory.logs.length).toBe(100);
            expect(Memory.logs[0].message).toBe('Log 0');

            // Add one more log - should trigger rotation immediately
            logger.info('Log 101');
            expect(Memory.logs.length).toBe(100);
            expect(Memory.logs[0].message).toBe('Log 1');
            expect(Memory.logs[99].message).toBe('Log 101');
        });
    });

    describe('Adaptive System: Emergency Cleanup', () => {
        test('emergencyCleanup() should correctly clear backups', () => {
            Memory.backups = [{ data: {}, time: 100 }];
            Memory.evolution = { history: [] };
            Memory.diary = { entries: [] };

            adaptive.emergencyCleanup();

            expect(Memory.backups).toBeUndefined();
            expect(Memory.evolution).toBeUndefined();
            expect(Memory.diary).toBeUndefined();
        });
    });
});
