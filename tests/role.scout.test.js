/**
 * role.scout.js のユニットテスト
 */

global.Game = { 
  time: 10,
  map: { 
    describeExits: jest.fn(),
    findExit: jest.fn()
  }
};
global.Memory = {};
global.ERR_NO_PATH = -2;
global.FIND_HOSTILE_CREEPS = 10;
global.FIND_DROPPED_RESOURCES = 11;
global.FIND_STRUCTURES = 20;
global.RoomPosition = class { constructor(x, y, roomName) { this.x = x; this.y = y; this.roomName = roomName; } };

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

const roleScout = require('../role.scout');

describe('role.scout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('モジュールが正しく読み込める', () => {
    expect(roleScout).toBeDefined();
    expect(typeof roleScout.run).toBe('function');
  });

  test('出口がないとき何もしない', () => {
    global.Game.map.describeExits.mockReturnValue(null);
    const creep = {
      memory: {},
      room: { name: 'W0N0', findExitTo: jest.fn() },
      say: jest.fn(),
    };

    roleScout.run(creep);
    expect(creep.say).toHaveBeenCalledWith('⚠️');
  });

  test('出口があるときtargetRoomを設定する', () => {
    global.Game.map.describeExits.mockReturnValue({ TOP: 'W0N1', RIGHT: 'W0N2' });
    const creep = {
      memory: {},
      room: { name: 'W0N0', findExitTo: jest.fn() },
      say: jest.fn(),
      moveTo: jest.fn(),
    };

    roleScout.run(creep);
    expect(creep.memory.targetRoom).toBeDefined();
  });

  test('別の部屋のとき移動する', () => {
    global.Game.map.describeExits.mockReturnValue({ TOP: 'W0N1' });
    global.Game.map.findExit.mockReturnValue(1);
    const creep = {
      memory: { targetRoom: 'W0N1' },
      room: { name: 'W0N0', findExitTo: jest.fn().mockReturnValue(1) },
      say: jest.fn(),
      moveTo: jest.fn(),
    };

    roleScout.run(creep);
    expect(creep.moveTo).toHaveBeenCalled();
  });

  test('同じ部屋のときvisitedを記録する', () => {
    global.Game.map.describeExits.mockReturnValue({ TOP: 'W0N1' });
    global.Game.map.findExit.mockReturnValue(1);
    const creep = {
      memory: { targetRoom: 'W0N0', visited: {} },
      room: { 
        name: 'W0N0', 
        findExitTo: jest.fn(),
        find: jest.fn().mockReturnValue([])
      },
      say: jest.fn(),
      moveTo: jest.fn(),
    };

    roleScout.run(creep);
    expect(creep.say).toHaveBeenCalledWith('🔍');
    expect(creep.memory.visited['W0N0']).toBeDefined();
  });
});
