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
global.RoomPosition = class {
  constructor(x, y, roomName) {
    this.x = x;
    this.y = y;
    this.roomName = roomName;
  }
};

jest.mock('../gamification', () => ({
  trackAction: jest.fn(),
  addXP: jest.fn(),
}), { virtual: true });

jest.mock('../visual.effects', () => ({
  particles: jest.fn(),
  rainbowTrail: jest.fn(),
  scorePopup: jest.fn(),
}), { virtual: true });

global.ERR_NO_PATH = -2;
global.ERR_INVALID_ARGS = -10;

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

  test('creepがexitがない房间stay in current room', () => {
    global.Game.map.describeExits.mockReturnValue(null);
    const creep = {
      memory: {},
      say: jest.fn(),
      moveTo: jest.fn(),
      room: { name: 'W1N1' },
      pos: { x: 5, y: 5 },
      store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
    };
    expect(() => roleExplorer.run(creep)).not.toThrow();
    expect(creep.say).toHaveBeenCalledWith('🤔 No exits');
  });

  test('creepがcannot find exit的时候reset target', () => {
    global.Game.map.describeExits.mockReturnValue({ top: 'W0N1' });
    const creep = {
      memory: { targetRoom: 'W0N1' },
      say: jest.fn(),
      moveTo: jest.fn().mockReturnValue(global.ERR_NO_PATH),
      room: {
        name: 'W1N1',
      },
      pos: { x: 5, y: 5 },
      store: { getFreeCapacity: jest.fn().mockReturnValue(50) },
    };
    expect(() => roleExplorer.run(creep)).not.toThrow();
    expect(creep.say).toHaveBeenCalledWith('❌ No path');
    expect(creep.moveTo).toHaveBeenCalledWith(
      expect.objectContaining({ x: 25, y: 25, roomName: 'W0N1' }),
      expect.any(Object)
    );
  });
});
