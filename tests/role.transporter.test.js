/**
 * role.transporter.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_STRUCTURES = 107;
global.FIND_DROPPED_RESOURCES = 112;
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_STORAGE = 'storage';
global.STRUCTURE_CONTAINER = 'container';

jest.mock('../gamification', () => ({
  trackAction: jest.fn(),
  addXP: jest.fn(),
}), { virtual: true });

jest.mock('../visual.effects', () => ({
  rainbowTrail: jest.fn(),
  particles: jest.fn(),
  scorePopup: jest.fn(),
}), { virtual: true });

const roleTransporter = require('../role.transporter');

describe('role.transporter', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleTransporter).toBeDefined();
    expect(typeof roleTransporter.run).toBe('function');
  });

  test('run関数が例外を投げない', () => {
    const creep = {
      memory: { transporting: false },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(50),
        getUsedCapacity: jest.fn().mockReturnValue(0),
        [global.RESOURCE_ENERGY]: 0,
      },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.OK),
      withdraw: jest.fn().mockReturnValue(global.OK),
      transfer: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      room: { find: jest.fn().mockReturnValue([]) },
      pos: { x: 1, y: 1 },
    };
    expect(() => roleTransporter.run(creep)).not.toThrow();
  });
});
