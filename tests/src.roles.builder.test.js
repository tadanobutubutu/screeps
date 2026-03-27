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
});
