/**
 * tests/sentinel_dos_cache.test.js
 * Reproduces a DoS vulnerability in utils.memory.js
 */

global.Game = { time: 100 };
global.Memory = { cache: {} };

const utilsMemory = require('../utils.memory');

describe('utils.memory DoS reproduction', () => {
    beforeEach(() => {
        global.Memory = { cache: {} };
    });

    test('cleanCache should NOT throw if an entry is null and should remove it', () => {
        // Corrupt memory with a null entry
        global.Memory.cache = {
            corrupted_entry: null,
        };

        // This should now run successfully
        expect(() => utilsMemory.cleanCache()).not.toThrow();
        expect(global.Memory.cache['corrupted_entry']).toBeUndefined();
    });

    test('cleanCache should remove entries with invalid timestamp', () => {
        // Corrupt memory with an entry having invalid timestamp
        global.Memory.cache = {
            invalid_timestamp: { value: 'test', timestamp: 'invalid' },
        };

        utilsMemory.cleanCache();
        expect(global.Memory.cache['invalid_timestamp']).toBeUndefined();
    });
});

const utilsLogging = require('../utils.logging');

describe('utils.logging DoS hardening', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
    });

    test('getStats should NOT throw if logs contain null', () => {
        global.Memory.logs = [
            { level: 'error', message: 'test' },
            null,
            { level: 'info', message: 'test' },
        ];

        let stats;
        expect(() => {
            stats = utilsLogging.getStats();
        }).not.toThrow();
        expect(stats.errors).toBe(1);
        expect(stats.info).toBe(1);
    });

    test('getStats should handle logs with missing level', () => {
        global.Memory.logs = [{ message: 'no level' }];

        let stats;
        expect(() => {
            stats = utilsLogging.getStats();
        }).not.toThrow();
        expect(stats.total).toBe(1);
        expect(stats.errors).toBe(0);
    });
});
