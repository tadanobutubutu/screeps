/**
 * role.repairer.js のユニットテスト
 */

global.Game = { time: 10 };
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
      pos: { x: 1, y: 1 },
    };
    expect(() => roleRepairer.run(creep)).not.toThrow();
  });
});
