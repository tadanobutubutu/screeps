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
            visual: { text: jest.fn() },
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
                [global.RESOURCE_ENERGY]: 50,
            },
        };
    });

    it('should be defined', () => {
        expect(towerManager).toBeDefined();
    });
});