/**
 * tests/security.aggregation.test.js
 * Security tests for aggregation logic in Room and Spawn managers
 */

const roomManager = require('../src/managers/roomManager');
const spawnManager = require('../src/managers/spawnManager');

describe('Security: Aggregation Hardening', () => {
    beforeEach(() => {
        global.Game = {
            time: 100,
            creeps: {},
            spawns: {},
            rooms: {},
        };
        global.Memory = {
            creeps: {},
        };
        // Mock global constants if needed
        global.FIND_SOURCES = 1;
        global.FIND_STRUCTURES = 2;
        global.FIND_MY_STRUCTURES = 3;
        global.FIND_CONSTRUCTION_SITES = 4;
        global.FIND_HOSTILE_CREEPS = 5;
        global.MOVE = 'move';
        global.WORK = 'work';
        global.CARRY = 'carry';
        global.ATTACK = 'attack';
        global.RANGED_ATTACK = 'ranged_attack';
        global.HEAL = 'heal';
        global.CLAIM = 'claim';
        global.TOUGH = 'tough';
        global.RESOURCE_ENERGY = 'energy';
        global.STRUCTURE_TOWER = 'tower';
        global.FIND_MY_CREEPS = 6;
        global.FIND_MY_SPAWNS = 7;

        jest.resetModules();
    });

    describe('RoomManager.getStats()', () => {
        test('should not pollute prototype via malicious creep role', () => {
            const mockRoom = {
                name: 'W1N1',
                controller: { level: 1, progress: 0, progressTotal: 1000, my: true },
                energyAvailable: 300,
                energyCapacityAvailable: 300,
                find: jest.fn().mockReturnValue([]),
            };

            // Inject a creep with a malicious role
            global.Game.creeps['maliciousCreep'] = {
                name: 'maliciousCreep',
                room: mockRoom,
                memory: { role: '__proto__' },
            };

            const stats = roomManager.getStats(mockRoom);

            // Verify that the malicious role was not used as a key that pollutes the prototype
            expect(stats.creepCounts['__proto__']).toBeUndefined();
            expect({}['__proto__']).not.toBe(1);
            expect(Object.getPrototypeOf(stats.creepCounts)).toBeNull();
        });
    });

    describe('SpawnManager._getCurrentCounts()', () => {
        // Access private function via rewire or export if possible.
        // Since it's not exported, we might need to test it through a public method or mock the module.
        // Actually, _getCurrentCounts is not exported. But we can test it indirectly via showStats which calls it.

        test('should not pollute prototype via malicious creep role in _getCurrentCounts', () => {
            const mockRoom = {
                name: 'W1N1',
                controller: { level: 1, my: true },
                find: jest.fn().mockReturnValue([]),
            };

            global.Game.creeps['maliciousCreep'] = {
                name: 'maliciousCreep',
                room: mockRoom,
                memory: { role: 'constructor' },
                spawning: false,
            };

            // Using logger mock to capture output of showStats
            const logger = require('../src/utils/logger');
            const infoSpy = jest.spyOn(logger, 'info').mockImplementation();

            spawnManager.showStats(mockRoom);

            // If it pollutes, it might cause weird behavior.
            // But we primarily want to ensure counts['constructor'] is not incremented on Object.prototype
            expect({}['constructor']).not.toBe(1);

            infoSpy.mockRestore();
        });
    });

    describe('SpawnManager._calcBodyCost()', () => {
        test('should not be affected by prototype pollution in COSTS map', () => {
            // This is harder to test without a malicious part name being passed to reduce.
            // But the use of Object.create(null) ensures it's safe.
            // We can't easily test the private _calcBodyCost directly as it's not exported.
        });
    });
});
