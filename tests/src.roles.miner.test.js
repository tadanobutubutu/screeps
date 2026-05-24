/**
 * src/roles/miner.js のユニットテスト
 */

global.Game = { creeps: {} };
global.Memory = {};
global.WORK = 'work';
global.CARRY = 'carry';
global.FIND_SOURCES = 222;
global.MOVE = 'move';
global.ATTACK = 'attack';
global.RANGED_ATTACK = 'ranged_attack';
global.HEAL = 'heal';
global.CLAIM = 'claim';
global.TOUGH = 'tough';
global.TERRAIN_MASK_WALL = 1;
global.FIND_STRUCTURES = 5;
global.STRUCTURE_CONTAINER = 'container';
global.ERR_NOT_IN_RANGE = -9;
global.ERR_NOT_ENOUGH_ENERGY = -6;
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.RoomPosition = function (x, y, roomName) {
    this.x = x;
    this.y = y;
    this.roomName = roomName;
    this.isEqualTo = jest.fn().mockReturnValue(false);
    this.getRangeTo = () => 1;
};

const mockCache = {
    getSources: jest.fn(),
    getContainers: jest.fn(),
    isSafeKey: jest.fn().mockReturnValue(true),
};

jest.mock('../src/utils/cache', () => mockCache);
jest.mock('../src/utils/pathfinder', () => ({
    moveTo: jest.fn(),
}));
jest.mock('../src/utils/logger', () => ({
    warn: jest.fn(),
    error: jest.fn(),
}));
jest.mock('../src/constants', () => ({
    CACHE_TTL: { SOURCES: 10, PATH: 5 },
    PATHFINDER_DEFAULTS: {
        REUSE_PATH: 10,
        MAX_ROOMS: 1,
        PLAIN_COST: 2,
        SWAMP_COST: 10,
        ROAD_COST: 1,
    },
    MEMORY_KEYS: { SOURCE_ID: 'sourceId' },
}));

const pathfinder = require('../src/utils/pathfinder');
const miner = require('../src/roles/miner');

