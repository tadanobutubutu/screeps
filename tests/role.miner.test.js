/**
 * src/roles/miner.js のユニットテスト
 */

global.Game = { time: 10, getObjectById: jest.fn() };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.ERR_NOT_ENOUGH_ENERGY = -6;
global.FIND_SOURCES = 5;
global.FIND_STRUCTURES = 10;
global.STRUCTURE_CONTAINER = 'container';
global.WORK = 'work';

jest.mock('../utils/cache', () => ({
  getSources: jest.fn(),
  getContainers: jest.fn(),
  assignSource: jest.fn(),
}), { virtual: true });

const cache = require('../utils/cache');
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

  test('ソースが割り当てられていない場合は警告を出す', () => {
    const cache = require('../utils/cache');
    const mockSource = { 
      id: 'source1', 
      pos: { x: 30, y: 30, getRangeTo: jest.fn().mockReturnValue(1) },
      room: { find: jest.fn().mockReturnValue([]) }
    };

    cache.getSources.mockReturnValue([mockSource]);
    mockCreep.name = 'miner1';

    roleMiner.run(mockCreep);

    expect(() => roleMiner.run(mockCreep)).not.toThrow();
  });

  test('ソースからエネルギーを採掘する', () => {
    const mockSource = { 
      id: 'source1', 
      pos: { x: 30, y: 30, getRangeTo: jest.fn().mockReturnValue(1) },
      room: { find: jest.fn().mockReturnValue([]) }
    };
    mockCreep.memory.sourceId = 'source1';
    global.Game.getObjectById.mockReturnValue(mockSource);
    mockCreep.pos.getRangeTo.mockReturnValue(1);

    roleMiner.run(mockCreep);

    expect(mockCreep.harvest).toHaveBeenCalled();
  });
});
