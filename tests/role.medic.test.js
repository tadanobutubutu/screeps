/**
 * role.medic.js のユニットテスト
 */

global.Game = {
  time: 10,
  getObjectById: jest.fn().mockImplementation((id) => {
    if (id === 'creep1') return { id: 'creep1', hits: 50, hitsMax: 100 };
    if (id === 'source1') return { id: 'source1', energy: 1000 };
    return null;
  }),
};
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

global.FIND_MY_CREEPS = 101;
global.FIND_SOURCES_ACTIVE = 103;
global.ERR_NO_PATH = -2;

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
        _cacheTick: 0,
        controller: { pos: { x: 25, y: 25 } },
      },
      pos: {
        x: 1, y: 1,
        isNearTo: jest.fn().mockReturnValue(true),
        inRangeTo: jest.fn().mockReturnValue(true),
        findClosestByRange: jest.fn().mockReturnValue(null),
      },
      store: {
        [global.RESOURCE_ENERGY]: 0,
        getFreeCapacity: jest.fn().mockReturnValue(50),
      },
      getActiveBodyparts: jest.fn().mockReturnValue(0),
    };
    expect(() => roleMedic.run(creep)).not.toThrow();
  });

  test('medicがhealing mode的时候能正常切换', () => {
    const mockFind = jest.fn()
      .mockReturnValueOnce([{ hits: 50, hitsMax: 100 }])  // _myCreeps
      .mockReturnValueOnce([{ hits: 50, hitsMax: 100 }])  // _injuredCreeps
      .mockReturnValueOnce([]);  // sources

    global.Game.time = 10;
    const creep = {
      memory: {},
      say: jest.fn(),
      heal: jest.fn().mockReturnValue(global.OK),
      rangedHeal: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      harvest: jest.fn(),
      room: {
        name: 'W1N1',
        find: mockFind,
        controller: null,
        _myCreepsTick: 0,
        _injuredCreepsTick: 0,
        _activeSourcesTick: 0,
      },
      pos: {
        x: 25, y: 25,
        isNearTo: jest.fn().mockReturnValue(false),
        inRangeTo: jest.fn().mockReturnValue(false),
        findClosestByRange: jest.fn().mockReturnValue(null),
      },
      store: {
        [global.RESOURCE_ENERGY]: 0,
        getFreeCapacity: jest.fn().mockReturnValue(0),
      },
      getActiveBodyparts: jest.fn().mockReturnValue(1),
    };
    expect(() => roleMedic.run(creep)).not.toThrow();
  });

  test('負傷者を治療しターゲットをキャッシュする', () => {
    global.Game.time = 11;
    const injured = { id: 'creep1', hits: 10, hitsMax: 100 };
    const creep = {
      memory: { healing: true },
      say: jest.fn(),
      heal: jest.fn().mockReturnValue(global.OK),
      rangedHeal: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        name: 'W1N1',
        find: jest.fn()
          .mockReturnValueOnce([injured]) // _myCreeps
          .mockReturnValueOnce([injured]) // _injuredCreeps
          .mockReturnValueOnce([]),       // sources
        _myCreepsTick: 0,
        _injuredCreepsTick: 0,
        _activeSourcesTick: 0,
        _injuredCreeps: [injured],
        _activeSources: [],
        controller: { pos: { x: 25, y: 25, roomName: 'W1N1' } },
      },
      pos: {
        isNearTo: jest.fn().mockReturnValue(false),
        inRangeTo: jest.fn().mockReturnValue(false),
        findClosestByRange: jest.fn().mockReturnValue(injured),
        roomName: 'W1N1',
        x: 10,
        y: 10,
      },
      store: { [global.RESOURCE_ENERGY]: 50, getFreeCapacity: jest.fn().mockReturnValue(0) },
      getActiveBodyparts: jest.fn().mockReturnValue(1),
    };

    roleMedic.run(creep);

    expect(creep.memory.healTargetId).toBe('creep1');
    expect(creep.rangedHeal).toHaveBeenCalledWith(injured);
    expect(creep.moveTo).toHaveBeenCalled();
  });

  test('エネルギーを採取していない時も負傷者を回復する', () => {
    global.Game.time = 12;
    const injured = { id: 'creep1', hits: 20, hitsMax: 100 };
    const creep = {
      memory: { healing: false },
      say: jest.fn(),
      heal: jest.fn().mockReturnValue(global.OK),
      rangedHeal: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: {
        name: 'W1N1',
        find: jest.fn()
          .mockReturnValueOnce([injured]) // _myCreeps
          .mockReturnValueOnce([injured]) // _injuredCreeps
          .mockReturnValueOnce([]),       // sources
        _myCreepsTick: 0,
        _injuredCreepsTick: 0,
        _activeSourcesTick: 0,
        _injuredCreeps: [injured],
        _activeSources: [],
      },
      pos: {
        isNearTo: jest.fn().mockReturnValue(true),
        findClosestByRange: jest.fn().mockReturnValue(injured),
      },
      store: {
        [global.RESOURCE_ENERGY]: 20,
        getFreeCapacity: jest.fn().mockReturnValue(10),
      },
      getActiveBodyparts: jest.fn().mockReturnValue(0),
    };

    roleMedic.run(creep);

    expect(creep.heal).toHaveBeenCalledWith(injured);
  });
});
