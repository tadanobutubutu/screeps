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
        global.Memory = {
            rooms: {},
            creeps: {},
            cache: {},
        };
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

    test('isSafeKey blocks long keys', () => {
        const longKey = 'a'.repeat(300);
        expect(utilsMemory.isSafeKey(longKey)).toBe(false);
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
        const fn = () => {
            callCount++;
            return 'result';
        };
        const cached = utilsMemory.memoize(fn, 'testKey', 100);
        expect(cached).toBe('result');
        const cached2 = utilsMemory.memoize(fn, 'testKey', 100);
        expect(cached2).toBe('result');
        expect(callCount).toBe(1);
    });

    test('memoize enforces MAX_CACHE_ENTRIES with FIFO eviction', () => {
        let callCount = 0;
        const fn = () => {
            callCount++;
            return 'result';
        };

        // Fill the cache
        for (let i = 0; i < 50; i++) {
            utilsMemory.memoize(fn, 'key' + i, 100);
        }
        expect(callCount).toBe(50);
        expect(Memory.cache['key0']).toBeDefined();

        // Add one more entry
        const result = utilsMemory.memoize(fn, 'oneMoreKey', 100);
        expect(result).toBe('result');
        expect(callCount).toBe(51);

        // Security: Verify FIFO eviction (key0 should be gone, oneMoreKey should be present)
        expect(Memory.cache['oneMoreKey']).toBeDefined();
        expect(Memory.cache['key0']).toBeUndefined();
        expect(Object.keys(Memory.cache).length).toBe(50);
    });

    test('memoize uses default TTL', () => {
        let callCount = 0;
        const fn = () => {
            callCount++;
            return 'result';
        };
        utilsMemory.memoize(fn, 'testKey3');
        const cached = utilsMemory.memoize(fn, 'testKey3');
        expect(callCount).toBe(1);
    });

    test('cleanMemory returns 0 when no creeps in memory', () => {
        global.Memory.creeps = {};
        global.Game.creeps = {};
        const result = utilsMemory.cleanMemory();
        expect(result).toBe(0);
    });

    test('cleanMemory removes dead creeps from memory', () => {
        global.Memory.creeps = { creep1: {}, creep2: {} };
        global.Game.creeps = { creep1: {} };
        const result = utilsMemory.cleanMemory();
        expect(result).toBe(1);
        expect(Memory.creeps.creep2).toBeUndefined();
        expect(Memory.creeps.creep1).toBeDefined();
    });

    test('cleanMemory handles Memory without creeps property', () => {
        delete global.Memory.creeps;
        global.Game.creeps = {};
        const result = utilsMemory.cleanMemory();
        expect(result).toBe(0);
    });

    test('getRoomMemory creates room object if not exists', () => {
        global.Memory.rooms = {};
        const result = utilsMemory.getRoomMemory('room1', 'key', 'default');
        expect(result).toBe('default');
        expect(Memory.rooms.room1).toBeDefined();
        expect(Memory.rooms.room1.key).toBe('default');
    });

    test('getRoomMemory returns stored value', () => {
        global.Memory.rooms = { room1: { key: 'stored' } };
        const result = utilsMemory.getRoomMemory('room1', 'key', 'default');
        expect(result).toBe('stored');
    });

    test('setRoomMemory sets value correctly', () => {
        global.Memory.rooms = {};
        utilsMemory.setRoomMemory('room1', 'key', 'value');
        expect(Memory.rooms.room1.key).toBe('value');
    });

    test('setRoomMemory handles undefined room', () => {
        global.Memory.rooms = {};
        utilsMemory.setRoomMemory('room1', 'key', 'value');
        expect(Memory.rooms.room1.key).toBe('value');
    });

    test('clearRoomMemory removes key from room', () => {
        global.Memory.rooms = { room1: { key: 'value' } };
        utilsMemory.clearRoomMemory('room1', 'key');
        expect(Memory.rooms.room1.key).toBeUndefined();
    });

    test('clearRoomMemory handles non-existent room', () => {
        global.Memory.rooms = {};
        expect(() => utilsMemory.clearRoomMemory('room1', 'key')).not.toThrow();
    });

    test('memoize caches based on TTL', () => {
        let callCount = 0;
        const fn = () => {
            callCount++;
            return 'result';
        };
        global.Game.time = 100;
        utilsMemory.memoize(fn, 'ttlKey', 10);
        global.Game.time = 105;
        const cached = utilsMemory.memoize(fn, 'ttlKey', 10);
        expect(callCount).toBe(1);
        global.Game.time = 115;
        const uncached = utilsMemory.memoize(fn, 'ttlKey', 10);
        expect(callCount).toBe(2);
    });

    test('memoize returns fn result for unsafe cacheKey', () => {
        let callCount = 0;
        const fn = () => {
            callCount++;
            return 'result';
        };
        const result = utilsMemory.memoize(fn, '__proto__');
        expect(result).toBe('result');
        expect(callCount).toBe(1);
    });

    test('isSafeKey blocks other dangerous properties', () => {
        expect(utilsMemory.isSafeKey('__lookupGetter__')).toBe(false);
        expect(utilsMemory.isSafeKey('__lookupSetter__')).toBe(false);
    });
});
