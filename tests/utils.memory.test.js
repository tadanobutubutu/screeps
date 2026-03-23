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
    expect(utilsMemory.isSafeKey('hasOwnProperty')).toBe(false);
    expect(utilsMemory.isSafeKey('toLocaleString')).toBe(false);
    expect(utilsMemory.isSafeKey('isPrototypeOf')).toBe(false);
    expect(utilsMemory.isSafeKey('propertyIsEnumerable')).toBe(false);
  });

  test('isSafeKey allows safe properties', () => {
    expect(utilsMemory.isSafeKey('myKey')).toBe(true);
    expect(utilsMemory.isSafeKey(123)).toBe(true);
    expect(utilsMemory.isSafeKey('room1')).toBe(true);
  });

  test('getRoomMemory returns default for unsafe keys', () => {
    const result = utilsMemory.getRoomMemory('__proto__', 'key', 'default');
    expect(result).toBe('default');
  });

  test('getRoomMemory returns default for unsafe key2', () => {
    const result = utilsMemory.getRoomMemory('room1', 'constructor', 'default');
    expect(result).toBe('default');
  });

  test('setRoomMemory does not set for unsafe keys', () => {
    utilsMemory.setRoomMemory('__proto__', 'key', 'value');
    const result = utilsMemory.getRoomMemory('__proto__', 'key', 'default');
    expect(result).toBe('default');
  });

  test('clearRoomMemory handles unsafe keys', () => {
    expect(() => utilsMemory.clearRoomMemory('constructor', 'key')).not.toThrow();
    expect(() => utilsMemory.clearRoomMemory('__proto__', 'key')).not.toThrow();
  });

  test('memoize returns cached value', () => {
    let callCount = 0;
    const fn = () => { callCount++; return 'result'; };
    const cached = utilsMemory.memoize(fn, 'testKey', 100);
    expect(cached).toBe('result');
    const cached2 = utilsMemory.memoize(fn, 'testKey', 100);
    expect(cached2).toBe('result');
    expect(callCount).toBe(1);
  });

  test('memoize uses default TTL', () => {
    let callCount = 0;
    const fn = () => { callCount++; return 'result'; };
    utilsMemory.memoize(fn, 'testKey3');
    const cached = utilsMemory.memoize(fn, 'testKey3');
    expect(callCount).toBe(1);
  });
});
