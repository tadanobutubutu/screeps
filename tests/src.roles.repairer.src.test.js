/**
 * src/roles/repairer.js のユニットテスト
 */

global.Game = { creeps: {} };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.WORK = 'work';
global.CARRY = 'carry';
global.MOVE = 'move';
global.STRUCTURE_WALL = 'wall';
global.STRUCTURE_RAMPART = 'rampart';
global.STRUCTURE_ROAD = 'road';
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_STORAGE = 'storage';
global.FIND_STRUCTURES = 5;
global.ERR_NOT_IN_RANGE = -9;
global.ERR_INVALID_TARGET = -7;
global.OK = 0;

const mockCache = {
    getConstructionSites: jest.fn(),
    getStructures: jest.fn().mockReturnValue([]),
    getDroppedResources: jest.fn(),
    getContainers: jest.fn(),
    getStorage: jest.fn(),
    assignSource: jest.fn(),
};

jest.mock('../src/utils/cache', () => mockCache, { virtual: true });
jest.mock(
    '../src/utils/pathfinder',
    () => ({
        moveTo: jest.fn(),
        closest: jest.fn(),
    }),
    { virtual: true }
);
jest.mock('../src/utils/logger', () => ({ warn: jest.fn() }), { virtual: true });
jest.mock(
    '../src/constants',
    () => ({
        MEMORY_KEYS: { WORKING: 'working', TARGET_ID: 'targetId', SOURCE_ID: 'sourceId' },
        REPAIR_THRESHOLD: { road: 0.8, container: 0.8, OTHER: 0.9 },
        WALL_HP_TARGET: { 1: 1000, 2: 2000, 3: 3000 },
    }),
    { virtual: true }
);

const pathfinder = require('../src/utils/pathfinder');
const repairer = require('../src/roles/repairer');

