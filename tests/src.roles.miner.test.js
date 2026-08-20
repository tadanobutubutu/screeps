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


    test('Mocking one of the core dependencies to throw a dummy error to verify logger coverage', () => {
        const error = new Error('dummy mock error from core dependency');

        // Mock getAssignedSource indirect call (e.g. by mocking cache.getSources to throw)
        cache.getSources.mockImplementationOnce(() => {
            throw error;
        });

        const creep = {
            name: 'mock_error_miner',
            memory: {},
            room: roomMock,
            pos: new RoomPosition(5, 5, 'W0N0'),
            harvest: jest.fn(),
            repair: jest.fn(),
            say: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            moveTo: jest.fn(),
        };

        miner.run(creep);

        expect(logger.error).toHaveBeenCalledWith(`[${creep.name}] マイナーエラー`, error);
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

    describe('getMinerAssignments', () => {
        test('非マイナー、無効なソースID、未登録のソースはカウントしない', () => {
            const source1 = { id: 's1' };
            const source2 = { id: 's2' };
            cache.getSources.mockReturnValue([source1, source2]);

            const creeps = [
                { memory: { role: 'upgrader', sourceId: 's1' } }, // role mismatch
                { memory: { role: 'miner' } }, // missing sourceId
                { memory: { role: 'miner', sourceId: 's3' } }, // unassigned source (not in assignments)
                { memory: { role: 'miner', sourceId: 's1' } }, // invalid key (mocked)
                { memory: { role: 'miner', sourceId: 's2' } }, // valid
            ];

            cache.getMyCreeps.mockReturnValue(creeps);

            // Mock isSafeKey to return false for s1, true otherwise
            cache.isSafeKey.mockImplementation((key) => key !== 's1');

            const result = miner.getMinerAssignments(roomMock);
            expect(result['s1']).toBe(0);
            expect(result['s2']).toBe(1);
        });
    });

    describe('_getAssignedSource', () => {
        test('メモリのsourceIdが無効な場合は再割り当てする', () => {
            const creep = {
                name: 'reassign_miner',
                memory: { sourceId: 'invalid_src' },
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            global.Game.getObjectById.mockReturnValue(null); // Invalid source

            const validSource = {
                id: 'valid_src',
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
            };
            cache.getSources.mockReturnValue([validSource]);

            const mockTerrain = {
                get: jest.fn().mockReturnValue(0),
            };
            roomMock.getTerrain.mockReturnValue(mockTerrain);
            cache.getMyCreeps.mockReturnValue([]);
            cache.getContainers.mockReturnValue([]);

            miner.run(creep);
            expect(creep.memory.sourceId).toBe('valid_src');
        });
    });

    describe('_findSourceContainer', () => {

        test('コンテナのキャッシュがnullの場合はnullを返す', () => {
            const source = { id: 'src_null_cache', room: roomMock, pos: new RoomPosition(5, 5, 'W0N0') };
            cache.getContainers.mockReturnValue([]);
            cache.getSources.mockReturnValue([source]);
            global.Game.getObjectById.mockReturnValue(source);
            source.pos.getRangeTo = jest.fn().mockReturnValue(3);

            const creep = {
                name: 'miner_null_cache', memory: { sourceId: 'src_null_cache' },
                room: roomMock, pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn().mockReturnValue(global.OK), drop: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            const miner = require('../src/roles/miner');
            miner.run(creep);
            expect(cache.getContainers).toHaveBeenCalledTimes(1);

            cache.getContainers.mockClear();
            miner.run(creep);
            expect(cache.getContainers).not.toHaveBeenCalled();
        });

        test('コンテナのキャッシュがあるがオブジェクトが存在しない場合、キャッシュを無効化して再スキャンする', () => {
            const source = { id: 'src_stale_cache', room: roomMock, pos: new RoomPosition(5, 5, 'W0N0') };
            const container = { id: 'cont_1', structureType: global.STRUCTURE_CONTAINER, pos: new RoomPosition(5, 5, 'W0N0'), hits: 50, hitsMax: 100 };

            cache.getContainers.mockReturnValue([container]);
            cache.getSources.mockReturnValue([source]);
            global.Game.getObjectById.mockImplementation((id) => {
                if (id === 'src_stale_cache') return source;
                if (id === 'cont_1') return container;
                return null;
            });
            source.pos.getRangeTo = jest.fn().mockReturnValue(1);

            const creep = {
                name: 'miner_stale_cache', memory: { sourceId: 'src_stale_cache' },
                room: roomMock, pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn().mockReturnValue(global.OK), drop: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            const miner = require('../src/roles/miner');
            miner.run(creep);

            global.Game.getObjectById.mockImplementation((id) => {
                if (id === 'src_stale_cache') return source;
                return null; // simulate container destruction
            });

            cache.getContainers.mockClear();
            miner.run(creep);
            expect(cache.getContainers).toHaveBeenCalledTimes(1);
        });

        test('コンテナのキャッシュがありオブジェクトが存在する場合、キャッシュからコンテナを返す', () => {
            const source = { id: 'src_hit_cache', room: roomMock, pos: new RoomPosition(5, 5, 'W0N0') };
            const container = { id: 'cont_hit', structureType: global.STRUCTURE_CONTAINER, pos: new RoomPosition(5, 5, 'W0N0'), hits: 50, hitsMax: 100 };

            cache.getContainers.mockReturnValue([container]);
            cache.getSources.mockReturnValue([source]);
            global.Game.getObjectById.mockImplementation((id) => {
                if (id === 'src_hit_cache') return source;
                if (id === 'cont_hit') return container;
                return null;
            });
            source.pos.getRangeTo = jest.fn().mockReturnValue(1);

            const creep = {
                name: 'miner_hit_cache', memory: { sourceId: 'src_hit_cache' },
                room: roomMock, pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn().mockReturnValue(global.OK), drop: jest.fn(), repair: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            const miner = require('../src/roles/miner');
            miner.run(creep);
            expect(cache.getContainers).toHaveBeenCalledTimes(1);

            cache.getContainers.mockClear();
            miner.run(creep);
            expect(cache.getContainers).not.toHaveBeenCalled();
            expect(creep.harvest).toHaveBeenCalledWith(source);
        });

        test('範囲外のコンテナは無視する', () => {
            const source = {
                id: 'src_container',
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
            };
            global.Game.getObjectById.mockReturnValue(source);

            const farContainer = {
                structureType: global.STRUCTURE_CONTAINER,
                pos: new RoomPosition(10, 10, 'W0N0'),
                hits: 50,
                hitsMax: 100,
            };
            source.pos.getRangeTo = jest.fn().mockReturnValue(3); // > CONTAINER_SEARCH_RANGE

            cache.getContainers.mockReturnValue([farContainer]);
            cache.getSources.mockReturnValue([source]);

            const creep = {
                name: 'miner_far_container',
                memory: { sourceId: 'src_container' },
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn().mockReturnValue(global.OK),
                drop: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            miner.run(creep);
            // Since container is too far, it will use _mineDirectly.
            // Which means it will not try to repair anything and will drop if full.
            expect(creep.harvest).toHaveBeenCalledWith(source);
        });
    });

    describe('_mineToContainer', () => {
        test('コンテナのHPが50%未満なら修復する', () => {
            const source = {
                id: 'src_repair',
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
            };
            global.Game.getObjectById.mockReturnValue(source);

            const container = {
                structureType: global.STRUCTURE_CONTAINER,
                pos: new RoomPosition(5, 5, 'W0N0'),
                hits: 40,
                hitsMax: 100,
            };
            source.pos.getRangeTo = jest.fn().mockReturnValue(1); // <= CONTAINER_SEARCH_RANGE

            cache.getContainers.mockReturnValue([container]);
            cache.getSources.mockReturnValue([source]);

            const creep = {
                name: 'miner_repair',
                memory: { sourceId: 'src_repair' },
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'), // On container
                harvest: jest.fn().mockReturnValue(global.OK),
                repair: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            miner.run(creep);
            expect(creep.repair).toHaveBeenCalledWith(container);
        });

        test('コンテナのHPが50%以上なら修復しない', () => {
            const source = {
                id: 'src_no_repair',
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
            };
            global.Game.getObjectById.mockReturnValue(source);

            const container = {
                structureType: global.STRUCTURE_CONTAINER,
                pos: new RoomPosition(5, 5, 'W0N0'),
                hits: 60,
                hitsMax: 100,
            };
            source.pos.getRangeTo = jest.fn().mockReturnValue(1); // <= CONTAINER_SEARCH_RANGE

            cache.getContainers.mockReturnValue([container]);
            cache.getSources.mockReturnValue([source]);

            const creep = {
                name: 'miner_no_repair',
                memory: { sourceId: 'src_no_repair' },
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'), // On container
                harvest: jest.fn().mockReturnValue(global.OK),
                repair: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            miner.run(creep);
            expect(creep.repair).not.toHaveBeenCalled();
        });
    });

    describe('_mineDirectly', () => {
        test('エネルギーが満杯ならドロップする', () => {
            const source = { id: 'src_drop', room: roomMock, pos: new RoomPosition(5, 5, 'W0N0') };
            global.Game.getObjectById.mockReturnValue(source);
            cache.getContainers.mockReturnValue([]);
            cache.getSources.mockReturnValue([source]);

            const creep = {
                name: 'miner_drop',
                memory: { sourceId: 'src_drop' },
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn().mockReturnValue(global.OK),
                drop: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(0) },
            };

            miner.run(creep);
            expect(creep.drop).toHaveBeenCalledWith(global.RESOURCE_ENERGY);
        });

        test('エネルギーに空きがあればドロップしない', () => {
            const source = {
                id: 'src_no_drop',
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
            };
            global.Game.getObjectById.mockReturnValue(source);
            cache.getContainers.mockReturnValue([]);
            cache.getSources.mockReturnValue([source]);

            const creep = {
                name: 'miner_no_drop',
                memory: { sourceId: 'src_no_drop' },
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn().mockReturnValue(global.OK),
                drop: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(10) },
            };

            miner.run(creep);
            expect(creep.drop).not.toHaveBeenCalled();
        });
    });

    describe('_countMiningSpots', () => {
        test('周囲の地形から採掘可能なスポット数を計算する（最大3）', () => {
            const source = {
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
            };

            // Mock room terrain
            // 8 spots around source (dx: -1 to 1, dy: -1 to 1)
            // Let's say 4 spots are plain (not wall), rest are walls
            // _countMiningSpots should cap it at 3
            let callCount = 0;
            const mockTerrain = {
                get: jest.fn().mockImplementation((x, y) => {
                    callCount++;
                    // First 4 calls return plain (0), rest return wall
                    return callCount <= 4 ? 0 : global.TERRAIN_MASK_WALL;
                }),
            };
            roomMock.getTerrain.mockReturnValue(mockTerrain);

            // _countMiningSpots is not exported directly, but we can test it indirectly via _findBestSource
            // if we can control minerCounts to be 0 for all.
            // A better way is to test the effect of _countMiningSpots on the assignment logic.
            // If we have 2 sources, one with 1 spot, one with 3 spots, and current assignments are 1 for both.
            // The one with 1 spot should not accept more miners, so the one with 3 spots should be chosen.

            const source1 = { id: 's_spot1', room: roomMock, pos: new RoomPosition(5, 5, 'W0N0') };
            const source2 = {
                id: 's_spot3',
                room: roomMock,
                pos: new RoomPosition(10, 10, 'W0N0'),
            };

            const mockTerrainSpot = {
                get: jest.fn().mockImplementation((x, y) => {
                    if (x >= 4 && x <= 6 && y >= 4 && y <= 6) {
                        // Around source1: Only 1 plain spot
                        return x === 5 && y === 4 ? 0 : global.TERRAIN_MASK_WALL;
                    }
                    if (x >= 9 && x <= 11 && y >= 9 && y <= 11) {
                        // Around source2: 3 plain spots
                        return y === 9 ? 0 : global.TERRAIN_MASK_WALL;
                    }
                    return global.TERRAIN_MASK_WALL;
                }),
            };
            roomMock.getTerrain.mockReturnValue(mockTerrainSpot);

            cache.getSources.mockReturnValue([source1, source2]);

            // 1 miner on source1, 1 miner on source2
            const creeps = [
                { memory: { role: 'miner', sourceId: 's_spot1' } },
                { memory: { role: 'miner', sourceId: 's_spot3' } },
            ];
            cache.getMyCreeps.mockReturnValue(creeps);
            cache.isSafeKey.mockReturnValue(true);

            const creep = {
                name: 'miner_spots',
                memory: {}, // Needs assignment
                room: roomMock,
                pos: new RoomPosition(0, 0, 'W0N0'),
                harvest: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };
            global.Game.getObjectById.mockReturnValue(null);
            cache.getContainers.mockReturnValue([]);

            miner.run(creep);

            // source1 has 1 spot and 1 miner -> full
            // source2 has 3 spots and 1 miner -> can accept 2 more
            // So source2 should be assigned
            expect(creep.memory.sourceId).toBe('s_spot3');
        });

        test('マップ外の座標は無視される', () => {
            // Source at edge of map
            const sourceEdge = {
                id: 's_edge',
                room: roomMock,
                pos: new RoomPosition(0, 5, 'W0N0'),
            };
            cache.getSources.mockReturnValue([sourceEdge]);

            const mockTerrainEdge = {
                get: jest.fn().mockReturnValue(0), // All spots are plain
            };
            roomMock.getTerrain.mockReturnValue(mockTerrainEdge);
            cache.getMyCreeps.mockReturnValue([]); // 0 miners
            cache.isSafeKey.mockReturnValue(true);

            const creep = {
                name: 'miner_edge',
                memory: {}, // Needs assignment
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };
            global.Game.getObjectById.mockReturnValue(null);
            cache.getContainers.mockReturnValue([]);

            miner.run(creep);

            // Should just assign the edge source successfully without error
            expect(creep.memory.sourceId).toBe('s_edge');
        });
    });

    describe('_getAssignedSource branch coverage', () => {
        test('ソースがない場合はnullを返す', () => {
            const creep = {
                name: 'miner_no_source',
                memory: {}, // Needs assignment
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            cache.getSources.mockReturnValue([]);
            global.Game.getObjectById.mockReturnValue(null);

            miner.run(creep);
            // Will warn and return early
            expect(logger.warn).toHaveBeenCalledWith(
                `[${creep.name}] ソースの割り当てがありません`
            );
            expect(creep.memory.sourceId).toBeUndefined();
        });

        test('有効なsourceIdを持っている場合は既存のソースを返す', () => {
            const validSource = {
                id: 'existing_src',
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
            };
            const creep = {
                name: 'miner_has_source',
                memory: { sourceId: 'existing_src' },
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
                harvest: jest.fn().mockReturnValue(global.OK),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            global.Game.getObjectById.mockReturnValue(validSource);
            cache.getContainers.mockReturnValue([]);
            cache.getSources.mockReturnValue([validSource]);

            miner.run(creep);
            expect(creep.harvest).toHaveBeenCalledWith(validSource);
        });
    });

    describe('_mineToContainer container full branch', () => {
        test('コンテナが満杯でも採掘し続ける（ERR_NOT_ENOUGH_ENERGYなどの分岐がない、OK時）', () => {
            const source = { id: 'src_full', room: roomMock, pos: new RoomPosition(5, 5, 'W0N0') };
            global.Game.getObjectById.mockReturnValue(source);

            const container = {
                structureType: global.STRUCTURE_CONTAINER,
                pos: new RoomPosition(5, 5, 'W0N0'),
                hits: 100, // hp > 50%
                hitsMax: 100,
            };
            source.pos.getRangeTo = jest.fn().mockReturnValue(1); // <= CONTAINER_SEARCH_RANGE

            cache.getContainers.mockReturnValue([container]);
            cache.getSources.mockReturnValue([source]);

            const creep = {
                name: 'miner_full_container',
                memory: { sourceId: 'src_full' },
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'), // On container
                harvest: jest.fn().mockReturnValue(global.OK), // harvest is OK
                repair: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(0) },
            };

            miner.run(creep);
            // It just harvests, and doesn't drop since it's on a container
            // The drop is only in _mineDirectly
            expect(creep.harvest).toHaveBeenCalledWith(source);
            expect(creep.repair).not.toHaveBeenCalled();
        });
    });

    describe('edge cases', () => {
        test('_findBestSource returns fallback when no bestSource found (e.g., all full) but sources exist', () => {
            const source1 = { id: 's1', room: roomMock, pos: new RoomPosition(5, 5, 'W0N0') };
            const source2 = { id: 's2', room: roomMock, pos: new RoomPosition(10, 10, 'W0N0') };
            cache.getSources.mockReturnValue([source1, source2]);

            // maxMiners is 0 for both (mocking terrain to wall for all spots)
            const mockTerrain = {
                get: jest.fn().mockReturnValue(global.TERRAIN_MASK_WALL),
            };
            roomMock.getTerrain.mockReturnValue(mockTerrain);

            // 1 miner on s1, 1 miner on s2
            const creeps = [
                { memory: { role: 'miner', sourceId: 's1' } },
                { memory: { role: 'miner', sourceId: 's2' } },
            ];
            cache.getMyCreeps.mockReturnValue(creeps);
            cache.isSafeKey.mockReturnValue(true);

            const minerCounts = miner.getMinerAssignments(roomMock);

            // _findBestSource will have minCount = Infinity, and bestSource = null initially.
            // Since count >= maxMiners (1 >= 0) for both, it won't update bestSource.
            // Finally it falls back to sources[0].

            // Indirectly test this through _getAssignedSource
            global.Game.getObjectById.mockReturnValue(null);

            const creep = {
                name: 'miner_fallback',
                memory: {}, // Needs assignment
                room: roomMock,
                pos: new RoomPosition(0, 0, 'W0N0'),
                harvest: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            miner.run(creep);
            expect(creep.memory.sourceId).toBe('s1');
        });

        test('creep repair condition in _mineToContainer branch coverage', () => {
            const source = {
                id: 'src_repair',
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
            };
            global.Game.getObjectById.mockReturnValue(source);

            const container = {
                structureType: global.STRUCTURE_CONTAINER,
                pos: new RoomPosition(5, 5, 'W0N0'),
                hits: 49,
                hitsMax: 100, // hits < hitsMax * 0.5 (49 < 50)
            };
            source.pos.getRangeTo = jest.fn().mockReturnValue(1); // <= CONTAINER_SEARCH_RANGE

            cache.getContainers.mockReturnValue([container]);
            cache.getSources.mockReturnValue([source]);

            const creep = {
                name: 'miner_repair',
                memory: { sourceId: 'src_repair' },
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'), // On container
                harvest: jest.fn().mockReturnValue(global.OK),
                repair: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };

            miner.run(creep);
            expect(creep.repair).toHaveBeenCalledWith(container);
        });

        test('_countMiningSpots caches terrain results by source ID to avoid redundant getTerrain calls', () => {
            const source1 = {
                id: 'cache_test_s1',
                room: roomMock,
                pos: new RoomPosition(5, 5, 'W0N0'),
            };
            cache.getSources.mockReturnValue([source1]);
            cache.getMyCreeps.mockReturnValue([]);
            cache.isSafeKey.mockReturnValue(true);

            const mockTerrain = {
                get: jest.fn().mockReturnValue(0),
            };
            roomMock.getTerrain.mockReturnValue(mockTerrain);

            const creep1 = {
                name: 'c1',
                memory: {},
                room: roomMock,
                pos: new RoomPosition(0, 0, 'W0N0'),
                harvest: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };
            global.Game.getObjectById.mockReturnValue(null);
            cache.getContainers.mockReturnValue([]);

            miner.run(creep1);
            expect(roomMock.getTerrain).toHaveBeenCalledTimes(1);

            // Run assignment again with a second creep
            const creep2 = {
                name: 'c2',
                memory: {},
                room: roomMock,
                pos: new RoomPosition(0, 0, 'W0N0'),
                harvest: jest.fn(),
                store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
            };
            miner.run(creep2);
            // getTerrain should not have been called a second time because of the cache!
            expect(roomMock.getTerrain).toHaveBeenCalledTimes(1);
        });
    });
});
