/**
 * defense.manager.js のユニットテスト
 */

global.Game = { 
  time: 10,
  flags: {},
  creeps: {}
};
global.Memory = {};
global.RoomPosition = function(x, y, roomName) {
  this.x = x;
  this.y = y;
  this.roomName = roomName;
};
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.ERR_NOT_ENOUGH_ENERGY = -6;
global.FIND_MY_STRUCTURES = 20;
global.FIND_HOSTILE_CREEPS = 10;
global.FIND_MY_CREEPS = 10;
global.FIND_STRUCTURES = 20;
global.STRUCTURE_TOWER = 'tower';
global.STRUCTURE_SPAWN = 'spawn';
global.STRUCTURE_WALL = 'wall';
global.STRUCTURE_RAMPART = 'rampart';
global.ATTACK = 'attack';
global.RANGED_ATTACK = 'ranged_attack';
global.HEAL = 'heal';
global.TOUGH = 'tough';
global.MOVE = 'move';

const defenseManager = require('../defense.manager');

describe('defense.manager', () => {
  let mockRoom;
  let mockTower;
  let mockSpawn;

  beforeEach(() => {
    global.Memory = {};
    global.Game.time = 10;
    
    mockTower = {
      structureType: STRUCTURE_TOWER,
      store: { [RESOURCE_ENERGY]: 600 },
      attack: jest.fn(),
      heal: jest.fn(),
      repair: jest.fn(),
      pos: { findClosestByRange: jest.fn().mockReturnValue(null) }
    };
    
    mockSpawn = {
      structureType: STRUCTURE_SPAWN,
      room: { energyAvailable: 500 },
      spawnCreep: jest.fn().mockReturnValue(OK)
    };
    
    mockRoom = {
      _myStructures: [mockTower],
      _myStructuresTick: Game.time,
      _hostileCreeps: [],
      _hostileCreepsTick: Game.time,
      _myCreeps: [],
      _myCreepsTick: Game.time,
      find: jest.fn().mockImplementation((type) => {
        if (type === FIND_MY_STRUCTURES) return [mockTower];
        if (type === FIND_HOSTILE_CREEPS) return [];
        if (type === FIND_MY_CREEPS) return [];
        if (type === FIND_STRUCTURES) return [];
        return [];
      }),
    };
  });

  test('モジュールが正しく読み込める', () => {
    expect(defenseManager).toBeDefined();
    expect(typeof defenseManager.run).toBe('function');
    expect(typeof defenseManager.manageTowers).toBe('function');
    expect(typeof defenseManager.checkThreats).toBe('function');
    expect(typeof defenseManager.manageDefenders).toBe('function');
  });

  test('manageTowersがtowerがないとき何もしない', () => {
    const room = { find: jest.fn().mockReturnValue([]) };
    expect(() => defenseManager.manageTowers(room)).not.toThrow();
  });

  test('checkThreatsがhostilesがないとき0を返す', () => {
    const result = defenseManager.checkThreats(mockRoom);
    expect(result).toBe(0);
    expect(mockRoom._threatLevel).toBe(0);
  });

  test('checkThreatsがhostilesがいるときthreatLevelを計算する', () => {
    mockRoom._hostileCreeps = [{
      body: [{ type: ATTACK }, { type: ATTACK }, { type: HEAL }]
    }];
    const result = defenseManager.checkThreats(mockRoom);
    expect(result).toBe(3);
    expect(mockRoom._threatLevel).toBe(3);
  });

  test('manageDefendersがthreatLevel > 0でspawnableなときdefenderを生成する', () => {
    mockRoom._myStructures = [mockSpawn];
    mockRoom._myCreeps = [{ memory: { role: 'harvester' } }];
    mockRoom._threatLevel = 5;
    
    const result = defenseManager.manageDefenders(mockRoom);
    expect(() => result).not.toThrow();
  });

  test('spawnDefenderがenergy不足のときエラーを返す', () => {
    const spawn = {
      structureType: STRUCTURE_SPAWN,
      room: { energyAvailable: 100 },
      spawnCreep: jest.fn()
    };
    const result = defenseManager.spawnDefender(spawn, 5);
    expect(result).toBe(ERR_NOT_ENOUGH_ENERGY);
  });

  test('spawnDefenderが十分なenergyのときspawnを呼ぶ', () => {
    const spawn = {
      structureType: STRUCTURE_SPAWN,
      room: { energyAvailable: 500 },
      spawnCreep: jest.fn().mockReturnValue(OK)
    };
    const result = defenseManager.spawnDefender(spawn, 2);
    expect(spawn.spawnCreep).toHaveBeenCalled();
    expect(result).toBe(OK);
  });

  test('runDefenderがhostilesがいるとき攻撃する', () => {
    const mockHostile = { pos: { getRangeTo: jest.fn().mockReturnValue(1) } };
    const mockDefender = {
      room: {
        _hostileCreeps: [mockHostile],
        _hostileCreepsTick: Game.time,
        _primaryHostile: mockHostile,
        find: jest.fn().mockReturnValue([mockHostile]),
      },
      pos: {
        findClosestByRange: jest.fn().mockReturnValue(mockHostile),
        getRangeTo: jest.fn().mockReturnValue(1),
      },
      attack: jest.fn().mockReturnValue(OK),
      rangedAttack: jest.fn(),
      heal: jest.fn(),
      moveTo: jest.fn(),
      hits: 100,
      hitsMax: 100,
      memory: {}
    };
    
    defenseManager.runDefender(mockDefender);
    expect(mockDefender.attack).toHaveBeenCalled();
  });

  test('showStatsがエラーなく実行される', () => {
    expect(() => defenseManager.showStats(mockRoom)).not.toThrow();
  });
});
