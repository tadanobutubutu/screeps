/**
 * src/roles/builder.js のユニットテスト
 */

global.Game = {
  getObjectById: jest.fn(),
  rooms: {},
  time: 0,
};
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.WORK = 'work';
global.CARRY = 'carry';
global.MOVE = 'move';
global.FIND_STRUCTURES = 5;
global.STRUCTURE_CONTAINER = 'container';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_STORAGE = 'storage';
global.STRUCTURE_LINK = 'link';
global.STRUCTURE_ROAD = 'road';
global.STRUCTURE_RAMPART = 'rampart';
global.STRUCTURE_WALL = 'wall';
global.ERR_NOT_IN_RANGE = -9;
global.ERR_INVALID_TARGET = -7;
global.OK = 0;

const mockCache = {
  getConstructionSites: jest.fn(),
  getDroppedResources: jest.fn(),
  getContainers: jest.fn(),
  getStorage: jest.fn(),
  assignSource: jest.fn(),
  invalidate: jest.fn(),
};

jest.mock('../src/utils/cache', () => mockCache, { virtual: true });
jest.mock('../src/utils/pathfinder', () => ({
  moveTo: jest.fn(),
  closest: jest.fn(),
}), { virtual: true });
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}), { virtual: true });
jest.mock('../src/constants', () => ({
  MEMORY_KEYS: { WORKING: 'working', TARGET_ID: 'targetId' },
}), { virtual: true });

const pathfinder = require('../src/utils/pathfinder');
const builder = require('../src/roles/builder');

