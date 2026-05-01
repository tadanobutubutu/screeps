/**
 * src/utils/cache.js のユニットテスト
 */

// グローバル設定
global.Game = { time: 100 };
global.FIND_SOURCES = 5;
global.FIND_STRUCTURES = 10;
global.FIND_MY_STRUCTURES = 11;
global.FIND_CONSTRUCTION_SITES = 14;
global.FIND_HOSTILE_CREEPS = 6;
global.FIND_DROPPED_RESOURCES = 7;
global.FIND_MY_SPAWNS = 8;
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_LINK = 'link';
global.RESOURCE_ENERGY = 'energy';

// モック定数をロードする前にグローバル設定
jest.mock('../src/constants', () => ({
  CACHE_TTL: {
    SOURCES: 100,
    STRUCTURES: 50,
    ENEMIES: 5,
    CONSTRUCTION_SITES: 20,
    DROPPED_RESOURCES: 3,
    ROOM_OBJECTS: 30,
  },
}), { virtual: true });

const cache = require('../src/utils/cache');

describe('cache', () => {
  beforeEach(() => {
    // キャッシュをクリア
    global.cache = {};
    global.Game.time = 100;
  });

  describe('get', () => {
    test('初回呼び出しでfetcherが実行される', () => {
      const fetcher = jest.fn().mockReturnValue('data');
      const result = cache.get('test_key', fetcher, 10);

      expect(fetcher).toHaveBeenCalled();
      expect(result).toBe('data');
    });

    test('TTL内の再呼び出しではキャッシュが返される', () => {
      const fetcher = jest.fn().mockReturnValue('data');

      cache.get('test_key', fetcher, 10);
      const result = cache.get('test_key', fetcher, 10);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result).toBe('data');
    });

    test('TTL経過後はfetcherが再実行される', () => {
      const fetcher = jest.fn().mockReturnValue('data');

      cache.get('test_key', fetcher, 10);
      global.Game.time += 20;
      cache.get('test_key', fetcher, 10);

      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    test('有効期限ジャストの場合はfetcherが再実行される', () => {
      const fetcher = jest.fn().mockReturnValue('data');

      cache.get('test_key', fetcher, 10);
      global.Game.time += 10;
      cache.get('test_key', fetcher, 10);

      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  describe('invalidate', () => {
    test('指定したキーのキャッシュを無効化する', () => {
      const fetcher = jest.fn().mockReturnValue('data');

      cache.get('test_key', fetcher, 10);
      cache.invalidate('test_key');
      cache.get('test_key', fetcher, 10);

      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  describe('invalidatePattern', () => {
    test('パターンに一致するキャッシュを無効化する', () => {
      const fetcher1 = jest.fn().mockReturnValue('data1');
      const fetcher2 = jest.fn().mockReturnValue('data2');

      cache.get('room_W1N1', fetcher1, 10);
      cache.get('room_W1N2', fetcher2, 10);
      cache.get('other_key', jest.fn().mockReturnValue('data3'), 10);

      cache.invalidatePattern(/^room_/);

      cache.get('room_W1N1', fetcher1, 10);
      cache.get('room_W1N2', fetcher2, 10);

      expect(fetcher1).toHaveBeenCalledTimes(2);
      expect(fetcher2).toHaveBeenCalledTimes(2);
    });
  });

  describe('cleanup', () => {
    test('期限切れキャッシュを削除する', () => {
      cache.get('key1', () => 'data1', 5);
      cache.get('key2', () => 'data2', 50);

      global.Game.time += 10;
      const removed = cache.cleanup();

      expect(removed).toBeGreaterThan(0);
    });

    test('有効期限ジャストのキャッシュを削除する', () => {
      cache.get('key1', () => 'data1', 10);
      global.Game.time += 10;
      const removed = cache.cleanup();

      expect(removed).toBe(1);
    });

    test('不正なexpiresプロパティを持つキャッシュは無視する', () => {
      cache.get('key1', () => 'data1', 10);
      global.cache['key1'].expires = 'invalid';

      const removed = cache.cleanup();
      expect(removed).toBe(0);
    });
  });

  describe('getStats', () => {
    test('キャッシュ統計を返す', () => {
      cache.get('key1', () => 'data1', 10);
      cache.get('key2', () => 'data2', 10);

      const stats = cache.getStats();

      expect(stats.total).toBe(2);
      expect(stats.active).toBeGreaterThanOrEqual(0);
      expect(stats.expired).toBeGreaterThanOrEqual(0);
    });

    test('有効期限ジャストのキャッシュを期限切れとしてカウントする', () => {
      cache.get('key1', () => 'data1', 10);
      global.Game.time += 10;

      const stats = cache.getStats();

      expect(stats.total).toBe(1);
      expect(stats.expired).toBe(1);
      expect(stats.active).toBe(0);
    });
  });

  describe('getSources', () => {
    test('ルーム内のソースを取得する', () => {
      const mockRoom = {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([{ id: 'source1' }, { id: 'source2' }]),
      };

      const sources = cache.getSources(mockRoom);

      expect(sources.length).toBe(2);
      expect(mockRoom.find).toHaveBeenCalledWith(FIND_SOURCES);
    });
  });

  describe('getStructures', () => {
    test('ルーム内のすべての構造物を取得する', () => {
      const mockRoom = {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([{ structureType: 'spawn' }]),
      };

      const structures = cache.getStructures(mockRoom);

      expect(structures.length).toBeGreaterThan(0);
      expect(mockRoom.find).toHaveBeenCalledWith(FIND_STRUCTURES);
    });
  });

  describe('getMyStructures', () => {
    test('自分の構造物をフィルタ付きで取得する', () => {
      const mockRoom = {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([{ structureType: 'spawn' }]),
      };

      const structures = cache.getMyStructures(mockRoom, 'spawn');

      expect(mockRoom.find).toHaveBeenCalled();
    });
  });

  describe('getConstructionSites', () => {
    test('建設サイトを取得する', () => {
      const mockRoom = {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([{ structureType: 'extension' }]),
      };

      const sites = cache.getConstructionSites(mockRoom);

      expect(mockRoom.find).toHaveBeenCalledWith(FIND_CONSTRUCTION_SITES);
    });
  });

  describe('getEnemies', () => {
    test('敵クリープを取得する', () => {
      const mockRoom = {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([{ owner: { username: 'enemy' } }]),
      };

      const enemies = cache.getEnemies(mockRoom);

      expect(mockRoom.find).toHaveBeenCalledWith(FIND_HOSTILE_CREEPS);
    });
  });

  describe('assignSource', () => {
    test('クリープにソースを割り当てる', () => {
      global.Game.creeps = {};
      global.Game.getObjectById = jest.fn();

      const mockCreep = {
        memory: {},
      };
      const mockRoom = {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([{ id: 'source1' }]),
      };

      const source = cache.assignSource(mockCreep, mockRoom);

      expect(mockCreep.memory.sourceId).toBeDefined();
    });

    test('既存の割り当てがある場合はそれを返す', () => {
      const mockSource = { id: 'source1' };
      global.Game.getObjectById = jest.fn().mockReturnValue(mockSource);

      const mockCreep = {
        memory: { sourceId: 'source1' },
      };
      const mockRoom = {
        name: 'W1N1',
        find: jest.fn(),
      };

      const source = cache.assignSource(mockCreep, mockRoom);

      expect(source).toBe(mockSource);
      expect(mockRoom.find).not.toHaveBeenCalled();
    });
  });
});
