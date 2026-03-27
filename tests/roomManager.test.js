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

const cache = require('../src/utils/cache');
const pathfinder = require('../src/utils/pathfinder');
const roomManager = require('../src/managers/roomManager');

describe('roomManager', () => {
  let mockRoom;

  beforeEach(() => {
    jest.clearAllMocks();
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

  describe('planning and safety', () => {
    test('コンテナと道路を計画しキャッシュを無効化する', () => {
      const source = { id: 's1', pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(3) } };
      cache.getSources.mockReturnValue([source]);
      cache.getContainers.mockReturnValue([]);
      cache.getConstructionSites.mockReturnValue([]);
      cache.getSpawns.mockReturnValue([{ pos: { x: 5, y: 5 } }]);
      pathfinder.findNearestOpenTile.mockReturnValue({ x: 11, y: 11 });
      pathfinder.findPath.mockReturnValue({ incomplete: false, path: [{ x: 6, y: 5 }, { x: 7, y: 5 }] });

      Game.time = 500; // BUILD_PLAN_INTERVAL に合わせる
      roomManager.run(mockRoom);

      expect(mockRoom.createConstructionSite).toHaveBeenCalledWith(11, 11, STRUCTURE_CONTAINER);
      expect(mockRoom.createConstructionSite).toHaveBeenCalledWith(6, 5, STRUCTURE_ROAD);
      expect(cache.invalidate).toHaveBeenCalledWith(`construction_sites_${mockRoom.name}`);
    });

    test('危険な敵がいるときセーフモードを発動する', () => {
      const hostile = {
        getActiveBodyparts: jest.fn().mockReturnValue(1),
        pos: { x: 20, y: 20 },
        hits: 50,
        hitsMax: 100,
      };
      cache.getEnemies.mockReturnValue([hostile, hostile, hostile]);
      cache.getLinks.mockReturnValue([]);

      Game.creeps = {};
      Game.time = 10; // SAFE_MODE_CHECK_INTERVAL に合わせる
      roomManager.run(mockRoom);

      expect(mockRoom.controller.activateSafeMode).toHaveBeenCalled();
    });

    test('リンクネットワークで転送を行う', () => {
      mockRoom.controller.pos.getRangeTo.mockReturnValue(3);
      const sinkLink = {
        store: { [RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(800) },
        cooldown: 0,
        pos: { x: 3, y: 3 },
      };
      const sourceLink = {
        store: { [RESOURCE_ENERGY]: 800, getCapacity: jest.fn().mockReturnValue(1000) },
        cooldown: 0,
        pos: { x: 2, y: 2 },
        transferEnergy: jest.fn().mockReturnValue(OK),
      };

      cache.getLinks.mockReturnValue([sourceLink, sinkLink]);
      cache.getSpawns.mockReturnValue([{ pos: { x: 4, y: 4, getRangeTo: jest.fn().mockReturnValue(2) } }]);
      pathfinder.closest.mockReturnValue(sinkLink);

      Game.time = 1;
      roomManager.run(mockRoom);

      expect(sourceLink.transferEnergy).toHaveBeenCalledWith(sinkLink);
    });
  });
});
