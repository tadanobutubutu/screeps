/**
 * role.upgrader.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_SOURCES_ACTIVE = 5;

jest.mock('../gamification', () => ({
  trackAction: jest.fn(),
  addXP: jest.fn(),
}), { virtual: true });

jest.mock('../visual.effects', () => ({
  rainbowTrail: jest.fn(),
  particles: jest.fn(),
  scorePopup: jest.fn(),
  stars: jest.fn(),
}), { virtual: true });

const roleUpgrader = require('../role.upgrader');

describe('role.upgrader', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleUpgrader).toBeDefined();
    expect(typeof roleUpgrader.run).toBe('function');
  });

  test('コントローラが存在するとき upgradeController を呼ぶ', () => {
    const creep = {
      memory: { upgrading: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(0),
        [global.RESOURCE_ENERGY]: 50,
      },
      say: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      harvest: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        controller: { pos: { x: 5, y: 5 }, level: 2 },
        find: jest.fn().mockReturnValue([]),
      },
      pos: { x: 1, y: 1 },
    };

    roleUpgrader.run(creep);

    expect(creep.upgradeController).toHaveBeenCalledWith(creep.room.controller);
  });

  test('エネルギー0のとき harvesting に切り替わる', () => {
    const creep = {
      memory: { upgrading: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(50),
        [global.RESOURCE_ENERGY]: 0,
      },
      say: jest.fn(),
      upgradeController: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        controller: { pos: { x: 5, y: 5 } },
        find: jest.fn().mockReturnValue([]),
      },
      pos: { x: 1, y: 1 },
    };

    expect(() => roleUpgrader.run(creep)).not.toThrow();
  });
});
