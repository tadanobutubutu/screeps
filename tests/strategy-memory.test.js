/**
 * strategy-memory.js のユニットテスト
 */

global.Memory = {};
global.console = { log: jest.fn() };

const strategyMemory = require('../strategy-memory');

describe('strategy-memory', () => {
  beforeEach(() => {
    global.Memory = {};
    jest.clearAllMocks();
  });

  test('モジュールが正しく読み込める', () => {
    expect(strategyMemory).toBeDefined();
    expect(typeof strategyMemory.loadStrategy).toBe('function');
    expect(typeof strategyMemory.displayBriefing).toBe('function');
  });

  test('loadStrategyがMemory.strategyを初期化する', () => {
    strategyMemory.loadStrategy();
    expect(Memory.strategy).toBeDefined();
  });

  test('displayBriefingがエラーなく実行される', () => {
    Memory.strategy = { timestamp: '2026-01-01', focus: 'growth', objective: 'upgrade', tactics: { harvester: 'default' }, priority: 'high' };
    expect(() => strategyMemory.displayBriefing()).not.toThrow();
  });

  test('displayBriefingがMemory.strategyがないときエラーなく終了する', () => {
    expect(() => strategyMemory.displayBriefing()).not.toThrow();
  });
});
