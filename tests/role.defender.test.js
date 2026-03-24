/**
 * src/roles/defender.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = {};
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_HOSTILE_CREEPS = 6;
global.ATTACK = 'attack';
global.RANGED_ATTACK = 'ranged_attack';

jest.mock('../utils/cache', () => ({
  getEnemies: jest.fn().mockReturnValue([]),
}), { virtual: true });

const roleDefender = require('../src/roles/defender');

describe('role.defender', () => {
  let mockCreep;

  beforeEach(() => {
    mockCreep = {
      memory: {},
      say: jest.fn(),
      attack: jest.fn().mockReturnValue(OK),
      rangedAttack: jest.fn().mockReturnValue(OK),
      moveTo: jest.fn().mockReturnValue(OK),
      pos: { x: 25, y: 25, getRangeTo: jest.fn().mockReturnValue(5) },
      room: {
        name: 'W1N1',
        controller: {
          pos: { x: 30, y: 30 },
        },
        find: jest.fn().mockReturnValue([]),
      },
      getActiveBodyparts: jest.fn((part) => {
        if (part === ATTACK) return 2;
        if (part === RANGED_ATTACK) return 1;
        return 0;
      }),
    };
  });

  test('モジュールが正しく読み込める', () => {
    expect(roleDefender).toBeDefined();
    expect(typeof roleDefender.run).toBe('function');
  });

  test('敵がいない場合はパトロールする', () => {
    mockCreep.room.find.mockReturnValue([]);

    roleDefender.run(mockCreep);

    // パトロール動作が実行される（エラーが発生しない）
    expect(() => roleDefender.run(mockCreep)).not.toThrow();
  });

  test('敵がいる場合は攻撃する', () => {
    const mockEnemy = {
      id: 'enemy1',
      pos: { x: 27, y: 27 },
      owner: { username: 'Invader' },
    };
    mockCreep.room.find.mockReturnValue([mockEnemy]);
    mockCreep.pos.getRangeTo.mockReturnValue(1);

    roleDefender.run(mockCreep);

    expect(mockCreep.attack).toHaveBeenCalled();
  });

  test('遠距離攻撃可能な場合は遠距離攻撃する', () => {
    const mockEnemy = {
      id: 'enemy1',
      pos: { x: 27, y: 27 },
      owner: { username: 'Invader' },
    };
    mockCreep.room.find.mockReturnValue([mockEnemy]);
    mockCreep.pos.getRangeTo.mockReturnValue(3);

    roleDefender.run(mockCreep);

    expect(mockCreep.rangedAttack).toHaveBeenCalled();
  });
});
