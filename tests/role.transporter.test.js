/**
 * role.transporter.js のユニットテスト
 */

global.Game = {
  time: 10,
  getObjectById: jest.fn(),
};
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
global.STRUCTURE_LAB = 'lab';

jest.mock('../gamification', () => ({
  trackAction: jest.fn(),
  addXP: jest.fn(),
}), { virtual: true });

jest.mock('../visual.effects', () => ({
  rainbowTrail: jest.fn(),
  particles: jest.fn(),
  scorePopup: jest.fn(),
}), { virtual: true });

global.FIND_STRUCTURES = 107;
global.FIND_DROPPED_RESOURCES = 112;
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_STORAGE = 'storage';
global.STRUCTURE_CONTAINER = 'container';
global.FIND_MY_STRUCTURES = 101;
global.ERR_NOT_ENOUGH_ENERGY = -6;

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

  test('transporter能拾取掉落的资源', () => {
    const droppedEnergy = { id: 'resource1', resourceType: 'energy', amount: 50 };
    const creep = {
      memory: {},
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(50),
        getUsedCapacity: jest.fn().mockReturnValue(0),
        [global.RESOURCE_ENERGY]: 0,
      },
      say: jest.fn(),
      pickup: jest.fn().mockReturnValue(global.OK),
      withdraw: jest.fn(),
      transfer: jest.fn(),
      moveTo: jest.fn(),
      room: {
        find: jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([droppedEnergy]),
      },
      pos: { x: 25, y: 25 },
    };
    expect(() => roleTransporter.run(creep)).not.toThrow();
  });

  test('transporter能运送能量到spawn', () => {
    const spawn = { id: 'spawn1', structureType: 'spawn', store: { energy: 90, getCapacity: () => 100 } };
    const creep = {
      memory: { transporting: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(0),
        getUsedCapacity: jest.fn().mockReturnValue(50),
        [global.RESOURCE_ENERGY]: 50,
      },
      say: jest.fn(),
      pickup: jest.fn(),
      withdraw: jest.fn(),
      transfer: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      pos: {
        x: 1, y: 1,
        findClosestByRange: jest.fn().mockReturnValue(spawn),
      },
      room: {
        find: jest.fn().mockReturnValue([spawn]),
      },
    };
    expect(() => roleTransporter.run(creep)).not.toThrow();
  });

  test('transporter能运送能量到extension', () => {
    const extension = { id: 'ext1', structureType: 'extension', store: { energy: 40, getCapacity: () => 50 } };
    const creep = {
      memory: { transporting: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(0),
        getUsedCapacity: jest.fn().mockReturnValue(50),
        [global.RESOURCE_ENERGY]: 50,
      },
      say: jest.fn(),
      pickup: jest.fn(),
      withdraw: jest.fn(),
      transfer: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      pos: {
        x: 1, y: 1,
        findClosestByRange: jest.fn().mockReturnValue(extension),
      },
      room: {
        find: jest.fn().mockReturnValue([extension]),
      },
    };
    expect(() => roleTransporter.run(creep)).not.toThrow();
  });
});