describe('src/roles/repairer', () => {
    beforeEach(() => {
        mockCache.getConstructionSites.mockReturnValue([]);
        mockCache.getStructures.mockReturnValue([]);
        jest.clearAllMocks();
    });

    test('修理ターゲットに移動してキャッシュする', () => {
        const target = {
            id: 't1',
            hits: 10,
            hitsMax: 100,
            structureType: global.STRUCTURE_ROAD,
            pos: { x: 1, y: 1 },
        };
        const room = {
            controller: { level: 2 },
            // find: jest.fn().mockReturnValue([target])
        };
        mockCache.getStructures.mockReturnValue([target]);
        const creep = {
            memory: { working: true },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(1) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            build: jest.fn(),
            upgradeController: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.memory.targetId).toBe('t1');
        expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, target, { range: 3 });
    });

    test('建設サイトを補助するバックアップ動作', () => {
        const site = { id: 'site', pos: { x: 2, y: 2 } };
        mockCache.getConstructionSites.mockReturnValue([site]);
        const room = { controller: { level: 2 }, find: jest.fn().mockReturnValue([]) };
        const creep = {
            memory: { working: true },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(2) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn().mockReturnValue(global.OK),
            build: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            upgradeController: jest.fn(),
        };
        pathfinder.closest.mockReturnValue(site);

        repairer.run(creep);

        expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, site, { range: 3 });
    });

    test('壁の修理対象数を数える', () => {
        const wall = { structureType: global.STRUCTURE_WALL, hits: 500, hitsMax: 5000 };
        const road = { structureType: global.STRUCTURE_ROAD, hits: 10, hitsMax: 100 };
        const room = {
            controller: { level: 1 },
            // find: jest.fn().mockReturnValue([wall, road])
        };

        mockCache.getStructures.mockReturnValue([wall, road]);
        const count = repairer.countDamagedStructures(room);

        expect(count).toBe(2);
    });

    test('エネルギー取得で落下リソースを拾う', () => {
        mockCache.getDroppedResources.mockReturnValue([
            { id: 'r1', resourceType: global.RESOURCE_ENERGY, amount: 50 },
        ]);
        mockCache.getContainers.mockReturnValue([]);
        mockCache.getStorage.mockReturnValue(null);
        const creep = {
            memory: { working: false },
            room: {},
            store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
            say: jest.fn(),
            pickup: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
        };

        repairer.run(creep);

        expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, expect.any(Object), { range: 1 });
    });

    test('ストレージからエネルギーを取得する', () => {
        mockCache.getDroppedResources.mockReturnValue([]);
        mockCache.getContainers.mockReturnValue([]);
        mockCache.getStorage.mockReturnValue({ store: { [global.RESOURCE_ENERGY]: 300 } });
        const creep = {
            memory: { working: false },
            room: {},
            store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
            say: jest.fn(),
            withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
        };

        repairer.run(creep);

        expect(pathfinder.moveTo).toHaveBeenCalled();
    });

    test('getBodyで最小構成を返す', () => {
        expect(repairer.getBody(600)).toEqual([WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
        expect(repairer.getBody(200)).toEqual([WORK, CARRY, MOVE]);
    });

    test('getBodyで300エネルギーボディを返す', () => {
        expect(repairer.getBody(300)).toEqual([WORK, CARRY, CARRY, MOVE]);
    });

    test('エネルギーが0のときworkingを解除して補充メッセージを表示する', () => {
        mockCache.getDroppedResources.mockReturnValue([]);
        mockCache.getContainers.mockReturnValue([]);
        mockCache.getStorage.mockReturnValue(null);
        mockCache.assignSource.mockReturnValue(null);

        const creep = {
            memory: { working: true, targetId: 'old' },
            room: {},
            store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
            say: jest.fn(),
            repair: jest.fn(),
            build: jest.fn(),
            upgradeController: jest.fn(),
            pickup: jest.fn(),
            withdraw: jest.fn(),
            harvest: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.memory.working).toBe(false);
        expect(creep.memory.targetId).toBeUndefined();
        expect(creep.say).toHaveBeenCalledWith('🔄 補充');
    });

    test('エネルギー満タンのときworkingを設定して修復メッセージを表示する', () => {
        const target = {
            id: 't2',
            hits: 50,
            hitsMax: 100,
            structureType: global.STRUCTURE_ROAD,
            pos: { x: 1, y: 1 },
        };
        const room = {
            controller: { level: 2 },
            find: jest.fn().mockReturnValue([target]),
        };
        const creep = {
            memory: { working: false },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(1) },
            store: { [global.RESOURCE_ENERGY]: 100, getCapacity: jest.fn().mockReturnValue(100) },
            say: jest.fn(),
            repair: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            build: jest.fn(),
            upgradeController: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.memory.working).toBe(true);
        expect(creep.say).toHaveBeenCalledWith('🔧 修復');
    });

    test('修復完了時にターゲットをクリアする', () => {
        const target = {
            id: 't3',
            hits: 98,
            hitsMax: 100,
            structureType: global.STRUCTURE_ROAD,
            pos: { x: 1, y: 1 },
        };
        global.Game.getObjectById = jest.fn().mockReturnValue(target);
        const room = {
            controller: { level: 2 },
            find: jest.fn().mockReturnValue([]),
        };
        const creep = {
            memory: { working: true, targetId: 't3' },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(1) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn().mockReturnValue(global.OK),
            build: jest.fn(),
            upgradeController: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.memory.targetId).toBeUndefined();
    });

    test('ERR_INVALID_TARGETでターゲットをクリアする', () => {
        const target = {
            id: 't4',
            hits: 10,
            hitsMax: 100,
            structureType: global.STRUCTURE_ROAD,
            pos: { x: 1, y: 1 },
        };
        const room = {
            controller: { level: 2 },
            find: jest.fn().mockReturnValue([target]),
        };
        pathfinder.closest.mockReturnValue(target);
        const creep = {
            memory: { working: true },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(1) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn().mockReturnValue(global.ERR_INVALID_TARGET),
            build: jest.fn(),
            upgradeController: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.memory.targetId).toBeUndefined();
    });

    test('壁とランパートの修復判定', () => {
        const wall = { structureType: global.STRUCTURE_WALL, hits: 500, hitsMax: 300000000 };
        mockCache.getStructures.mockReturnValue([wall]);
        const room = {
            controller: { level: 3 },
            find: jest.fn().mockReturnValue([wall]),
        };
        const creep = {
            memory: { working: true },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(1) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            build: jest.fn(),
            upgradeController: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.repair).toHaveBeenCalledWith(wall);
    });

    test('建設補助で建設サイトを修復する', () => {
        const site = { id: 'site1', pos: { x: 2, y: 2 } };
        mockCache.getConstructionSites.mockReturnValue([site]);
        const room = { controller: { level: 2 }, find: jest.fn().mockReturnValue([]) };
        pathfinder.closest.mockReturnValue(site);
        const creep = {
            memory: { working: true },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(2) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn(),
            build: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            upgradeController: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.build).toHaveBeenCalledWith(site);
        expect(creep.say).toHaveBeenCalledWith('🔨 建設');
    });

    test('建設補助で建設サイトもなくコントローラーをアップグレードする', () => {
        mockCache.getConstructionSites.mockReturnValue([]);
        const room = { controller: { level: 2, id: 'ctrl1' }, find: jest.fn().mockReturnValue([]) };
        const creep = {
            memory: { working: true },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(2) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn(),
            build: jest.fn(),
            upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
        };

        repairer.run(creep);

        expect(creep.upgradeController).toHaveBeenCalledWith(room.controller);
        expect(creep.say).toHaveBeenCalledWith('⬆️ 強化');
    });

    test('建設補助で建設サイトを修復し、範囲内にいる場合（OK）', () => {
        const site = { id: 'site1', pos: { x: 2, y: 2 } };
        mockCache.getConstructionSites.mockReturnValue([site]);
        const room = { controller: { level: 2 }, find: jest.fn().mockReturnValue([]) };
        pathfinder.closest.mockReturnValue(site);
        const creep = {
            memory: { working: true },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(1) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn(),
            build: jest.fn().mockReturnValue(global.OK),
            upgradeController: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.build).toHaveBeenCalledWith(site);
        expect(pathfinder.moveTo).not.toHaveBeenCalled();
        expect(creep.say).toHaveBeenCalledWith('🔨 建設');
    });

    test('建設補助で建設サイトもなくコントローラーをアップグレードし、範囲内にいる場合（OK）', () => {
        mockCache.getConstructionSites.mockReturnValue([]);
        const room = { controller: { level: 2, id: 'ctrl1' }, find: jest.fn().mockReturnValue([]) };
        const creep = {
            memory: { working: true },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(1) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn(),
            build: jest.fn(),
            upgradeController: jest.fn().mockReturnValue(global.OK),
        };

        repairer.run(creep);

        expect(creep.upgradeController).toHaveBeenCalledWith(room.controller);
        expect(pathfinder.moveTo).not.toHaveBeenCalled();
        expect(creep.say).toHaveBeenCalledWith('⬆️ 強化');
    });

    test('建設補助で建設サイトもなく、コントローラーもない場合', () => {
        mockCache.getConstructionSites.mockReturnValue([]);
        const room = { find: jest.fn().mockReturnValue([]) }; // controller is undefined
        const creep = {
            memory: { working: true },
            room,
            pos: { getRangeTo: jest.fn().mockReturnValue(1) },
            store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
            say: jest.fn(),
            repair: jest.fn(),
            build: jest.fn(),
            upgradeController: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.upgradeController).not.toHaveBeenCalled();
        expect(creep.say).not.toHaveBeenCalledWith('⬆️ 強化');
    });

    test('コンテナからエネルギーを取得する', () => {
        mockCache.getDroppedResources.mockReturnValue([]);
        const container = { store: { [global.RESOURCE_ENERGY]: 200 } };
        mockCache.getContainers.mockReturnValue([container]);
        mockCache.getStorage.mockReturnValue(null);
        mockCache.assignSource.mockReturnValue(null);
        pathfinder.closest.mockReturnValue(container);

        const creep = {
            memory: { working: false },
            room: {},
            store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
            say: jest.fn(),
            pickup: jest.fn(),
            withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
            harvest: jest.fn(),
        };

        repairer.run(creep);

        expect(creep.withdraw).toHaveBeenCalledWith(container, global.RESOURCE_ENERGY);
        expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, container, { range: 1 });
    });

    test('ソースから直接採掘する', () => {
        mockCache.getDroppedResources.mockReturnValue([]);
        mockCache.getContainers.mockReturnValue([]);
        mockCache.getStorage.mockReturnValue(null);
        const source = { id: 'src1' };
        mockCache.assignSource.mockReturnValue(source);

        const creep = {
            memory: { working: false },
            room: {},
            store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
            say: jest.fn(),
            pickup: jest.fn(),
            withdraw: jest.fn(),
            harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
        };

        repairer.run(creep);

        expect(creep.harvest).toHaveBeenCalledWith(source);
        expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, source, { range: 1 });
    });

    test('REPAIR_PRIORITYでコンテナが最高優先度を持つ', () => {
        expect(repairer.REPAIR_PRIORITY[global.STRUCTURE_CONTAINER]).toBe(1);
        expect(repairer.REPAIR_PRIORITY[global.STRUCTURE_ROAD]).toBe(2);
        expect(repairer.REPAIR_PRIORITY[global.STRUCTURE_RAMPART]).toBe(3);
    });
});