describe('src/roles/miner', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('コンテナがある場合に移動して採掘する', () => {
        const source = {
            id: 's1',
            room: { name: 'W0N0' },
            pos: { x: 5, y: 5, getRangeTo: () => 1 },
        };
        mockCache.getContainers.mockReturnValue([
            {
                structureType: global.STRUCTURE_CONTAINER,
                pos: { x: 5, y: 5, getRangeTo: () => 1 },
                hits: 50,
                hitsMax: 100,
            },
        ]);
        global.Game.getObjectById = jest.fn().mockReturnValue(source);
        const creep = {
            name: 'miner1',
            memory: { sourceId: 's1' },
            room: { ...source.room, find: jest.fn().mockReturnValue([]) },
            pos: new RoomPosition(0, 0, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            repair: jest.fn(),
            say: jest.fn(),
        };
        mockCache.getSources.mockReturnValue([source]);

        miner.run(creep);

        expect(pathfinder.moveTo).toHaveBeenCalled();
    });

    test('コンテナなしで採掘し満タンでドロップする', () => {
        const source = {
            id: 's2',
            room: { name: 'W0N0' },
            pos: { x: 10, y: 10, getRangeTo: () => 1 },
            ticksToRegeneration: 5,
        };
        mockCache.getContainers.mockReturnValue([]);
        global.Game.getObjectById = jest.fn().mockReturnValue(source);
        const creep = {
            name: 'miner2',
            memory: { sourceId: 's2' },
            room: { ...source.room, find: jest.fn().mockReturnValue([]) },
            pos: new RoomPosition(0, 0, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.OK),
            drop: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(0) },
            say: jest.fn(),
        };
        mockCache.getSources.mockReturnValue([source]);

        miner.run(creep);

        expect(creep.drop).toHaveBeenCalledWith(global.RESOURCE_ENERGY);
    });

    test('ソース割り当て状況を集計する', () => {
        const room = { name: 'W0N0', find: jest.fn() };
        mockCache.getSources.mockReturnValue([
            { id: 'a', room },
            { id: 'b', room },
        ]);
        global.Game.creeps = {
            m1: { memory: { role: 'miner', sourceId: 'a' }, room },
            m2: { memory: { role: 'miner', sourceId: 'a' }, room },
        };

        const result = miner.getMinerAssignments(room);

        expect(result.a).toBe(2);
        expect(result.b).toBe(0);
    });

    test('コンテナ上で採掘しつつ修復する', () => {
        const container = {
            structureType: global.STRUCTURE_CONTAINER,
            pos: { x: 5, y: 5, getRangeTo: () => 0 },
            hits: 40,
            hitsMax: 100,
        };
        const source = {
            id: 's3',
            room: { name: 'W0N0' },
            pos: { x: 5, y: 5, getRangeTo: () => 0 },
            ticksToRegeneration: 3,
        };
        mockCache.getContainers.mockReturnValue([container]);
        global.Game.getObjectById = jest.fn().mockReturnValue(source);
        const creep = {
            name: 'miner3',
            memory: { sourceId: 's3' },
            room: { ...source.room, find: jest.fn().mockReturnValue([]) },
            pos: { isEqualTo: jest.fn().mockReturnValue(true) },
            harvest: jest.fn().mockReturnValue(global.OK),
            repair: jest.fn(),
            say: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(10) },
        };
        mockCache.getSources.mockReturnValue([source]);

        miner.run(creep);

        expect(creep.repair).toHaveBeenCalledWith(container);
    });

    test('未割り当てのソースを優先的に選ぶ', () => {
        const terrain = { get: jest.fn().mockReturnValue(0) };
        const room = {
            name: 'W0N0',
            getTerrain: jest.fn().mockReturnValue(terrain),
        };
        mockCache.getContainers.mockReturnValue([]);
        const sourceA = { id: 'a', room, pos: { x: 1, y: 1, getRangeTo: () => 1 } };
        const sourceB = { id: 'b', room, pos: { x: 2, y: 2, getRangeTo: () => 1 } };
        mockCache.getSources.mockReturnValue([sourceA, sourceB]);
        global.Game.creeps = {
            other: { memory: { role: 'miner', sourceId: 'a' }, room: sourceA.room },
        };
        global.Game.getObjectById = jest.fn().mockReturnValue(undefined);

        const creep = {
            name: 'miner4',
            memory: {},
            room: { ...sourceA.room, find: jest.fn().mockReturnValue([]) },
            pos: new RoomPosition(0, 0, 'W0N0'),
            harvest: jest.fn().mockReturnValue(global.OK),
            drop: jest.fn(),
            store: { getFreeCapacity: jest.fn().mockReturnValue(0) },
            say: jest.fn(),
        };

        miner.run(creep);

        expect(creep.memory.sourceId).toBe('b');
    });

    test('採掘ビジュアルを表示する', () => {
        const visual = { circle: jest.fn() };
        const creep = { room: { visual } };
        const source = { energy: 50, energyCapacity: 100, pos: { x: 1, y: 1 } };

        miner.showMiningVisual(creep, source);

        expect(visual.circle).toHaveBeenCalled();
    });

    test('エラー発生時にロガーがエラーを出力する', () => {
        const error = new Error('Test error');
        const source = {
            id: 's_err',
            room: {
                name: 'W0N0',
            },
            pos: { x: 5, y: 5, getRangeTo: () => 1 },
        };
        const container = {
            structureType: global.STRUCTURE_CONTAINER,
            pos: { x: 5, y: 5, getRangeTo: () => 1 },
            hits: 50,
            hitsMax: 100,
        };
        mockCache.getContainers.mockReturnValue([container]);
        global.Game.getObjectById = jest.fn().mockReturnValue(source);
        const creep = {
            name: 'error_miner',
            memory: { sourceId: 's_err' },
            room: { ...source.room, find: jest.fn().mockReturnValue([]) },
            pos: {
                isEqualTo: jest.fn().mockImplementation(() => {
                    throw error;
                }),
            },
            harvest: jest.fn(),
            repair: jest.fn(),
            say: jest.fn(),
        };
        mockCache.getSources.mockReturnValue([source]);
        const logger = require('../src/utils/logger');

        miner.run(creep);

        expect(logger.error).toHaveBeenCalledWith(`[${creep.name}] マイナーエラー`, error);
    });
});
