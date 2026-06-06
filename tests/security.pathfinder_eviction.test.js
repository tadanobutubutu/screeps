/**
 * tests/security.pathfinder_eviction.test.js
 * Specific tests for FIFO eviction logic in src/utils/pathfinder.js
 */

global.Game = { time: 100 };
global.FIND_STRUCTURES = 1;
global.FIND_CONSTRUCTION_SITES = 111;
global.FIND_CREEPS = 3;
global.STRUCTURE_ROAD = 'road';

class MockCostMatrix {
    set() {}
    get() {}
}

global.PathFinder = {
    CostMatrix: MockCostMatrix,
    search: jest.fn().mockReturnValue({ incomplete: false, path: [] }),
};

// Mock dependencies
jest.mock('../src/constants', () => ({
    PATHFINDER_DEFAULTS: { ROAD_COST: 1 },
    CACHE_TTL: { PATH: 50 },
}));

let cacheUtils;
let pathfinder;

describe('Security: Pathfinder FIFO Eviction', () => {
    beforeEach(() => {
        jest.resetModules();

        // Require inside beforeEach after resetModules to guarantee same module instance
        cacheUtils = require('../src/utils/cache');
        pathfinder = require('../src/utils/pathfinder');

        cacheUtils.reset();

        // Dynamic spies on cacheUtils to intercept calls safely
        jest.spyOn(cacheUtils, 'getStructures').mockReturnValue([]);
        jest.spyOn(cacheUtils, 'getConstructionSites').mockReturnValue([]);

        global.cache = {};
        jest.clearAllMocks();
        global.Game.time = 100;
        global.Game.rooms = {};
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('buildCostMatrix eviction', () => {
        test('should evict oldest entry when cache is full', () => {
            // Fill cache to 100 entries using cacheUtils.get to ensure state consistency
            for (let i = 0; i < 100; i++) {
                cacheUtils.get(`key${i}`, () => 'old_data_' + i, 100);
            }
            expect(Object.keys(global.cache).length).toBe(100);

            const roomName = 'W1N1';
            global.Game.rooms[roomName] = { find: jest.fn().mockReturnValue([]) };

            pathfinder.buildCostMatrix(roomName);

            // Oldest key should be deleted
            expect(global.cache.key0).toBeUndefined();
            // New entry should be added
            expect(global.cache[`cm_${roomName}_0`]).toBeDefined();
        });

        test('should remove expired entries during buildCostMatrix', () => {
            // Fill cache with 99 active and 1 expired entry
            for (let i = 1; i < 100; i++) {
                cacheUtils.get(`key${i}`, () => 'active', 100);
            }
            // Add an expired entry
            cacheUtils.get('expired_key', () => 'expired', 10);

            global.Game.time = 111; // Expire the key

            const roomName = 'W2N2';
            global.Game.rooms[roomName] = { find: jest.fn().mockReturnValue([]) };

            pathfinder.buildCostMatrix(roomName);

            // Expired key should be gone
            expect(global.cache.expired_key).toBeUndefined();
            // New entry should be added
            expect(global.cache[`cm_${roomName}_0`]).toBeDefined();
        });
    });

    describe('estimateDistance eviction', () => {
        test('should evict oldest entry when cache is full', () => {
            // Fill cache to 100 entries
            for (let i = 0; i < 100; i++) {
                cacheUtils.get(`key${i}`, () => 10, 100);
            }
            expect(Object.keys(global.cache).length).toBe(100);

            const origin = { x: 1, y: 1, roomName: 'W3N3' };
            const goal = { x: 10, y: 10, roomName: 'W3N3' };
            const expectedKey = 'path_W3N3_1_1_W3N3_10_10';

            pathfinder.estimateDistance(origin, goal);

            // Oldest key should be deleted
            expect(global.cache.key0).toBeUndefined();
            // New entry should be added
            expect(global.cache[expectedKey]).toBeDefined();
        });
    });

    describe('Robust Type Checking', () => {
        test('should ignore entries with non-numeric expires', () => {
            const roomName = 'W4N4';
            const cacheKey = `cm_${roomName}_0`;

            // Manually inject corrupted entry
            global.cache[cacheKey] = { data: 'corrupted', expires: 'forever' };

            global.Game.rooms[roomName] = { find: jest.fn().mockReturnValue([]) };

            const result = pathfinder.buildCostMatrix(roomName);

            // Should have ignored the corrupted entry and returned a new CostMatrix
            expect(result).toBeInstanceOf(MockCostMatrix);
            expect(result).not.toBe('corrupted');
        });
    });
});
