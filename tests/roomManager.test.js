/**
 * src/managers/roomManager.js のユニットテスト
 */

// グローバル設定
global.Game = { time: 100, creeps: {}, flags: {} };
global.Memory = { creeps: {} };
global.FIND_SOURCES = 5;
global.FIND_STRUCTURES = 10;
global.FIND_MY_STRUCTURES = 11;
global.FIND_CONSTRUCTION_SITES = 14;
global.FIND_HOSTILE_CREEPS = 6;
global.FIND_MY_SPAWNS = 8;
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_LINK = 'link';
global.STRUCTURE_ROAD = 'road';
global.RESOURCE_ENERGY = 'energy';
global.CONTROLLER_STRUCTURES = {
  extension: { 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60 },
};
global.TERRAIN_MASK_WALL = 1;
global.LOOK_STRUCTURES = 'structure';
global.LOOK_CONSTRUCTION_SITES = 'constructionSite';
global.LOOK_AT = 'lookAt';
global.OK = 0;
global.ATTACK = 'attack';
global.RANGED_ATTACK = 'ranged_attack';
global.WORK = 'work';

jest.mock('../src/utils/cache', () => ({
  getSources: jest.fn().mockReturnValue([]),
  getContainers: jest.fn().mockReturnValue([]),
  getSpawns: jest.fn().mockReturnValue([]),
  getConstructionSites: jest.fn().mockReturnValue([]),
  getEnemies: jest.fn().mockReturnValue([]),
  getLinks: jest.fn().mockReturnValue([]),
  getStorage: jest.fn().mockReturnValue(null),
  getMyStructures: jest.fn().mockReturnValue([]),
  invalidate: jest.fn(),
  cleanup: jest.fn(),
}), { virtual: true });

jest.mock('../src/utils/pathfinder', () => ({
  findNearestOpenTile: jest.fn(),
  findPath: jest.fn().mockReturnValue({ incomplete: true, path: [] }),
  closest: jest.fn(),
}), { virtual: true });

jest.mock('../src/utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}), { virtual: true });

jest.mock('../src/constants', () => ({
  ROLES: {
    HARVESTER: 'harvester',
    UPGRADER: 'upgrader',
    BUILDER: 'builder',
  },
  CACHE_TTL: {},
  MEMORY_CLEANUP_INTERVAL: 100,
  STATS_DISPLAY_INTERVAL: 100,
  SAFE_MODE_TRIGGER_HOSTILES: 3,
}), { virtual: true });

const roomManager = require('../src/managers/roomManager');

describe('roomManager', () => {
  let mockRoom;

  beforeEach(() => {
    mockRoom = {
      name: 'W1N1',
      controller: {
        my: true,
        level: 3,
        progress: 1000,
        progressTotal: 10000,
        safeMode: null,
        safeModeAvailable: 1,
        activateSafeMode: jest.fn().mockReturnValue(OK),
        pos: { x: 25, y: 25, getRangeTo: jest.fn().mockReturnValue(10) },
      },
      energyAvailable: 300,
      energyCapacityAvailable: 300,
      storage: null,
      find: jest.fn().mockReturnValue([]),
      createConstructionSite: jest.fn().mockReturnValue(OK),
      getTerrain: jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue(0),
      }),
      lookAt: jest.fn().mockReturnValue([]),
      lookForAt: jest.fn().mockReturnValue([]),
      visual: {
        text: jest.fn(),
      },
    };

    global.Game.time = 100;
    global.Game.creeps = {};
    global.Game.flags = {};
    global.Memory.creeps = {};
  });

  describe('run', () => {
    test('自分のルームで実行される', () => {
      expect(() => roomManager.run(mockRoom)).not.toThrow();
    });

    test('コントローラーがないルームはスキップされる', () => {
      const room = { ...mockRoom, controller: null };
      expect(() => roomManager.run(room)).not.toThrow();
    });

    test('自分のルームでない場合はスキップされる', () => {
      const room = { ...mockRoom, controller: { my: false } };
      expect(() => roomManager.run(room)).not.toThrow();
    });
  });

  describe('getStats', () => {
    test('ルーム統計を返す', () => {
      global.Game.creeps = {
        creep1: {
          room: mockRoom,
          memory: { role: 'harvester' },
        },
      };

      const stats = roomManager.getStats(mockRoom);

      expect(stats).toBeDefined();
      expect(stats.name).toBe('W1N1');
      expect(stats.rcl).toBe(3);
      expect(stats.energy).toBe(300);
      expect(stats.energyCapacity).toBe(300);
    });

    test('クリープ数をロール別にカウントする', () => {
      global.Game.creeps = {
        creep1: { room: mockRoom, memory: { role: 'harvester' } },
        creep2: { room: mockRoom, memory: { role: 'harvester' } },
        creep3: { room: mockRoom, memory: { role: 'upgrader' } },
      };

      const stats = roomManager.getStats(mockRoom);

      expect(stats.creepCounts.harvester).toBe(2);
      expect(stats.creepCounts.upgrader).toBe(1);
    });
  });

  describe('showStats', () => {
    test('統計をコンソールに表示する', () => {
      expect(() => roomManager.showStats(mockRoom)).not.toThrow();
    });
  });

  describe('showVisuals', () => {
    test('ビジュアル表示が実行される', () => {
      expect(() => roomManager.showVisuals(mockRoom)).not.toThrow();
      expect(mockRoom.visual.text).toHaveBeenCalled();
    });
  });
});
