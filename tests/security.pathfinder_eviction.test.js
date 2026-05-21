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
jest.mock(
    '../src/constants',
    () => ({
        PATHFINDER_DEFAULTS: { ROAD_COST: 1 },
        CACHE_TTL: { PATH: 50 },
    }),
    { virtual: true }
);

jest.mock(
    '../src/utils/cache',
    () => ({
        getStructures: jest.fn().mockReturnValue([]),
        getConstructionSites: jest.fn().mockReturnValue([]),
        cleanup: jest.fn(),
    }),
    { virtual: true }
);

let cacheUtils;
let pathfinder;

describe('Security: Pathfinder FIFO Eviction', () => {
    beforeEach(() => {
        jest.resetModules();
        cacheUtils = require('../src/utils/cache');
        pathfinder = require('../src/utils/pathfinder');
        global.cache = {};
        jest.clearAllMocks();
        global.Game.time = 100;
        global.Game.rooms = {};
    });

    describe('buildCostMatrix eviction', () => {
        test('should evict oldest entry when cache is full', () => {
            // Fill cache to 100 entries
            for (let i = 0; i < 100; i++) {
                global.cache[`key_${i}`] = { data: 'old_data_' + i, expires: 200 };
            }

            const roomName = 'W1N1';
            global.Game.rooms[roomName] = { find: jest.fn().mockReturnValue([]) };

            pathfinder.buildCostMatrix(roomName);

            // Oldest key should be deleted
            expect(global.cache.key_0).toBeUndefined();
            // New entry should be added
            expect(global.cache[`cm_${roomName}_0`]).toBeDefined();
            // Total size should still be 100
            expect(Object.keys(global.cache).length).toBe(100);
        });

        test('should cleanup expired entries before FIFO eviction', () => {
            // Fill cache with 99 active and 1 expired entry
            for (let i = 0; i < 99; i++) {
                global.cache[`key_${i}`] = { data: 'active', expires: 200 };
            }
            global.cache.expired_key = { data: 'expired', expires: 50 }; // Game.time is 100

            // Mock cleanup to actually remove the expired entry
            cacheUtils.cleanup.mockImplementation(() => {
                delete global.cache.expired_key;
                return 1;
            });

            const roomName = 'W2N2';
            global.Game.rooms[roomName] = { find: jest.fn().mockReturnValue([]) };

            pathfinder.buildCostMatrix(roomName);

            // cleanup() should have been called
            expect(cacheUtils.cleanup).toHaveBeenCalled();
            // Expired key should be gone
            expect(global.cache.expired_key).toBeUndefined();
            // NO FIFO eviction should have happened because cleanup freed space
            expect(global.cache.key_0).toBeDefined();
            // New entry should be added
            expect(global.cache[`cm_${roomName}_0`]).toBeDefined();
            expect(Object.keys(global.cache).length).toBe(100);
        });
    });

    describe('estimateDistance eviction', () => {
        test('should evict oldest entry when cache is full', () => {
            // Fill cache to 100 entries
            for (let i = 0; i < 100; i++) {
                global.cache[`key_${i}`] = { data: 10, expires: 200 };
            }

            const origin = { x: 1, y: 1, roomName: 'W3N3' };
            const goal = { x: 10, y: 10, roomName: 'W3N3' };
            const expectedKey = 'path_W3N3_1_1_W3N3_10_10';

            pathfinder.estimateDistance(origin, goal);

            // Oldest key should be deleted
            expect(global.cache.key_0).toBeUndefined();
            // New entry should be added
            expect(global.cache[expectedKey]).toBeDefined();
            expect(Object.keys(global.cache).length).toBe(100);
        });
    });

    describe('Robust Type Checking', () => {
        test('should ignore entries with non-numeric expires', () => {
            const roomName = 'W4N4';
            const cacheKey = `cm_${roomName}_0`;
            global.cache[cacheKey] = { data: 'corrupted', expires: 'forever' };

            global.Game.rooms[roomName] = { find: jest.fn().mockReturnValue([]) };

            const result = pathfinder.buildCostMatrix(roomName);

            // Should have ignored the corrupted entry and returned a new CostMatrix
            expect(result).toBeInstanceOf(MockCostMatrix);
            expect(result).not.toBe('corrupted');
        });
    });
});
