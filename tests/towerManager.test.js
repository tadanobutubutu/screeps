/**
 * src/managers/towerManager.js のユニットテスト
 */

global.Game = { time: 100 };
global.Memory = {};
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_MY_CREEPS = 2;
global.FIND_HOSTILE_CREEPS = 6;
global.FIND_STRUCTURES = 10;
global.FIND_MY_STRUCTURES = 8;
global.RESOURCE_ENERGY = 'energy';
global.STRUCTURE_ROAD = 'road';
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_WALL = 'constructedWall';
global.STRUCTURE_RAMPART = 'rampart';
global.STRUCTURE_TOWER = 'tower';
global.ATTACK = 'attack';
global.RANGED_ATTACK = 'ranged_attack';
global.HEAL = 'heal';
global.CLAIM = 'claim';

jest.mock(
    '../src/constants',
    () => ({
        TOWER_REPAIR_THRESHOLD: 0.8,
        TOWER_REPAIR_STOP_THRESHOLD: 0.95,
        TOWER_HEAL_THRESHOLD: 0.9,
        TOWER_ENERGY_PRIORITY: 0.5,
        REPAIR_THRESHOLD: {
            ROAD: 0.5,
            CONTAINER: 0.5,
            WALL: 0.0001,
            RAMPART: 0.001,
            OTHER: 0.75,
        },
    }),
    { virtual: true }
);

jest.mock(
    '../src/utils/cache',
    () => ({
        getEnemies: jest.fn(),
        getMyStructures: jest.fn(),
        getMyCreeps: jest.fn(),
        getStructures: jest.fn(),
    }),
    { virtual: true }
);

const cache = require('../src/utils/cache');

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

const towerManager = require('../src/managers/towerManager');

describe('towerManager', () => {
    let mockTower;
    let mockRoom;

    beforeEach(() => {
        mockRoom = {
            name: 'W1N1',
            find: jest.fn().mockReturnValue([]),
            controller: { level: 1 },
        };

        cache.getMyCreeps.mockReturnValue([]);
        cache.getStructures.mockReturnValue([]);
        cache.getEnemies.mockReturnValue([]);
        cache.getMyStructures.mockReturnValue([]);

        mockTower = {
            id: 'tower1',
            pos: { x: 25, y: 25, getRangeTo: jest.fn().mockReturnValue(5) },
            room: mockRoom,
            store: {
                [global.RESOURCE_ENERGY]: 500,
                getCapacity: jest.fn().mockReturnValue(1000),
            },
            attack: jest.fn().mockReturnValue(OK),
            heal: jest.fn().mockReturnValue(OK),
            repair: jest.fn().mockReturnValue(OK),
        };
    });

    describe('run', () => {
        test('タワーが実行される', () => {
            cache.getMyStructures.mockReturnValue([mockTower]);
            expect(() => towerManager.run(mockRoom)).not.toThrow();
        });

        test('敵がいる場合は攻撃する', () => {
            const mockEnemy = {
                id: 'enemy1',
                pos: { x: 27, y: 27 },
                hits: 100,
                hitsMax: 100,
                getActiveBodyparts: jest.fn().mockReturnValue(0),
            };
            cache.getEnemies.mockReturnValue([mockEnemy]);
            cache.getMyStructures.mockReturnValue([mockTower]);

            towerManager.run(mockRoom);

            expect(mockTower.attack).toHaveBeenCalled();
        });

        test('敵がいない場合は攻撃処理をスキップする', () => {
            cache.getEnemies.mockReturnValue([]);
            cache.getMyStructures.mockReturnValue([mockTower]);

            towerManager.run(mockRoom);

            expect(mockTower.attack).not.toHaveBeenCalled();
        });

        test('味方が負傷している場合は回復する', () => {
            const mockCreep = {
                id: 'creep1',
                my: true,
                hits: 50,
                hitsMax: 100,
                pos: { x: 26, y: 26 },
            };
            cache.getMyCreeps.mockReturnValue([mockCreep]);
            cache.getEnemies.mockReturnValue([]);
            cache.getMyStructures.mockReturnValue([mockTower]);

            towerManager.run(mockRoom);

            expect(mockTower.heal).toHaveBeenCalled();
        });

        test('損傷した構造物があってもエラーなく実行される', () => {
            const mockStructure = {
                id: 'road1',
                structureType: 'road',
                hits: 2000,
                hitsMax: 5000,
                pos: { x: 26, y: 26 },
            };
            cache.getMyCreeps.mockReturnValue([]);
            cache.getStructures.mockReturnValue([mockStructure]);
            cache.getEnemies.mockReturnValue([]);
            cache.getMyStructures.mockReturnValue([mockTower]);
            mockTower.store[global.RESOURCE_ENERGY] = 600;

            expect(() => towerManager.run(mockRoom)).not.toThrow();
        });

        test('エネルギーが不足している場合は何もしない', () => {
            mockTower.store[global.RESOURCE_ENERGY] = 10;
            cache.getEnemies.mockReturnValue([]);
            cache.getMyStructures.mockReturnValue([mockTower]);

            towerManager.run(mockRoom);

            // エネルギー不足のため、攻撃・回復・修復は行われない
            expect(mockTower.attack).not.toHaveBeenCalled();
        });
    });

    describe('getTowersNeedingEnergy', () => {
        test('エネルギー比率が閾値未満のタワーを返す', () => {
            const lowEnergyTower = {
                id: 'tower_low',
                store: {
                    [global.RESOURCE_ENERGY]: 400,
                    getCapacity: () => 1000,
                },
            };
            const highEnergyTower = {
                id: 'tower_high',
                store: {
                    [global.RESOURCE_ENERGY]: 600,
                    getCapacity: () => 1000,
                },
            };
            cache.getMyStructures.mockReturnValue([lowEnergyTower, highEnergyTower]);

            const result = towerManager.getTowersNeedingEnergy(mockRoom);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('tower_low');
        });

        test('すべてのタワーのエネルギー比率が閾値以上の場合は空配列を返す', () => {
            const highEnergyTower1 = {
                id: 'tower_high1',
                store: {
                    [global.RESOURCE_ENERGY]: 500,
                    getCapacity: () => 1000,
                },
            };
            const highEnergyTower2 = {
                id: 'tower_high2',
                store: {
                    [global.RESOURCE_ENERGY]: 600,
                    getCapacity: () => 1000,
                },
            };
            cache.getMyStructures.mockReturnValue([highEnergyTower1, highEnergyTower2]);

            const result = towerManager.getTowersNeedingEnergy(mockRoom);
            expect(result).toHaveLength(0);
        });

        test('タワーが存在しない場合は空配列を返す', () => {
            cache.getMyStructures.mockReturnValue([]);
            const result = towerManager.getTowersNeedingEnergy(mockRoom);
            expect(result).toHaveLength(0);
        });
    });
});
