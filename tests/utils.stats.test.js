/**
 * utils.stats.js のユニットテスト
 */

global.Game = {
  time: 100,
  creeps: {
    Harvester1: { memory: { role: 'harvester' } },
    Builder1: { memory: { role: 'builder' } },
  },
  rooms: {},
  cpu: { getUsed: jest.fn().mockReturnValue(10) },
};
global.Memory = {};

const StatsManager = require('../utils.stats');

describe('utils.stats', () => {
  beforeEach(() => {
    global.Memory = {};
  });

  test('モジュールが正しく読み込める', () => {
    expect(StatsManager).toBeDefined();
  });

  test('initMemoryでstatsを初期化', () => {
    StatsManager.initMemory();
    expect(global.Memory.stats).toBeDefined();
    expect(global.Memory.stats.totalEnergyProcessed).toBe(0);
  });

  test('recordHarvestで採取エネルギーを記録', () => {
    StatsManager.initMemory();
    StatsManager.recordHarvest(100);
    expect(global.Memory.stats.totalEnergyProcessed).toBe(100);
  });

  test('recordUpgradeでアップグレードを記録', () => {
    StatsManager.initMemory();
    StatsManager.recordUpgrade(50);
    expect(global.Memory.stats.totalEnergyUpgraded).toBe(50);
  });

  test('recordBuildで建築進捗を記録', () => {
    StatsManager.initMemory();
    StatsManager.recordBuild(30);
    expect(global.Memory.stats.totalBuildProgress).toBe(30);
  });

  test('recordRepairで修理を記録', () => {
    StatsManager.initMemory();
    StatsManager.recordRepair(20);
    expect(global.Memory.stats.totalRepairDone).toBe(20);
  });

  test('recordCreepBirthとrecordCreepDeathを記録', () => {
    StatsManager.initMemory();
    StatsManager.recordCreepBirth();
    StatsManager.recordCreepDeath();
    expect(global.Memory.stats.creepsBorn).toBe(1);
    expect(global.Memory.stats.creepDeaths).toBe(1);
  });

  test('getStatsで統計を取得', () => {
    StatsManager.initMemory();
    StatsManager.recordHarvest(100);
    const stats = StatsManager.getStats();
    expect(stats).toBeDefined();
    expect(stats.energyProcessed).toBe(100);
  });

  test('displayStatsで статистикуを表示', () => {
    StatsManager.initMemory();
    const lines = StatsManager.displayStats();
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);
  });

  describe('Security Hardening', () => {
    test('invalid inputs are ignored (NaN, Infinity, negative)', () => {
      StatsManager.initMemory();
      StatsManager.recordHarvest(NaN);
      StatsManager.recordUpgrade(Infinity);
      StatsManager.recordBuild(-100);
      StatsManager.recordRepair('invalid');

      expect(global.Memory.stats.totalEnergyProcessed).toBe(0);
      expect(global.Memory.stats.totalEnergyUpgraded).toBe(0);
      expect(global.Memory.stats.totalBuildProgress).toBe(0);
      expect(global.Memory.stats.totalRepairDone).toBe(0);
    });

    test('recordRoomStat validates room names and keys', () => {
      StatsManager.initMemory();
      StatsManager.recordRoomStat('__proto__', 'energy', 100);
      StatsManager.recordRoomStat('W1N1', 'constructor', 100);

      // Use hasOwnProperty to check if the property was actually set on the object
      expect(Object.prototype.hasOwnProperty.call(global.Memory.stats.roomStats, '__proto__')).toBe(false);
      expect(global.Memory.stats.roomStats['W1N1']).toBeUndefined();
    });

    test('recordRoomStat enforces MAX_ROOM_STATS limit', () => {
      StatsManager.initMemory();
      for (let i = 0; i < 60; i++) {
        StatsManager.recordRoomStat(`Room${i}`, 'energy', 1);
      }
      expect(Object.keys(global.Memory.stats.roomStats).length).toBe(50);
    });

    test('recordRoomStat enforces keys per room limit', () => {
      StatsManager.initMemory();
      for (let i = 0; i < 15; i++) {
        StatsManager.recordRoomStat('W1N1', `key${i}`, 1);
      }
      expect(Object.keys(global.Memory.stats.roomStats['W1N1']).length).toBe(10);
    });

    test('recordRoomStat handles invalid amounts', () => {
      StatsManager.initMemory();
      StatsManager.recordRoomStat('W1N1', 'energy', -50);
      StatsManager.recordRoomStat('W1N1', 'energy', NaN);

      expect(global.Memory.stats.roomStats['W1N1']).toBeUndefined();
    });
  });
});
