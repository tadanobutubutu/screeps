/**
 * role.repairer.js のユニットテスト
 */

global.Game = {
  time: 10,
  getObjectById: jest.fn().mockImplementation((id) => {
    if (id === 'source1') return { id: 'source1', energy: 1000 };
    return null;
  }),
};
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_STRUCTURES = 107;
global.FIND_SOURCES_ACTIVE = 5;

jest.mock('../gamification', () => ({
  trackAction: jest.fn(),
  addXP: jest.fn(),
}), { virtual: true });

jest.mock('../visual.effects', () => ({
  rainbowTrail: jest.fn(),
  particles: jest.fn(),
  scorePopup: jest.fn(),
}), { virtual: true });

global.FIND_STRUCTURES = 107;
global.FIND_SOURCES_ACTIVE = 103;
global.ERR_NOT_ENOUGH_ENERGY = -6;
global.STRUCTURE_ROAD = 'road';
global.STRUCTURE_CONTAINER = 'container';

const roleRepairer = require('../role.repairer');

describe('role.repairer', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleRepairer).toBeDefined();
    expect(typeof roleRepairer.run).toBe('function');
  });

  test('修理対象がないとき例外を投げない', () => {
    const creep = {
      memory: { repairing: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(0),
        [global.RESOURCE_ENERGY]: 50,
      },
      say: jest.fn(),
      repair: jest.fn().mockReturnValue(global.OK),
      harvest: jest.fn().mockReturnValue(global.OK),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        find: jest.fn().mockReturnValue([]),
        controller: { id: 'controller1' },
      },
      pos: {
        x: 1,
        y: 1,
        findClosestByRange: jest.fn().mockReturnValue(null),
      },
    };
    expect(() => roleRepairer.run(creep)).not.toThrow();
  });

  test('repairer能repair道路', () => {
    const damagedRoad = { id: 'road1', hits: 100, hitsMax: 500, structureType: 'road' };
    const creep = {
      memory: { repairing: false },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(0),
        [global.RESOURCE_ENERGY]: 50,
      },
      say: jest.fn(),
      repair: jest.fn().mockReturnValue(global.OK),
      harvest: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        find: jest.fn().mockReturnValue([damagedRoad]),
        controller: { id: 'controller1' },
      },
      pos: { x: 10, y: 10 },
    };
    expect(() => roleRepairer.run(creep)).not.toThrow();
  });
});
