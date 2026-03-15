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

  test('isSafeKey blocks dangerous properties', () => {
    expect(utilsMemory.isSafeKey('__proto__')).toBe(false);
    expect(utilsMemory.isSafeKey('constructor')).toBe(false);
    expect(utilsMemory.isSafeKey('prototype')).toBe(false);
    expect(utilsMemory.isSafeKey('toString')).toBe(false);
    expect(utilsMemory.isSafeKey('valueOf')).toBe(false);
    expect(utilsMemory.isSafeKey('__defineGetter__')).toBe(false);
  });

  test('isSafeKey allows safe properties', () => {
    expect(utilsMemory.isSafeKey('myKey')).toBe(true);
    expect(utilsMemory.isSafeKey(123)).toBe(true);
    expect(utilsMemory.isSafeKey('room1')).toBe(true);
  });
});
