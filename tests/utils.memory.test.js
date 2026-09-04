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



    test('setRoomMemory does not set for unsafe keys', () => {
        utilsMemory.setRoomMemory('__proto__', 'key', 'value');
        expect(Memory?.rooms?.['__proto__']?.key).toBeUndefined();
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



    test('isSafeKey blocks other dangerous properties', () => {
        expect(utilsMemory.isSafeKey('__lookupGetter__')).toBe(false);
        expect(utilsMemory.isSafeKey('__lookupSetter__')).toBe(false);
    });

    describe('updateWorkingState', () => {
        let mockCreep;

        beforeEach(() => {
            mockCreep = {
                memory: {
                    working: false,
                },
                store: {
                    getFreeCapacity: jest.fn(),
                    getUsedCapacity: jest.fn(),
                },
            };
        });

        test('transitions to working when free capacity is 0', () => {
            mockCreep.memory.working = false;
            mockCreep.store.getFreeCapacity.mockReturnValue(0);

            const result = utilsMemory.updateWorkingState(mockCreep);

            expect(result).toBe(true);
            expect(mockCreep.memory.working).toBe(true);
        });

        test('transitions to not working when used capacity is 0', () => {
            mockCreep.memory.working = true;
            mockCreep.store.getUsedCapacity.mockReturnValue(0);

            const result = utilsMemory.updateWorkingState(mockCreep);

            expect(result).toBe(false);
            expect(mockCreep.memory.working).toBe(false);
        });

        test('remains working when used capacity is > 0', () => {
            mockCreep.memory.working = true;
            mockCreep.store.getUsedCapacity.mockReturnValue(10);

            const result = utilsMemory.updateWorkingState(mockCreep);

            expect(result).toBe(true);
            expect(mockCreep.memory.working).toBe(true);
        });

        test('remains not working when free capacity is > 0', () => {
            mockCreep.memory.working = false;
            mockCreep.store.getFreeCapacity.mockReturnValue(10);

            const result = utilsMemory.updateWorkingState(mockCreep);

            expect(result).toBe(false);
            expect(mockCreep.memory.working).toBe(false);
        });
    });

    describe('initCreepMemory', () => {
        let creep;

        beforeEach(() => {
            creep = { memory: {} };
        });

        test('initializes role and working state if undefined', () => {
            utilsMemory.initCreepMemory(creep, 'harvester');
            expect(creep.memory.role).toBe('harvester');
            expect(creep.memory.working).toBe(false);
        });

        test('does not overwrite existing role or working state', () => {
            creep.memory.role = 'builder';
            creep.memory.working = true;
            utilsMemory.initCreepMemory(creep, 'harvester');
            expect(creep.memory.role).toBe('builder');
            expect(creep.memory.working).toBe(true);
        });

        test('copies safe properties from extraData', () => {
            utilsMemory.initCreepMemory(creep, 'harvester', { sourceId: 'abc', count: 5 });
            expect(creep.memory.sourceId).toBe('abc');
            expect(creep.memory.count).toBe(5);
        });

        test('does not overwrite existing properties in creep memory with extraData', () => {
            creep.memory.sourceId = 'xyz';
            utilsMemory.initCreepMemory(creep, 'harvester', { sourceId: 'abc' });
            expect(creep.memory.sourceId).toBe('xyz');
        });

        test('blocks dangerous keys from extraData', () => {
            const extraData = { validKey: 'value' };
            Object.defineProperty(extraData, '__proto__', { value: 'danger', enumerable: true });
            utilsMemory.initCreepMemory(creep, 'harvester', extraData);

            // Should not copy __proto__ but validKey should be copied
            expect(creep.memory.validKey).toBe('value');
            expect(creep.memory.__proto__).not.toBe('danger');
        });

        test('does not copy inherited properties from extraData', () => {
            const parent = { inheritedKey: 'inherited' };
            const child = Object.create(parent);
            child.ownKey = 'own';

            utilsMemory.initCreepMemory(creep, 'harvester', child);

            expect(creep.memory.ownKey).toBe('own');
            expect(creep.memory.inheritedKey).toBeUndefined();
        });
    });
});
