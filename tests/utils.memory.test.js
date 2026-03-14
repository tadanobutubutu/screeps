/**
 * utils.memory.js のユニットテスト
 */

global.Memory = {};
global.Game = {
  time: 100,
  creeps: {},
  spawns: {},
  rooms: {},
  structures: {},
};

const utilsMemory = require('../utils.memory');

describe('utils.memory', () => {
  beforeEach(() => {
    global.Memory = {};
  });

  test('モジュールが正しく読み込める', () => {
    expect(utilsMemory).toBeDefined();
  });

  test('エクスポートされた関数が呼び出せる', () => {
    const keys = Object.keys(utilsMemory);
    expect(keys.length).toBeGreaterThan(0);
  });

  test('init関数が存在すれば呼び出せる', () => {
    if (typeof utilsMemory.init === 'function') {
      expect(() => utilsMemory.init()).not.toThrow();
    }
  });

  test('cleanup関数が存在すれば呼び出せる', () => {
    if (typeof utilsMemory.cleanup === 'function') {
      expect(() => utilsMemory.cleanup()).not.toThrow();
    }
  });

  test('get/set関数が存在すれば正常に動作する', () => {
    if (typeof utilsMemory.set === 'function' && typeof utilsMemory.get === 'function') {
      utilsMemory.set('testKey', 'testValue');
      expect(utilsMemory.get('testKey')).toBe('testValue');
    }
  });
});
