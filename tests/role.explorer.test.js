/**
 * role.explorer.js のユニットテスト
 */

global.Game = {
  time: 10,
  map: {
    describeExits: jest.fn().mockReturnValue({}),
  },
};
global.Memory = { rooms: {} };
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.RESOURCE_ENERGY = 'energy';
global.FIND_EXIT = 10;

jest.mock('../gamification', () => ({
  trackAction: jest.fn(),
  addXP: jest.fn(),
}), { virtual: true });

jest.mock('../visual.effects', () => ({
  particles: jest.fn(),
  rainbowTrail: jest.fn(),
  scorePopup: jest.fn(),
}), { virtual: true });

const roleExplorer = require('../role.explorer');

describe('role.explorer', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleExplorer).toBeDefined();
    expect(typeof roleExplorer.run).toBe('function');
  });

  test('run関数が例外を投げない', () => {
    const creep = {
      memory: { exploring: true },
      say: jest.fn(),
      moveTo: jest.fn(),
      room: {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([]),
      },
      pos: { x: 5, y: 5 },
      store: {
        [global.RESOURCE_ENERGY]: 0,
        getFreeCapacity: jest.fn().mockReturnValue(50),
      },
    };
    expect(() => roleExplorer.run(creep)).not.toThrow();
  });
});
