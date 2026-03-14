/**
 * role.builder.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_CONSTRUCTION_SITES = 111;
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
  levelUp: jest.fn(),
}), { virtual: true });

const roleBuilder = require('../role.builder');

describe('role.builder', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleBuilder).toBeDefined();
    expect(typeof roleBuilder.run).toBe('function');
  });

  test('run関数がcreepを引数に受け取れる', () => {
    const creep = {
      memory: { building: false },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(50),
        [global.RESOURCE_ENERGY]: 0,
      },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      harvest: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: { find: jest.fn().mockReturnValue([]) },
      pos: { x: 1, y: 1 },
    };
    expect(() => roleBuilder.run(creep)).not.toThrow();
  });

  test('建設サイトがないとき例外を投げない', () => {
    const creep = {
      memory: { building: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(0),
        [global.RESOURCE_ENERGY]: 50,
      },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      harvest: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: { find: jest.fn().mockReturnValue([]) },
      pos: { x: 1, y: 1 },
    };
    expect(() => roleBuilder.run(creep)).not.toThrow();
  });
});
