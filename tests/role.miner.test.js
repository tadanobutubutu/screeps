/**
 * src/roles/miner.js のユニットテスト
 */

global.Game = { time: 10, getObjectById: jest.fn() };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_SOURCES = 5;
global.STRUCTURE_CONTAINER = 'container';

jest.mock('../utils/cache', () => ({
  getSources: jest.fn().mockReturnValue([]),
  getContainers: jest.fn().mockReturnValue([]),
  assignSource: jest.fn(),
}), { virtual: true });

const roleMiner = require('../src/roles/miner');

describe('role.miner', () => {
  let mockCreep;

  beforeEach(() => {
    mockCreep = {
      memory: {},
      store: {
        [global.RESOURCE_ENERGY]: 0,
        getFreeCapacity: jest.fn().mockReturnValue(50),
      },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(OK),
      transfer: jest.fn().mockReturnValue(OK),
      moveTo: jest.fn().mockReturnValue(OK),
      pos: { x: 25, y: 25, getRangeTo: jest.fn().mockReturnValue(5) },
      room: {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([]),
      },
    };
  });

  test('モジュールが正しく読み込める', () => {
    expect(roleMiner).toBeDefined();
    expect(typeof roleMiner.run).toBe('function');
  });

  test('ソースが割り当てられていない場合は割り当てる', () => {
    const cache = require('../utils/cache');
    const mockSource = { id: 'source1', pos: { x: 30, y: 30 } };

    cache.assignSource.mockReturnValue(mockSource);
    cache.getSources.mockReturnValue([mockSource]);

    roleMiner.run(mockCreep);

    expect(cache.assignSource).toHaveBeenCalled();
  });

  test('ソースからエネルギーを採掘する', () => {
    const mockSource = { id: 'source1', pos: { x: 30, y: 30 } };
    mockCreep.memory.sourceId = 'source1';
    global.Game.getObjectById.mockReturnValue(mockSource);

    roleMiner.run(mockCreep);

    expect(mockCreep.harvest).toHaveBeenCalled();
  });
});
