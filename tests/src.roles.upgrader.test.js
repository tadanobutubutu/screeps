/**
 * src/roles/upgrader.js のユニットテスト
 */

global.Game = { creeps: {} };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.WORK = 'work';
global.CARRY = 'carry';
global.MOVE = 'move';
global.ERR_NOT_IN_RANGE = -9;
global.OK = 0;

const mockCache = {
  getStorage: jest.fn(),
  getLinks: jest.fn(),
  getContainers: jest.fn(),
  getDroppedResources: jest.fn(),
  assignSource: jest.fn(),
};

jest.mock('../src/utils/cache', () => mockCache, { virtual: true });
jest.mock('../src/utils/pathfinder', () => ({
  moveTo: jest.fn(),
  closest: jest.fn(),
}), { virtual: true });
jest.mock('../src/utils/logger', () => ({ warn: jest.fn() }), { virtual: true });
jest.mock('../src/constants', () => ({
  MEMORY_KEYS: { WORKING: 'working', SOURCE_ID: 'sourceId' },
}), { virtual: true });

const pathfinder = require('../src/utils/pathfinder');
const upgrader = require('../src/roles/upgrader');

describe('src/roles/upgrader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ストレージからエネルギーを取得する', () => {
    const storage = { id: 'store', store: { [global.RESOURCE_ENERGY]: 2000 }, pos: { x: 1, y: 1 } };
    mockCache.getStorage.mockReturnValue(storage);

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller: { id: 'c1' } },
    };

    upgrader.run(creep);

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, storage, { range: 1 });
  });

  test('コントローラーを強化する際に移動する', () => {
    mockCache.getStorage.mockReturnValue(null);
    mockCache.getLinks.mockReturnValue([]);
    mockCache.getContainers.mockReturnValue([]);
    mockCache.getDroppedResources.mockReturnValue([]);
    mockCache.assignSource.mockReturnValue(null);

    const controller = { id: 'c2', level: 2 };
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 50, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller },
    };

    upgrader.run(creep);

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, controller, { range: 3 });
  });

  test('リンクからエネルギーを取得する', () => {
    mockCache.getStorage.mockReturnValue(null);
    const link = { store: { [global.RESOURCE_ENERGY]: 300 }, pos: { x: 3, y: 3 } };
    mockCache.getLinks.mockReturnValue([link]);
    mockCache.getContainers.mockReturnValue([]);
    mockCache.getDroppedResources.mockReturnValue([]);
    mockCache.assignSource.mockReturnValue(null);
    pathfinder.closest.mockReturnValue(link);

    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller: {} },
    };

    upgrader.run(creep);

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, link, { range: 1 });
  });

  test('コントローラー近くのコンテナから取得する', () => {
    mockCache.getStorage.mockReturnValue(null);
    mockCache.getLinks.mockReturnValue([]);
    mockCache.getDroppedResources.mockReturnValue([]);
    const container = { store: { [global.RESOURCE_ENERGY]: 150 }, pos: { getRangeTo: jest.fn().mockReturnValue(2) } };
    mockCache.getContainers.mockReturnValue([container]);
    mockCache.assignSource.mockReturnValue(null);
    pathfinder.closest.mockReturnValue(container);

    const controller = {};
    const creep = {
      memory: { working: false },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      withdraw: jest.fn().mockReturnValue(global.ERR_NOT_IN_RANGE),
      room: { controller },
    };

    upgrader.run(creep);

    expect(pathfinder.moveTo).toHaveBeenCalledWith(creep, container, { range: 1 });
  });

  test('レベル8のアップグレードでメッセージを表示する', () => {
    const controller = { id: 'c3', level: 8 };
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 20, getCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      room: { controller },
    };

    upgrader.run(creep);

    expect(creep.say).toHaveBeenCalled();
  });

  test('エネルギーが空のときworkingを解除する', () => {
    mockCache.getStorage.mockReturnValue(null);
    mockCache.getLinks.mockReturnValue([]);
    mockCache.getContainers.mockReturnValue([]);
    mockCache.getDroppedResources.mockReturnValue([]);
    mockCache.assignSource.mockReturnValue(null);
    const creep = {
      memory: { working: true },
      store: { [global.RESOURCE_ENERGY]: 0, getCapacity: jest.fn().mockReturnValue(100) },
      say: jest.fn(),
      room: { controller: {} },
      upgradeController: jest.fn(),
      withdraw: jest.fn(),
      harvest: jest.fn(),
    };

    upgrader.run(creep);

    expect(creep.memory.working).toBe(false);
  });

  test('showVisualsでビジュアルを描画する', () => {
    const controller = { level: 3, progress: 50, progressTotal: 100, pos: { x: 10, y: 10 } };
    const room = { controller, visual: { text: jest.fn() } };
    const creep = { room };

    upgrader.showVisuals(creep);

    expect(room.visual.text).toHaveBeenCalled();
  });

  test('getBodyでエネルギーに応じた構成を返す', () => {
    expect(upgrader.getBody(1400)).toContain(WORK);
    expect(upgrader.getBody(250)).toEqual([WORK, CARRY, MOVE]);
  });
});
