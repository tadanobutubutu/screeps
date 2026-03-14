/**
 * role.scout.js のユニットテスト
 */

global.Game = {
  time: 10,
  map: {
    describeExits: jest.fn().mockReturnValue({ 1: 'W1N1', 3: 'W2N1' }),
  },
};
global.Memory = {};
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_EXIT = 10;
global.TOP = 1;

jest.mock('../gamification', () => ({
  trackAction: jest.fn(),
  addXP: jest.fn(),
}), { virtual: true });

jest.mock('../visual.effects', () => ({
  particles: jest.fn(),
  rainbowTrail: jest.fn(),
}), { virtual: true });

const roleScout = require('../role.scout');

describe('role.scout', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleScout).toBeDefined();
    expect(typeof roleScout.run).toBe('function');
  });

  test('run関数がcreepを受け取って例外を投げない', () => {
    const creep = {
      memory: {},
      say: jest.fn(),
      moveTo: jest.fn(),
      move: jest.fn().mockReturnValue(global.OK),
      room: {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([{ pos: { x: 49, y: 25 } }]),
      },
      pos: { x: 10, y: 10 },
    };
    expect(() => roleScout.run(creep)).not.toThrow();
  });
});
