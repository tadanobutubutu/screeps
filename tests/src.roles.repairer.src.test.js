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
  getDroppedResources: jest.fn(),
  getContainers: jest.fn(),
  getStorage: jest.fn(),
  assignSource: jest.fn(),
};

jest.mock('../src/utils/cache', () => mockCache, { virtual: true });
jest.mock('../src/utils/pathfinder', () => ({
  moveTo: jest.fn(),
  closest: jest.fn(),
}), { virtual: true });
jest.mock('../src/utils/logger', () => ({ warn: jest.fn() }), { virtual: true });
jest.mock('../src/constants', () => ({
  MEMORY_KEYS: { WORKING: 'working', TARGET_ID: 'targetId', SOURCE_ID: 'sourceId' },
  REPAIR_THRESHOLD: { road: 0.8, container: 0.8, OTHER: 0.9 },
  WALL_HP_TARGET: { 1: 1000, 2: 2000, 3: 3000 },
}), { virtual: true });

const pathfinder = require('../src/utils/pathfinder');
const repairer = require('../src/roles/repairer');

describe('src/roles/repairer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('修理ターゲットに移動してキャッシュする', () => {
    const target = { id: 't1', hits: 10, hitsMax: 100, structureType: global.STRUCTURE_ROAD, pos: { x: 1, y: 1 } };
    const room = {
      controller: { level: 2 },
      find: jest.fn().mockReturnValue([target]),
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
      find: jest.fn().mockReturnValue([wall, road]),
    };

    const count = repairer.countDamagedStructures(room);

    expect(count).toBe(2);
  });

  test('エネルギー取得で落下リソースを拾う', () => {
    mockCache.getDroppedResources.mockReturnValue([{ id: 'r1', resourceType: global.RESOURCE_ENERGY, amount: 50 }]);
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
});
