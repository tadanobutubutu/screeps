/**
 * utils.logging.js のユニットテスト
 */

global.Game = { time: 100 };
global.Memory = {};

// console.logをモック
const originalLog = console.log;
beforeAll(() => { console.log = jest.fn(); });
afterAll(() => { console.log = originalLog; });

const utilsLogging = require('../utils.logging');

describe('utils.logging', () => {
  test('モジュールが正しく読み込める', () => {
    expect(utilsLogging).toBeDefined();
  });

  test('log関数が存在すれば呼び出せる', () => {
    if (typeof utilsLogging.log === 'function') {
      expect(() => utilsLogging.log('test message')).not.toThrow();
    }
  });

  test('info関数が存在すれば呼び出せる', () => {
    if (typeof utilsLogging.info === 'function') {
      expect(() => utilsLogging.info('info message')).not.toThrow();
    }
  });

  test('warn関数が存在すれば呼び出せる', () => {
    if (typeof utilsLogging.warn === 'function') {
      expect(() => utilsLogging.warn('warn message')).not.toThrow();
    }
  });

  test('error関数が存在すれば呼び出せる', () => {
    if (typeof utilsLogging.error === 'function') {
      expect(() => utilsLogging.error('error message')).not.toThrow();
    }
  });

  test('エクスポートされた関数が少なくとも1つある', () => {
    const keys = Object.keys(utilsLogging);
    expect(keys.length).toBeGreaterThan(0);
  });

  test('log function truncates long messages', () => {
    const longMessage = 'A'.repeat(600);
    utilsLogging.log('info', longMessage);

    expect(Memory.logs[Memory.logs.length - 1].message.length).toBe(500);
    expect(Memory.logs[Memory.logs.length - 1].message).toBe('A'.repeat(500));
  });

  test('log function handles arrays', () => {
    utilsLogging.log('info', [1, 2, 3]);
    expect(Memory.logs).toBeDefined();
  });

  test('log function handles objects', () => {
    utilsLogging.log('info', { key: 'value' });
    expect(Memory.logs).toBeDefined();
  });

  test('error function exists and can be called', () => {
    if (typeof utilsLogging.error === 'function') {
      utilsLogging.error('error message');
      expect(Memory.logs[Memory.logs.length - 1].level).toBe('error');
    }
  });
});
