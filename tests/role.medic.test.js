/**
 * role.medic.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = {};
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_MY_CREEPS = 101;
global.RESOURCE_ENERGY = 'energy';

jest.mock('../gamification', () => ({
  trackAction: jest.fn(),
  addXP: jest.fn(),
}), { virtual: true });

jest.mock('../visual.effects', () => ({
  rainbowTrail: jest.fn(),
  particles: jest.fn(),
}), { virtual: true });

const roleMedic = require('../role.medic');

describe('role.medic', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleMedic).toBeDefined();
    expect(typeof roleMedic.run).toBe('function');
  });

  test('ダメージを受けたcreepがいないとき例外を投げない', () => {
    const creep = {
      memory: {},
      say: jest.fn(),
      heal: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: { find: jest.fn().mockReturnValue([]) },
      pos: { x: 1, y: 1 },
      store: {
        [global.RESOURCE_ENERGY]: 0,
        getFreeCapacity: jest.fn().mockReturnValue(50),
      },
    };
    expect(() => roleMedic.run(creep)).not.toThrow();
  });
});
