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
});
