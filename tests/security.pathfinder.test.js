/**
 * tests/security.pathfinder.test.js
 * Security tests for src/utils/pathfinder.js
 */

global.TERRAIN_MASK_WALL = 1;
global.OK = 0;
global.FIND_STRUCTURES = 1;
global.FIND_MY_CONSTRUCTION_SITES = 2;
global.FIND_CONSTRUCTION_SITES = 111;
global.FIND_CREEPS = 3;
global.STRUCTURE_ROAD = 'road';
global.STRUCTURE_WALL = 'wall';
global.STRUCTURE_RAMPART = 'rampart';
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_LINK = 'link';

class MockCostMatrix {
    constructor() {
        this.data = new Map();
    }

    set(x, y, val) {
        this.data.set(`${x},${y}`, val);
    }

    get(x, y) {
        return this.data.get(`${x},${y}`) || 0;
    }
}

jest.mock(
    '../src/constants',
    () => ({
        PATHFINDER_DEFAULTS: {
            REUSE_PATH: 10,
            PLAIN_COST: 2,
            SWAMP_COST: 10,
            ROAD_COST: 1,
            MAX_ROOMS: 2,
        },
        CACHE_TTL: { PATH: 5 },
    }),
    { virtual: true }
);

global.PathFinder = {
    search: jest.fn().mockReturnValue({ incomplete: false, path: [{ x: 1, y: 1 }] }),
    CostMatrix: MockCostMatrix,
};

const cacheUtils = require('../src/utils/cache');
const pathfinder = require('../src/utils/pathfinder');

describe('Security: Pathfinder Hardening', () => {
    beforeEach(() => {
        global.cache = {};
        jest.clearAllMocks();
        global.Game = {
            time: 1,
            rooms: {},
        };
    });

    describe('Prototype Pollution Protection', () => {
        test('isSafeKey should identify dangerous keys', () => {
            expect(pathfinder.isSafeKey('validKey')).toBe(true);
            expect(pathfinder.isSafeKey('__proto__')).toBe(false);
            expect(pathfinder.isSafeKey('constructor')).toBe(false);
            expect(pathfinder.isSafeKey('prototype')).toBe(false);
            expect(pathfinder.isSafeKey('toString')).toBe(false);
        });

        test('buildCostMatrix should bypass cache for unsafe room names', () => {
            const roomName = '__proto__';
            // Even if the room exists, the cache key will be unsafe
            const room = {
                find: jest.fn().mockReturnValue([]),
            };
            Game.rooms[roomName] = room;

            pathfinder.buildCostMatrix(roomName);

            // Ensure __proto__ wasn't set on global.cache
            expect(Object.prototype.hasOwnProperty.call(global.cache, `cm_${roomName}_0`)).toBe(
                false
            );
        });

        test('estimateDistance should bypass cache for unsafe room names', () => {
            const origin = { x: 1, y: 1, roomName: '__proto__' };
            const goal = { x: 5, y: 5, roomName: 'W0N0' };

            pathfinder.estimateDistance(origin, goal);

            // The key would contain __proto__
            const key = `path_${origin.roomName}_${origin.x}_${origin.y}_${goal.roomName}_${goal.x}_${goal.y}`;
            expect(Object.prototype.hasOwnProperty.call(global.cache, key)).toBe(false);
        });
    });

    describe('Memory DoS Protection', () => {
        test('isSafeKey should reject excessively long keys', () => {
            const longKey = 'a'.repeat(257);
            expect(pathfinder.isSafeKey(longKey)).toBe(false);
        });

        test('buildCostMatrix should implement FIFO eviction when full', () => {
            // Fill cache to limit (100) using cacheUtils.get to keep internal state consistent
            for (let i = 0; i < 100; i++) {
                cacheUtils.get(`key${i}`, () => ({}));
            }
            expect(Object.keys(global.cache).length).toBe(100);

            const roomName = 'NewRoom';
            Game.rooms[roomName] = { find: jest.fn().mockReturnValue([]) };

            pathfinder.buildCostMatrix(roomName);

            // Cache size should still be 100
            expect(Object.keys(global.cache).length).toBe(100);
            // Oldest key should be gone
            expect(global.cache['key0']).toBeUndefined();
            // New key should be present
            expect(global.cache[`cm_${roomName}_0`]).toBeDefined();
        });

        test('estimateDistance should implement FIFO eviction when full', () => {
            // Fill cache to limit (100) using cacheUtils.get to keep internal state consistent
            for (let i = 0; i < 100; i++) {
                cacheUtils.get(`key${i}`, () => ({}));
            }
            expect(Object.keys(global.cache).length).toBe(100);

            const origin = { x: 1, y: 1, roomName: 'W1N1' };
            const goal = { x: 5, y: 5, roomName: 'W1N1' };
            const key = `path_${origin.roomName}_${origin.x}_${origin.y}_${goal.roomName}_${goal.x}_${goal.y}`;

            pathfinder.estimateDistance(origin, goal);

            // Cache size should still be 100
            expect(Object.keys(global.cache).length).toBe(100);
            // Oldest key should be gone
            expect(global.cache['key0']).toBeUndefined();
            // New key should be present
            expect(global.cache[key]).toBeDefined();
        });
    });

    describe('Safe Object Access', () => {
        test('buildCostMatrix should use hasOwnProperty to avoid prototype hits', () => {
            // Pollute the prototype of global.cache's prototype (Object.prototype)
            Object.prototype.cm_FakeRoom_0 = { data: 'poison', expires: 999 };

            const roomName = 'FakeRoom';
            const room = { find: jest.fn().mockReturnValue([]) };
            Game.rooms[roomName] = room;

            const result = pathfinder.buildCostMatrix(roomName);

            // It should NOT return the 'poison' data from prototype
            expect(result).not.toBe('poison');
            expect(result).toBeInstanceOf(MockCostMatrix);

            delete Object.prototype.cm_FakeRoom_0;
        });
    });
});