describe('src/roles/builder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.Game.getObjectById.mockReturnValue(null);
  });

  test('建設ターゲットを選択して移動する', () => {
    const containerSite = { id: 's1', structureType: global.STRUCTURE_CONTAINER, progress: 0, progressTotal: 100, pos: { x: 10, y: 10, getRangeTo: jest.fn().mockReturnValue(2) } };
    const roadSite = { id: 's2', structureType: global.STRUCTURE_ROAD, progress: 0, progressTotal: 100, pos: { x: 12, y: 12, getRangeTo: jest.fn().mockReturnValue(3) } };
    mockCache.getConstructionSites.mockReturnValue([roadSite, containerSite]);

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) },
    };

    builder.run(creep);

    expect(creep.memory.targetId).toBe('s1');
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, containerSite, expect.any(Object));
    expect(creep.room.visual.text).toHaveBeenCalled();
  });

  test('無効な建設サイトを検知してキャッシュを削除する', () => {
    const site = { id: 's3', structureType: global.STRUCTURE_EXTENSION, progress: 5, progressTotal: 10, pos: { x: 3, y: 3, getRangeTo: jest.fn().mockReturnValue(1) } };
    mockCache.getConstructionSites.mockReturnValue([site]);
    global.Game.getObjectById.mockReturnValue(site);

    const creep = {
      memory: { working: true, targetId: 's3' },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.ERR_INVALID_TARGET),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(2) },
    };

    builder.run(creep);

    expect(creep.memory.targetId).toBeUndefined();
    expect(mockCache.invalidate).toHaveBeenCalledWith('construction_sites_W0N0');
  });

  test('エネルギー取得で落下リソースを拾う', () => {
    const drop = { id: 'd1', resourceType: global.RESOURCE_ENERGY, amount: 80 };
    mockCache.getDroppedResources.mockReturnValue([drop]);
    pathfinder.closest.mockReturnValue(drop);

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { name: 'W0N0' },
    };

    builder.run(creep);

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, drop, { range: 1 });
  });

  test('getBodyで最適なパーツを返す', () => {
    expect(builder.getBody(900)).toEqual([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]);
    expect(builder.getBody(360)).toEqual([WORK, CARRY, CARRY, MOVE, MOVE]);
  });

  test('getBodyで500エネルギーボディを返す', () => {
    expect(builder.getBody(500)).toEqual([WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
  });

  test('getBodyで350エネルギーボディを返す', () => {
    expect(builder.getBody(350)).toEqual([WORK, CARRY, CARRY, MOVE, MOVE]);
  });

  test('getBodyで最小エネルギーボディを返す', () => {
    expect(builder.getBody(200)).toEqual([WORK, CARRY, MOVE]);
  });

  test('エネルギーが0のときworkingを解除して採掘メッセージを表示する', () => {
    mockCache.getConstructionSites.mockReturnValue([]);
    mockCache.getDroppedResources.mockReturnValue([]);
    mockCache.getContainers.mockReturnValue([]);
    mockCache.getStorage.mockReturnValue(null);
    mockCache.assignSource.mockReturnValue(null);

    const creep = {
      memory: { working: true, targetId: 'old' },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) },
      pickup: jest.fn(),
      withdraw: jest.fn(),
      harvest: jest.fn(),
    };

    builder.run(creep);

    expect(creep.memory.working).toBe(false);
    expect(creep.memory.targetId).toBeUndefined();
    expect(creep.say).toHaveBeenCalledWith('🔄 採掘');
  });

  test('エネルギー満タンのときworkingを設定して建設メッセージを表示する', () => {
    const site = { id: 's4', structureType: global.STRUCTURE_ROAD, progress: 0, progressTotal: 100, pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(1) } };
    mockCache.getConstructionSites.mockReturnValue([site]);

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) },
    };

    builder.run(creep);

    expect(creep.memory.working).toBe(true);
    expect(creep.say).toHaveBeenCalledWith('🔨 建設');
  });

  test('建設成功時にビジュアル表示される', () => {
    const site = { id: 's5', structureType: global.STRUCTURE_ROAD, progress: 50, progressTotal: 100, pos: { x: 5, y: 5, getRangeTo: jest.fn().mockReturnValue(1) } };
    mockCache.getConstructionSites.mockReturnValue([site]);

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      room: { visual: { text: jest.fn() }, name: 'W0N0' },
      pos: { getRangeTo: jest.fn().mockReturnValue(1) },
    };

    builder.run(creep);

    expect(creep.build).toHaveBeenCalledWith(site);
  });

  test('修復バックアップで損傷構造物を修復する', () => {
    const damaged = { id: 'd2', hits: 100, hitsMax: 500, structureType: global.STRUCTURE_ROAD, pos: { x: 3, y: 3 } };
    mockCache.getConstructionSites.mockReturnValue([]);
    const room = {
      find: jest.fn().mockReturnValue([damaged]),
      visual: { text: jest.fn() },
      name: 'W0N0',
      controller: {},
    };
    pathfinder.closest.mockReturnValue(damaged);

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      upgradeController: jest.fn(),
      room,
      pos: { getRangeTo: jest.fn().mockReturnValue(1) },
    };

    builder.run(creep);

    expect(creep.repair).toHaveBeenCalledWith(damaged);
    expect(creep.say).toHaveBeenCalledWith('🔧 修復');
  });

  test('修復対象も建設サイトもないときコントローラーをアップグレードする', () => {
    mockCache.getConstructionSites.mockReturnValue([]);
    const room = {
      find: jest.fn().mockReturnValue([]),
      visual: { text: jest.fn() },
      name: 'W0N0',
      controller: { id: 'ctrl1' },
    };

    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      repair: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room,
      pos: { getRangeTo: jest.fn().mockReturnValue(1) },
    };

    builder.run(creep);

    expect(creep.upgradeController).toHaveBeenCalledWith(room.controller);
    expect(creep.say).toHaveBeenCalledWith('⬆️ 強化');
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
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      pickup: jest.fn(),
      harvest: jest.fn(),
      room: { name: 'W0N0' },
    };

    builder.run(creep);

    expect(creep.withdraw).toHaveBeenCalledWith(container, global.RESOURCE_ENERGY);
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, container, { range: 1 });
  });

  test('ストレージからエネルギーを取得する', () => {
    mockCache.getDroppedResources.mockReturnValue([]);
    mockCache.getContainers.mockReturnValue([]);
    const storage = { store: { [global.RESOURCE_ENERGY]: 1000 } };
    mockCache.getStorage.mockReturnValue(storage);
    mockCache.assignSource.mockReturnValue(null);

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      pickup: jest.fn(),
      harvest: jest.fn(),
      room: { name: 'W0N0' },
    };

    builder.run(creep);

    expect(creep.withdraw).toHaveBeenCalledWith(storage, global.RESOURCE_ENERGY);
  });

  test('ソースから直接採掘する', () => {
    mockCache.getDroppedResources.mockReturnValue([]);
    mockCache.getContainers.mockReturnValue([]);
    mockCache.getStorage.mockReturnValue(null);
    const source = { id: 'src1' };
    mockCache.assignSource.mockReturnValue(source);

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      withdraw: jest.fn(),
      pickup: jest.fn(),
      room: { name: 'W0N0' },
    };

    builder.run(creep);

    expect(creep.harvest).toHaveBeenCalledWith(source);
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, source, { range: 1 });
  });

  test('hasBuildSitesで建設サイトの有無を返す', () => {
    const room = { name: 'W0N0' };
    mockCache.getConstructionSites.mockReturnValue([{ id: 's1' }]);
    expect(builder.hasBuildSites(room)).toBe(true);

    mockCache.getConstructionSites.mockReturnValue([]);
    expect(builder.hasBuildSites(room)).toBe(false);
  });

  test('getTotalBuildProgressで残り建設量を集計する', () => {
    const room = { name: 'W0N0' };
    mockCache.getConstructionSites.mockReturnValue([
      { progress: 30, progressTotal: 100 },
      { progress: 50, progressTotal: 200 },
    ]);

    expect(builder.getTotalBuildProgress(room)).toBe(220);
  });

  test('BUILD_PRIORITYでコンテナが最高優先度を持つ', () => {
    expect(builder.BUILD_PRIORITY[global.STRUCTURE_CONTAINER]).toBe(1);
    expect(builder.BUILD_PRIORITY[global.STRUCTURE_EXTENSION]).toBe(2);
    expect(builder.BUILD_PRIORITY[global.STRUCTURE_SPAWN]).toBe(3);
  });
});
