/**
 * src/utils/pathfinder.js のユニットテスト
 */

global.cache = {};
global.Game = { time: 1, rooms: {} };
global.Memory = {};
global.FIND_STRUCTURES = 5;
global.FIND_MY_CONSTRUCTION_SITES = 6;
global.FIND_CONSTRUCTION_SITES = 111;
global.FIND_CREEPS = 7;
global.STRUCTURE_ROAD = 'road';
global.STRUCTURE_WALL = 'wall';
global.STRUCTURE_RAMPART = 'rampart';
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_LINK = 'link';
global.TERRAIN_MASK_WALL = 1;
global.RoomPosition = function (x, y, roomName) {
    this.x = x;
    this.y = y;
    this.roomName = roomName;
    this.getRangeTo = function (target) {
        const tx = target.x ?? target.pos?.x ?? 0;
        const ty = target.y ?? target.pos?.y ?? 0;
        return Math.max(Math.abs(tx - x), Math.abs(ty - y));
    };
};

class MockCostMatrix {
    constructor() {
        this.map = new Map();
    }

    set(x, y, value) {
        this.map.set(`${x},${y}`, value);
    }

    get(x, y) {
        return this.map.get(`${x},${y}`);
    }
}

const searchMock = jest.fn().mockReturnValue({ path: [{}, {}], incomplete: false });
global.PathFinder = {
    CostMatrix: MockCostMatrix,
    search: searchMock,
};

jest.mock(
    '../src/constants',
    () => ({
        PATHFINDER_DEFAULTS: {
            ROAD_COST: 1,
            MAX_ROOMS: 2,
            PLAIN_COST: 2,
            SWAMP_COST: 10,
            REUSE_PATH: 5,
            MAX_SEARCH_RANGE: 10,
        },
        CACHE_TTL: { PATH: 3 },
    }),
    { virtual: true }
);

const pathfinder = require('../src/utils/pathfinder');

describe('src/utils/pathfinder', () => {
    beforeEach(() => {
        global.cache = {};
        global.Game.time = 1;
        searchMock.mockClear();
        global.Game.rooms = {};
    });

    test('コストマトリクスを生成しキャッシュする', () => {
        const room = {
            find: jest
                .fn()
                .mockReturnValueOnce([
                    { structureType: global.STRUCTURE_ROAD, pos: { x: 1, y: 1 } },
                    { structureType: global.STRUCTURE_WALL, pos: { x: 2, y: 2 } },
                    {
                        structureType: global.STRUCTURE_RAMPART,
                        pos: { x: 3, y: 3 },
                        my: false,
                        isPublic: false,
                    },
                ])
                .mockReturnValueOnce([]) // construction sites
                .mockReturnValueOnce([{ pos: { x: 5, y: 5 } }]), // creeps
        };
        global.Game.rooms.W0N0 = room;

        const costs = pathfinder.buildCostMatrix('W0N0', { avoidCreeps: true });

        expect(costs.get(1, 1)).toBe(1);
        expect(costs.get(2, 2)).toBe(255);
        expect(costs.get(3, 3)).toBe(255);

        // キャッシュ利用でroom.findが再度呼ばれない
        pathfinder.buildCostMatrix('W0N0', { avoidCreeps: true });
        expect(room.find).toHaveBeenCalledTimes(3);
    });

    test('findPathがPathFinder.searchを呼び出す', () => {
        const origin = { x: 0, y: 0, roomName: 'W0N0' };
        const goal = { pos: { x: 5, y: 5 }, range: 1 };
        global.Game.rooms.W0N0 = { find: jest.fn().mockReturnValue([]) };

        const result = pathfinder.findPath(origin, goal, { avoidCreeps: false });

        expect(searchMock).toHaveBeenCalled();
        expect(result.path.length).toBe(2);
    });

    test('moveToがcreep.moveToをラップする', () => {
        global.Game.rooms.W0N0 = { find: jest.fn().mockReturnValue([]) };
        const creep = {
            moveTo: jest.fn().mockReturnValue(global.OK),
            pos: { roomName: 'W0N0' },
        };
        const target = { pos: { x: 1, y: 1 } };

        const result = pathfinder.moveTo(creep, target, { visualizePath: true });

        expect(result).toBe(global.OK);
        expect(creep.moveTo).toHaveBeenCalled();
    });

    test('最寄りの空きタイルを返す', () => {
        const room = {
            getTerrain: jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue(0) }),
            lookAtArea: jest.fn().mockReturnValue([{ x: 24, y: 24, type: 'terrain' }]),
        };
        global.Game.rooms.W1N1 = room;
        const pos = { x: 25, y: 25, roomName: 'W1N1' };

        const result = pathfinder.findNearestOpenTile(pos, 1);

        expect(result).not.toBeNull();
        expect(result.roomName).toBe('W1N1');
    });

    test('estimateDistanceはキャッシュを利用する', () => {
        const origin = { x: 1, y: 1, roomName: 'W0N0' };
        const goal = { x: 2, y: 2, roomName: 'W0N0' };
        global.Game.rooms.W0N0 = { find: jest.fn().mockReturnValue([]) };

        const first = pathfinder.estimateDistance(origin, goal);
        global.Game.time += 1;
        const second = pathfinder.estimateDistance(origin, goal);

        expect(first).toBe(second);
        expect(searchMock).toHaveBeenCalledTimes(1);
    });

    test('getRoadPositions retrieves road positions with single-pass loop', () => {
        const roadPos1 = { x: 10, y: 10 };
        const roadPos2 = { x: 11, y: 11 };
        const room = {
            find: jest.fn().mockReturnValue([
                { structureType: global.STRUCTURE_WALL, pos: { x: 5, y: 5 } },
                { structureType: global.STRUCTURE_ROAD, pos: roadPos1 },
                { structureType: global.STRUCTURE_CONTAINER, pos: { x: 8, y: 8 } },
                { structureType: global.STRUCTURE_ROAD, pos: roadPos2 },
            ]),
            name: 'W0N1',
        };

        const roadPositions = pathfinder.getRoadPositions(room);

        expect(roadPositions).toHaveLength(2);
        expect(roadPositions).toEqual([roadPos1, roadPos2]);
    });
});
