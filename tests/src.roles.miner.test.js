/**
 * src/roles/miner.js のユニットテスト
 */

jest.mock(
    '../src/utils/cache',
    () => ({
        getSources: jest.fn().mockReturnValue([]),
        getMyCreeps: jest.fn().mockReturnValue([]),
        getContainers: jest.fn().mockReturnValue([]),
        isSafeKey: jest.fn().mockReturnValue(true),
        getStructures: jest.fn().mockReturnValue([]),
        getStructuresNeedingEnergy: jest.fn().mockReturnValue([]),
        getConstructionSites: jest.fn().mockReturnValue([]),
        getDroppedResources: jest.fn().mockReturnValue([]),
        getStorage: jest.fn().mockReturnValue(null),
        getSpawns: jest.fn().mockReturnValue([]),
        getEnemies: jest.fn().mockReturnValue([]),
        getLinks: jest.fn().mockReturnValue([]),
        getMyStructures: jest.fn().mockReturnValue([]),
        assignSource: jest.fn().mockReturnValue(null),
        invalidate: jest.fn(),
    }),
    { virtual: true }
);

jest.mock(
    '../src/utils/pathfinder',
    () => ({
        moveTo: jest.fn(),
        closest: jest.fn((_, list) => (list && list.length > 0 ? list[0] : null)),
    }),
    { virtual: true }
);

jest.mock(
    '../src/utils/logger',
    () => ({
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }),
    { virtual: true }
);

jest.mock(
    '../src/constants',
    () => ({
        CACHE_TTL: { SOURCES: 10, PATH: 5, STRUCTURES: 10, ROOM_OBJECTS: 10 },
        PATHFINDER_DEFAULTS: {
            REUSE_PATH: 10,
            MAX_ROOMS: 1,
            PLAIN_COST: 2,
            SWAMP_COST: 10,
            ROAD_COST: 1,
        },
        MEMORY_KEYS: { SOURCE_ID: 'sourceId', WORKING: 'working', TARGET_ID: 'targetId' },
        LOG_LEVEL: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 },
        ROOM_BOUNDS: { MIN: 0, MAX: 49 },
    }),
    { virtual: true }
);

// Globals setup
global.Game = { creeps: {}, getObjectById: jest.fn(), time: 1 };
global.Memory = {};
global.WORK = 'work';
global.CARRY = 'carry';
global.MOVE = 'move';
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.ERR_NOT_ENOUGH_ENERGY = -6;
global.FIND_SOURCES = 105;
global.FIND_MY_CREEPS = 102;
global.FIND_STRUCTURES = 1;
global.STRUCTURE_CONTAINER = 'container';
global.TERRAIN_MASK_WALL = 1;

global.RoomPosition = function (x, y, roomName) {
    this.x = x;
    this.y = y;
    this.roomName = roomName;
    this.isEqualTo = jest.fn().mockImplementation((pos) => this.x === pos.x && this.y === pos.y);
    this.getRangeTo = jest.fn().mockReturnValue(1);
};

const cache = require('../src/utils/cache');
const pathfinder = require('../src/utils/pathfinder');
const logger = require('../src/utils/logger');
const miner = require('../src/roles/miner');

