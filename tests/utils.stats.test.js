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
global.Memory = { stats: {} };

const utilsStats = require('../utils.stats');

describe('utils.stats', () => {
  test('モジュールが正しく読み込める', () => {
    expect(utilsStats).toBeDefined();
  });

  test('エクスポートされた関数が少なくとも1つある', () => {
    const keys = Object.keys(utilsStats);
    expect(keys.length).toBeGreaterThan(0);
  });

  test('collect/record系関数が存在すれば呼び出せる', () => {
    const fnNames = ['collect', 'record', 'update', 'init', 'report'];
    for (const name of fnNames) {
      if (typeof utilsStats[name] === 'function') {
        expect(() => utilsStats[name]()).not.toThrow();
      }
    }
  });

  test('getStats関数が存在すれば結果を返す', () => {
    if (typeof utilsStats.getStats === 'function') {
      const result = utilsStats.getStats();
      expect(result).toBeDefined();
    }
  });
});
