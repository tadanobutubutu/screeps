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
global.RESOURCE_ENERGY = 'energy';
global.STRUCTURE_ROAD = 'road';
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_WALL = 'constructedWall';
global.STRUCTURE_RAMPART = 'rampart';

jest.mock('../src/constants', () => ({
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
}), { virtual: true });

jest.mock('../src/utils/cache', () => ({
  getEnemies: jest.fn().mockReturnValue([]),
}), { virtual: true });

jest.mock('../src/utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}), { virtual: true });

const towerManager = require('../src/managers/towerManager');

describe('towerManager', () => {
  let mockTower;
  let mockRoom;

  beforeEach(() => {
    mockRoom = {
      name: 'W1N1',
      find: jest.fn().mockReturnValue([]),
    };

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
      expect(() => towerManager.run(mockTower)).not.toThrow();
    });

    test('敵がいる場合は攻撃する', () => {
      const mockEnemy = {
        id: 'enemy1',
        pos: { x: 27, y: 27 },
        hits: 100,
        hitsMax: 100,
      };
      mockRoom.find.mockReturnValue([mockEnemy]);

      towerManager.run(mockTower);

      expect(mockTower.attack).toHaveBeenCalledWith(mockEnemy);
    });

    test('味方が負傷している場合は回復する', () => {
      const mockCreep = {
        id: 'creep1',
        my: true,
        hits: 50,
        hitsMax: 100,
        pos: { x: 26, y: 26 },
      };
      mockRoom.find.mockImplementation((type) => {
        if (type === FIND_MY_CREEPS) return [mockCreep];
        if (type === FIND_HOSTILE_CREEPS) return [];
        return [];
      });

      towerManager.run(mockTower);

      expect(mockTower.heal).toHaveBeenCalledWith(mockCreep);
    });

    test('損傷した構造物を修復する', () => {
      const mockStructure = {
        id: 'road1',
        structureType: 'road',
        hits: 2500,
        hitsMax: 5000,
        pos: { x: 26, y: 26 },
      };
      mockRoom.find.mockImplementation((type) => {
        if (type === FIND_MY_CREEPS) return [];
        if (type === FIND_HOSTILE_CREEPS) return [];
        if (type === FIND_STRUCTURES) return [mockStructure];
        return [];
      });

      towerManager.run(mockTower);

      expect(mockTower.repair).toHaveBeenCalledWith(mockStructure);
    });

    test('エネルギーが不足している場合は何もしない', () => {
      mockTower.store[global.RESOURCE_ENERGY] = 10;

      towerManager.run(mockTower);

      // エネルギー不足のため、攻撃・回復・修復は行われない
      expect(mockTower.attack).not.toHaveBeenCalled();
    });
  });
});