describe('src/roles/miner', () => {
    let roomMock;

    beforeEach(() => {
        jest.clearAllMocks();
        roomMock = {
            name: 'W0N0',
            find: jest.fn().mockReturnValue([]),
            getTerrain: jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue(0) }),
            visual: { circle: jest.fn() },
        };
    });

    test('コンテナがある場合に移動して採掘する', () => {
        const source = {
            id: 's1',
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
        };
        const container = {
            structureType: global.STRUCTURE_CONTAINER,
            pos: new RoomPosition(5, 5, 'W0N0'),
            hits: 50,
            hitsMax: 100,
        };
        cache.getContainers.mockReturnValue([container]);
        global.Game.getObjectById.mockReturnValue(source);

        const creep = {
            name: 'miner1',
            memory: { sourceId: 's1' },
            room: roomMock,
            pos: new RoomPosition(0, 0, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            repair: jest.fn(),
            say: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            moveTo: jest.fn().mockReturnValue(global.OK),
        };
        cache.getSources.mockReturnValue([source]);

        miner.run(creep);

        expect(pathfinder.moveTo).toHaveBeenCalled();
    });

    test('コンテナなしで採掘し満タンでドロップする', () => {
        const source = {
            id: 's2',
            room: roomMock,
            pos: new RoomPosition(10, 10, 'W0N0'),
            ticksToRegeneration: 5,
        };
        cache.getContainers.mockReturnValue([]);
        global.Game.getObjectById.mockReturnValue(source);

        const creep = {
            name: 'miner2',
            memory: { sourceId: 's2' },
            room: roomMock,
            pos: new RoomPosition(10, 10, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.OK),
            drop: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(0) },
            say: jest.fn(),
            moveTo: jest.fn().mockReturnValue(global.OK),
        };
        cache.getSources.mockReturnValue([source]);

        miner.run(creep);

        expect(creep.drop).toHaveBeenCalledWith(global.RESOURCE_ENERGY);
    });

    test('ソース割り当て状況を集計する', () => {
        cache.getSources.mockReturnValue([
            { id: 'a', room: roomMock },
            { id: 'b', room: roomMock },
        ]);
        cache.getMyCreeps.mockReturnValue([
            { memory: { role: 'miner', sourceId: 'a' }, room: roomMock },
            { memory: { role: 'miner', sourceId: 'a' }, room: roomMock },
        ]);

        const result = miner.getMinerAssignments(roomMock);

        expect(result.a).toBe(2);
        expect(result.b).toBe(0);
    });

    test('コンテナ上で採掘しつつ修復する', () => {
        const container = {
            structureType: global.STRUCTURE_CONTAINER,
            pos: new RoomPosition(5, 5, 'W0N0'),
            hits: 40,
            hitsMax: 100,
        };
        const source = {
            id: 's3',
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
            ticksToRegeneration: 3,
        };
        cache.getContainers.mockReturnValue([container]);
        global.Game.getObjectById.mockReturnValue(source);

        const creep = {
            name: 'miner3',
            memory: { sourceId: 's3' },
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'), // Exactly on container
            harvest: jest.fn().mockReturnValue(global.OK),
            repair: jest.fn(),
            say: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(10) },
            moveTo: jest.fn().mockReturnValue(global.OK),
        };
        cache.getSources.mockReturnValue([source]);

        miner.run(creep);

        expect(creep.repair).toHaveBeenCalledWith(container);
    });

    test('未割り当てのソースを優先的に選ぶ', () => {
        const sourceA = {
            id: 'a',
            room: roomMock,
            pos: new RoomPosition(1, 1, 'W0N0'),
        };
        const sourceB = {
            id: 'b',
            room: roomMock,
            pos: new RoomPosition(2, 2, 'W0N0'),
        };
        cache.getSources.mockReturnValue([sourceA, sourceB]);
        cache.getMyCreeps.mockReturnValue([
            { memory: { role: 'miner', sourceId: 'a' }, room: roomMock },
        ]);
        global.Game.getObjectById.mockReturnValue(undefined);

        const creep = {
            name: 'miner4',
            memory: {},
            room: roomMock,
            pos: new RoomPosition(0, 0, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.OK),
            drop: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(0) },
            say: jest.fn(),
            moveTo: jest.fn().mockReturnValue(global.OK),
        };

        miner.run(creep);

        expect(creep.memory.sourceId).toBe('b');
    });

    test('採掘ビジュアルを表示する', () => {
        const source = { energy: 50, energyCapacity: 100, pos: new RoomPosition(1, 1, 'W0N0') };
        const creep = { room: roomMock };

        miner.showMiningVisual(creep, source);

        expect(roomMock.visual.circle).toHaveBeenCalled();
    });

    test('エラー発生時にロガーがエラーを出力する', () => {
        const error = new Error('Test error');
        const source = {
            id: 's_err',
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
        };
        cache.getContainers.mockReturnValue([]);
        global.Game.getObjectById.mockReturnValue(source);

        const creep = {
            name: 'error_miner',
            memory: { sourceId: 's_err' },
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
            harvest: jest.fn().mockImplementation(() => {
                throw error;
            }),
            repair: jest.fn(),
            say: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            moveTo: jest.fn().mockReturnValue(global.OK),
        };
        cache.getSources.mockReturnValue([source]);

        miner.run(creep);

        expect(logger.error).toHaveBeenCalledWith(`[${creep.name}] マイナーエラー`, error);
    });

    describe('getBody', () => {
        test('エネルギー650以上の場合、完全最適化ボディを返す', () => {
            const expected = [
                global.WORK,
                global.WORK,
                global.WORK,
                global.WORK,
                global.WORK,
                global.CARRY,
                global.MOVE,
            ];
            expect(miner.getBody(650)).toEqual(expected);
            expect(miner.getBody(700)).toEqual(expected);
        });

        test('エネルギー550以上650未満の場合、WORK4つのボディを返す', () => {
            const expected = [
                global.WORK,
                global.WORK,
                global.WORK,
                global.WORK,
                global.CARRY,
                global.MOVE,
            ];
            expect(miner.getBody(550)).toEqual(expected);
            expect(miner.getBody(649)).toEqual(expected);
        });

        test('エネルギー450以上550未満の場合、WORK3つのボディを返す', () => {
            const expected = [global.WORK, global.WORK, global.WORK, global.CARRY, global.MOVE];
            expect(miner.getBody(450)).toEqual(expected);
            expect(miner.getBody(549)).toEqual(expected);
        });

        test('エネルギー250以上450未満の場合、WORK2つのボディを返す', () => {
            const expected = [global.WORK, global.WORK, global.MOVE];
            expect(miner.getBody(250)).toEqual(expected);
            expect(miner.getBody(449)).toEqual(expected);
        });

        test('エネルギー250未満の場合、最小ボディを返す', () => {
            const expected = [global.WORK, global.MOVE];
            expect(miner.getBody(200)).toEqual(expected);
            expect(miner.getBody(249)).toEqual(expected);
        });
    });

    test('ソースが割り当てられない場合は警告を出して終了する', () => {
        cache.getSources.mockReturnValue([]);
        const creep = {
            name: 'miner_no_source',
            memory: {},
            room: roomMock,
            pos: new RoomPosition(0, 0, 'W0N0'),
        };
        miner.run(creep);
        expect(logger.warn).toHaveBeenCalledWith(`[${creep.name}] ソースの割り当てがありません`);
    });

    test('ソースが枯渇している場合、待機メッセージを出す(コンテナあり)', () => {
        const source = {
            id: 's_empty1',
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
            ticksToRegeneration: 15,
        };
        const container = {
            structureType: global.STRUCTURE_CONTAINER,
            pos: new RoomPosition(5, 5, 'W0N0'),
            hits: 50,
            hitsMax: 100,
        };
        cache.getContainers.mockReturnValue([container]);
        global.Game.getObjectById.mockReturnValue(source);

        const creep = {
            name: 'miner_wait1',
            memory: { sourceId: 's_empty1' },
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'), // On container
            harvest: jest.fn().mockReturnValue(global.ERR_NOT_ENOUGH_ENERGY),
            repair: jest.fn(),
            say: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            moveTo: jest.fn().mockReturnValue(global.OK),
        };
        cache.getSources.mockReturnValue([source]);

        miner.run(creep);
        expect(creep.say).toHaveBeenCalledWith(`⏳ 15T`);
    });

    test('ソースから遠い場合、移動する(コンテナあり)', () => {
        const source = {
            id: 's_far1',
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
        };
        const container = {
            structureType: global.STRUCTURE_CONTAINER,
            pos: new RoomPosition(5, 5, 'W0N0'),
            hits: 50,
            hitsMax: 100,
        };
        cache.getContainers.mockReturnValue([container]);
        global.Game.getObjectById.mockReturnValue(source);

        const creep = {
            name: 'miner_far1',
            memory: { sourceId: 's_far1' },
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'), // On container
            harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            repair: jest.fn(),
            say: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            moveTo: jest.fn().mockReturnValue(global.OK),
        };
        cache.getSources.mockReturnValue([source]);

        miner.run(creep);
        expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, source, { range: 1 });
    });

    test('ソースが枯渇している場合、待機メッセージを出す(コンテナなし)', () => {
        const source = {
            id: 's_empty2',
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
            ticksToRegeneration: 20,
        };
        cache.getContainers.mockReturnValue([]);
        global.Game.getObjectById.mockReturnValue(source);

        const creep = {
            name: 'miner_wait2',
            memory: { sourceId: 's_empty2' },
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.ERR_NOT_ENOUGH_ENERGY),
            drop: jest.fn(),
            say: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            moveTo: jest.fn().mockReturnValue(global.OK),
        };
        cache.getSources.mockReturnValue([source]);

        miner.run(creep);
        expect(creep.say).toHaveBeenCalledWith(`⏳ 20T`);
    });

    test('ソースから遠い場合、移動する(コンテナなし)', () => {
        const source = {
            id: 's_far2',
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
        };
        cache.getContainers.mockReturnValue([]);
        global.Game.getObjectById.mockReturnValue(source);

        const creep = {
            name: 'miner_far2',
            memory: { sourceId: 's_far2' },
            room: roomMock,
            pos: new RoomPosition(0, 0, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            drop: jest.fn(),
            say: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            moveTo: jest.fn().mockReturnValue(global.OK),
        };
        cache.getSources.mockReturnValue([source]);

        miner.run(creep);
        expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, source, { range: 1 });
    });

    test('割り当て可能なソースがない場合はフォールバックとして最初のソースを返す', () => {
        const sourceA = { id: 'a', room: roomMock, pos: new RoomPosition(5, 5, 'W0N0') };
        const sourceB = { id: 'b', room: roomMock, pos: new RoomPosition(10, 10, 'W0N0') };
        cache.getSources.mockReturnValue([sourceA, sourceB]);

        const mockTerrain = {
            get: jest.fn().mockReturnValue(global.TERRAIN_MASK_WALL), // Always wall, so 0 mining spots
        };
        roomMock.getTerrain.mockReturnValue(mockTerrain);

        cache.getMyCreeps.mockReturnValue([
            { memory: { role: 'miner', sourceId: 'a' }, room: roomMock },
            { memory: { role: 'miner', sourceId: 'b' }, room: roomMock },
        ]);
        global.Game.getObjectById.mockReturnValue(undefined);

        const creep = {
            name: 'miner_fallback',
            memory: {},
            room: roomMock,
            pos: new RoomPosition(0, 0, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.OK),
            drop: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(0) },
            say: jest.fn(),
            moveTo: jest.fn().mockReturnValue(global.OK),
        };

        miner.run(creep);
        expect(creep.memory.sourceId).toBe('a');
    });

    test('割り当て済みのソースが存在する場合、それを使って採掘する', () => {
        const source = { id: 'assigned_src', room: roomMock, pos: new RoomPosition(5, 5, 'W0N0') };
        global.Game.getObjectById.mockReturnValue(source);
        cache.getContainers.mockReturnValue([]);

        const creep = {
            name: 'miner_assigned',
            memory: { sourceId: 'assigned_src' },
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.OK),
            drop: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
        };

        miner.run(creep);
        expect(creep.harvest).toHaveBeenCalledWith(source);
    });

    test('ビジュアル表示: 色の分岐テスト', () => {
        const sourceHigh = { energy: 80, energyCapacity: 100, pos: new RoomPosition(1, 1, 'W0N0') };
        const sourceMid = { energy: 30, energyCapacity: 100, pos: new RoomPosition(2, 2, 'W0N0') };
        const sourceLow = { energy: 10, energyCapacity: 100, pos: new RoomPosition(3, 3, 'W0N0') };
        const creep = { room: roomMock };

        miner.showMiningVisual(creep, sourceHigh);
        miner.showMiningVisual(creep, sourceMid);
        miner.showMiningVisual(creep, sourceLow);

        expect(roomMock.visual.circle).toHaveBeenCalledTimes(3); // or check specific call arguments for colors
    });
});
