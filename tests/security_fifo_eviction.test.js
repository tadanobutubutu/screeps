const cache = require('../src/utils/cache');

describe('Security: Cache FIFO Eviction', () => {
    beforeEach(() => {
        global.cache = {};
        global.Game = { time: 100 };
        global.FIND_SOURCES = 105;
        global.FIND_STRUCTURES = 107;
        global.FIND_MY_STRUCTURES = 108;
        global.FIND_MY_CREEPS = 102;
        global.FIND_CONSTRUCTION_SITES = 111;
        global.FIND_HOSTILE_CREEPS = 103;
        global.FIND_DROPPED_RESOURCES = 106;
        global.FIND_MY_SPAWNS = 112;
    });

    test('should evict the oldest entry when MAX_CACHE_ENTRIES is exceeded', () => {
        const MAX_ENTRIES = 100;

        // Fill cache to its limit
        for (let i = 0; i < MAX_ENTRIES; i++) {
            cache.get(`key_${i}`, () => `data_${i}`, 100);
        }

        expect(Object.keys(global.cache).length).toBe(MAX_ENTRIES);
        expect(global.cache.key_0).toBeDefined();

        // Add one more entry
        cache.get('new_key', () => 'new_data', 100);

        // The total count should still be MAX_ENTRIES
        expect(Object.keys(global.cache).length).toBe(MAX_ENTRIES);

        // key_0 should have been evicted (oldest)
        expect(global.cache.key_0).toBeUndefined();

        // new_key should be present
        expect(global.cache.new_key).toBeDefined();
        expect(global.cache.new_key.data).toBe('new_data');
    });

    test('should attempt cleanup before FIFO eviction', () => {
        const MAX_ENTRIES = 100;

        // Fill cache with entries, make key_0 expired
        cache.get('key_0', () => 'data_0', 10); // expires at 110
        global.Game.time = 120; // key_0 is now expired

        for (let i = 1; i < MAX_ENTRIES; i++) {
            cache.get(`key_${i}`, () => `data_${i}`, 100);
        }

        expect(Object.keys(global.cache).length).toBe(MAX_ENTRIES);

        // Add one more entry. Cleanup should remove key_0 first.
        cache.get('new_key', () => 'new_data', 100);

        expect(Object.keys(global.cache).length).toBe(MAX_ENTRIES);
        expect(global.cache.key_0).toBeUndefined();

        // key_1 should still be there because key_0 was removed by cleanup
        expect(global.cache.key_1).toBeDefined();
        expect(global.cache.new_key).toBeDefined();
    });
});
