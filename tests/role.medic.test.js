/**
 * role.medic.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = {};
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_MY_CREEPS = 101;
global.FIND_SOURCES_ACTIVE = 103;
global.RESOURCE_ENERGY = 'energy';
global.WORK = 'work';
global.RoomPosition = function(x, y, roomName) {
  this.x = x;
  this.y = y;
  this.roomName = roomName;
};

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
      rangedHeal: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        name: 'W1N1',
        find: jest.fn().mockReturnValue([]),
        _cacheTick: 0
      },
      pos: {
        x: 1, y: 1,
        isNearTo: jest.fn().mockReturnValue(true),
        inRangeTo: jest.fn().mockReturnValue(true)
      },
      store: {
        [global.RESOURCE_ENERGY]: 0,
        getFreeCapacity: jest.fn().mockReturnValue(50),
      },
      getActiveBodyparts: jest.fn().mockReturnValue(0)
    };
    expect(() => roleMedic.run(creep)).not.toThrow();
  });
});
