/**
 * src/roles/harvester.js のユニットテスト
 */

global.Game = { creeps: {} };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.WORK = 'work';
global.CARRY = 'carry';
global.MOVE = 'move';
global.ERR_NOT_IN_RANGE = -9;
global.ERR_FULL = -8;
global.ERR_NOT_ENOUGH_ENERGY = -6;
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_TOWER = 'tower';
global.FIND_MY_STRUCTURES = 11;

const mockCache = {
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
jest.mock('../src/utils/logger', () => ({ warn: jest.fn() }), { virtual: true });
jest.mock('../src/constants', () => ({
  MEMORY_KEYS: { WORKING: 'working', SOURCE_ID: 'sourceId' },
  ROLES: { HARVESTER: 'harvester' },
}), { virtual: true });

const pathfinder = require('../src/utils/pathfinder');
const harvester = require('../src/roles/harvester');

describe('src/roles/harvester', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('落下エネルギーを拾いに移動する', () => {
    const drop = { id: 'drop', resourceType: global.RESOURCE_ENERGY, amount: 100 };
    mockCache.getDroppedResources.mockReturnValue([drop]);
    pathfinder.closest.mockReturnValue(drop);

    const creep = {
      name: 'h1',
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {},
    };

    harvester.run(creep);

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, drop, { range: 1 });
  });

  test('納品先があるとき移動してエネルギーを渡す', () => {
    mockCache.getDroppedResources.mockReturnValue([]);
    const target = { id: 'spawn1', store: { getFreeCapacity: jest.fn().mockReturnValue(10) }, structureType: global.STRUCTURE_SPAWN };
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      transfer: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {
        find: jest.fn().mockReturnValue([target]),
      },
      pos: { x: 0, y: 0 },
    };
    pathfinder.closest.mockReturnValue(target);

    harvester.run(creep);

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, target, { range: 1 });
  });

  test('getBodyで適切な構成を返す', () => {
    expect(harvester.getBody(800)).toEqual([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]);
    expect(harvester.getBody(200)).toEqual([WORK, CARRY, MOVE]);
  });

  test('エネルギー切れで採掘モードに戻る', () => {
    mockCache.getDroppedResources.mockReturnValue([]);
    mockCache.getContainers.mockReturnValue([]);
    mockCache.getStorage.mockReturnValue(null);
    const source = { id: 's1' };
    mockCache.assignSource.mockReturnValue(source);

    const creep = {
      memory: { working: true, sourceId: 'old' },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {},
      pos: {},
    };

    harvester.run(creep);

    expect(creep.memory.working).toBe(false);
    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, source, { range: 1 });
  });

  test('納品先がなくコントローラーをアップグレードする', () => {
    mockCache.getDroppedResources.mockReturnValue([]);
    mockCache.getContainers.mockReturnValue([]);
    mockCache.getStorage.mockReturnValue(null);
    const controller = {};
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      transfer: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: {
        controller,
        find: jest.fn().mockReturnValue([]),
      },
      pos: {},
    };

    harvester.run(creep);

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, controller, { range: 3 });
  });
});
