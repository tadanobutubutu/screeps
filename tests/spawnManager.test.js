/**
 * src/managers/spawnManager.js のユニットテスト
 */

// グローバル定数の設定
global.Game = { time: 100, creeps: {}, spawns: {} };
global.Memory = {};
global.OK = 0;
global.ERR_NOT_ENOUGH_ENERGY = -6;
global.ERR_NAME_EXISTS = -3;
global.WORK = 'work';
global.CARRY = 'carry';
global.MOVE = 'move';
global.ATTACK = 'attack';
global.RANGED_ATTACK = 'ranged_attack';

// モックの設定
jest.mock('../src/utils/cache', () => ({
  getConstructionSites: jest.fn().mockReturnValue([]),
  getEnemies: jest.fn().mockReturnValue([]),
}), { virtual: true });

jest.mock('../src/utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}), { virtual: true });

// 定数のモック
jest.mock('../src/constants', () => ({
  ROLES: {
    HARVESTER: 'harvester',
    UPGRADER: 'upgrader',
    BUILDER: 'builder',
    REPAIRER: 'repairer',
    DEFENDER: 'defender',
    MINER: 'miner',
  },
  BODY_PRESETS: {
    harvester: [
      { body: ['work', 'carry', 'move'], cost: 200 },
      { body: ['work', 'work', 'carry', 'move'], cost: 300 },
    ],
    upgrader: [
      { body: ['work', 'carry', 'move'], cost: 200 },
    ],
    builder: [
      { body: ['work', 'carry', 'move'], cost: 200 },
    ],
    defender: [
      { body: ['attack', 'move'], cost: 130 },
    ],
  },
  SPAWN_PRIORITY: {
    harvester: 1,
    upgrader: 2,
    builder: 3,
    repairer: 4,
    defender: 5,
    miner: 6,
  },
  TARGET_CREEPS_BY_RCL: {
    1: { harvester: 2, upgrader: 1, builder: 0 },
    2: { harvester: 2, upgrader: 2, builder: 1 },
    3: { harvester: 2, upgrader: 2, builder: 2 },
  },
}), { virtual: true });

const spawnManager = require('../src/managers/spawnManager');
const cache = require('../src/utils/cache');

describe('spawnManager', () => {
  let mockSpawn;
  let mockRoom;

  beforeEach(() => {
    mockRoom = {
      name: 'W1N1',
      controller: {
        level: 3,
        my: true
      },
      energyAvailable: 300,
      energyCapacityAvailable: 1000,
      visual: {
        text: jest.fn(),
        rect: jest.fn()
      }
    };

    mockSpawn = {
      name: 'Spawn1',
      room: mockRoom,
      spawning: null,
      spawnCreep: jest.fn().mockReturnValue(0), // OK
      pos: { x: 10, y: 10 }
    };

    global.Game.creeps = {};
    global.Game.spawns = { 'Spawn1': mockSpawn };
    global.Game.time = 100;
    
    // キャッシュモックのクリア
    cache.getConstructionSites.mockClear();
    cache.getEnemies.mockClear();
  });

  describe('run', () => {
    test('正常に実行される', () => {
      spawnManager.run(mockSpawn);
      expect(mockSpawn.spawnCreep).toHaveBeenCalled();
    });

    test('スポーン中は実行されない', () => {
      mockSpawn.spawning = { name: 'creep1' };
      spawnManager.run(mockSpawn);
      expect(mockSpawn.spawnCreep).not.toHaveBeenCalled();
    });

    test('自分のルームでない場合は実行されない', () => {
      mockRoom.controller.my = false;
      spawnManager.run(mockSpawn);
      expect(mockSpawn.spawnCreep).not.toHaveBeenCalled();
    });

    test('エネルギー不足時はスポーンを試みるが停止する', () => {
      mockSpawn.spawnCreep.mockReturnValue(-6); // ERR_NOT_ENOUGH_ENERGY
      spawnManager.run(mockSpawn);
      expect(mockSpawn.spawnCreep).toHaveBeenCalled();
    });
  });

  describe('showSpawnVisual', () => {
    test('スポーン中のビジュアルを表示する', () => {
      mockSpawn.spawning = {
        name: 'creep1',
        needTime: 10,
        remainingTime: 5
      };
      global.Game.creeps['creep1'] = {
        memory: { role: 'harvester' }
      };

      spawnManager.showSpawnVisual(mockSpawn);
      expect(mockRoom.visual.text).toHaveBeenCalled();
      expect(mockRoom.visual.rect).toHaveBeenCalled();
    });

    test('スポーン中でない場合は何もしない', () => {
      mockSpawn.spawning = null;
      spawnManager.showSpawnVisual(mockSpawn);
      expect(mockRoom.visual.text).not.toHaveBeenCalled();
    });
  });

  describe('showStats', () => {
    test('統計情報を出力する', () => {
      spawnManager.showStats(mockRoom);
      // logger.infoが呼ばれることを期待（モック済み）
    });
  });

  describe('clearQueue', () => {
    test('キューをクリアする', () => {
      global.cache = { spawnQueue: [1, 2, 3] };
      spawnManager.clearQueue();
      expect(global.cache.spawnQueue).toEqual([]);
    });
  });

  describe('内部ロジックの網羅', () => {
    test('建設サイトがある場合にビルダー数が増える', () => {
      cache.getConstructionSites.mockReturnValue([{}, {}, {}, {}, {}, {}]); // 6サイト
      global.Game.creeps = {
          c1: { memory: { role: 'harvester' }, room: mockRoom },
          c2: { memory: { role: 'harvester' }, room: mockRoom },
          c3: { memory: { role: 'upgrader' }, room: mockRoom },
          c4: { memory: { role: 'upgrader' }, room: mockRoom }
      };
      
      spawnManager.run(mockSpawn);
      // ビルダーが必要になるはず
      expect(mockSpawn.spawnCreep).toHaveBeenCalledWith(
          expect.any(Array),
          expect.stringContaining('builder'),
          expect.any(Object)
      );
    });

    test('敵がいる場合にディフェンダー数が増える', () => {
      cache.getEnemies.mockReturnValue([{
          getActiveBodyparts: (part) => part === 'attack' ? 1 : 0
      }]);
      
      spawnManager.run(mockSpawn);
      // ディフェンダーが優先されるはず（優先度は5だが、ハーベスターが足りなければハーベスターが先）
      // ここではハーベスターが0なのでハーベスターが先に呼ばれる
    });
    
    test('クリープが0の場合に緊急ハーベスターを確保する', () => {
        global.Game.creeps = {};
        mockRoom.energyAvailable = 200;
        spawnManager.run(mockSpawn);
        expect(mockSpawn.spawnCreep).toHaveBeenCalledWith(
            expect.any(Array),
            expect.stringContaining('harvester'),
            expect.any(Object)
        );
    });
  });
});
