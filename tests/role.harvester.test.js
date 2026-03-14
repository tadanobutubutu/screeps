/**
 * role.harvester.js のユニットテスト
 * Screepsグローバル (Game, Memory, RESOURCE_ENERGY 等) をモック化
 */

// Screepsグローバルモック
global.Game = {
  time: 10,
};
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_SOURCES_ACTIVE = 5;
global.FIND_STRUCTURES = 107;
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_EXTENSION = 'extension';
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_CONTAINER = 'container';

// 依存モジュールのモック
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

const roleHarvester = require('../role.harvester');

describe('role.harvester', () => {
  let creep;

  beforeEach(() => {
    creep = {
      memory: { harvesting: true },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(50),
        [global.RESOURCE_ENERGY]: 0,
      },
      say: jest.fn(),
      harvest: jest.fn().mockReturnValue(global.OK),
      transfer: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      room: {
        find: jest.fn().mockReturnValue([]),
        controller: { pos: { x: 0, y: 0 } },
      },
      pos: { x: 5, y: 5 },
    };
  });

  test('モジュールが正しく読み込める', () => {
    expect(roleHarvester).toBeDefined();
    expect(typeof roleHarvester.run).toBe('function');
  });

  test('harvesting=trueのとき採取を試みる', () => {
    const source = { pos: { x: 1, y: 1 } };
    creep.room.find.mockReturnValue([source]);
    creep.store.getFreeCapacity.mockReturnValue(50);

    roleHarvester.run(creep);

    expect(creep.harvest).toHaveBeenCalledWith(source);
  });

  test('容量が満タンになったらharvestingをfalseに切り替える', () => {
    creep.memory.harvesting = true;
    creep.store.getFreeCapacity.mockReturnValue(0);

    roleHarvester.run(creep);

    expect(creep.memory.harvesting).toBe(false);
    expect(creep.say).toHaveBeenCalledWith('📦 deliver');
  });

  test('エネルギーが0のとき harvesting=true に切り替える', () => {
    creep.memory.harvesting = false;
    creep.store[global.RESOURCE_ENERGY] = 0;
    creep.store.getFreeCapacity.mockReturnValue(50);

    roleHarvester.run(creep);

    expect(creep.memory.harvesting).toBe(true);
    expect(creep.say).toHaveBeenCalledWith('⚡ harvest');
  });

  test('ERR_NOT_IN_RANGEのとき移動する（採取）', () => {
    const source = { pos: { x: 2, y: 2 } };
    creep.room.find.mockReturnValue([source]);
    creep.harvest.mockReturnValue(global.ERR_NOT_IN_RANGE);
    creep.store.getFreeCapacity.mockReturnValue(50);

    roleHarvester.run(creep);

    expect(creep.moveTo).toHaveBeenCalledWith(source, expect.any(Object));
  });

  test('harvesting=falseのときエネルギーをターゲットに転送する', () => {
    creep.memory.harvesting = false;
    creep.store[global.RESOURCE_ENERGY] = 50;
    creep.store.getFreeCapacity.mockReturnValue(50);
    const target = {
      structureType: global.STRUCTURE_SPAWN,
      store: { getFreeCapacity: jest.fn().mockReturnValue(100) },
      pos: { x: 3, y: 3 },
    };
    creep.room.find.mockReturnValue([target]);

    roleHarvester.run(creep);

    expect(creep.transfer).toHaveBeenCalledWith(target, global.RESOURCE_ENERGY);
  });
});
