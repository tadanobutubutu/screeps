/**
 * Security: Evolution System Prototype Pollution Protection Tests
 */

const autoEvolution = require('../auto.evolution');

describe('Security: Evolution System Prototype Pollution Protection', () => {
    beforeEach(() => {
        global.FIND_SOURCES = 101;
        global.FIND_MY_CREEPS = 102;
        global.FIND_MY_STRUCTURES = 103;
        global.STRUCTURE_TOWER = 'tower';
        global.STRUCTURE_LINK = 'link';
        global.STRUCTURE_LAB = 'lab';
        global.RESOURCE_ENERGY = 'energy';

        global.Game = {
            time: 100,
            cpu: { getUsed: () => 1.0, limit: 100 },
            rooms: {},
            creeps: {},
            gcl: { level: 1 },
            spawns: {},
            getObjectById: jest.fn(),
        };
        global.Memory = {};
        autoEvolution.init();

        // Mock console.log
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('addToQueue()', () => {
        test('should reject dangerous keys in need.type', () => {
            const initialLength = Memory.evolution.queue.length;
            autoEvolution.addToQueue({ type: '__proto__', action: 'test_action', priority: 1 });
            expect(Memory.evolution.queue.length).toBe(initialLength);
        });

        test('should reject dangerous keys in need.action', () => {
            const initialLength = Memory.evolution.queue.length;
            autoEvolution.addToQueue({ type: 'test_type', action: 'constructor', priority: 1 });
            expect(Memory.evolution.queue.length).toBe(initialLength);
        });

        test('should reject overly long keys', () => {
            const longKey = 'a'.repeat(300);
            const initialLength = Memory.evolution.queue.length;
            autoEvolution.addToQueue({ type: longKey, action: 'test_action', priority: 1 });
            expect(Memory.evolution.queue.length).toBe(initialLength);
        });
    });

    describe('getFilename()', () => {
        test('should return default for dangerous action names', () => {
            const result = autoEvolution.getFilename('constructor');
            expect(result).toBe('evolution.code.js');
        });

        test('should return correct mapping for valid actions', () => {
            const result = autoEvolution.getFilename('create_tower_logic');
            expect(result).toBe('structure.tower.js');
        });
    });

    describe('Loop Protections', () => {
        test('analyzeBasicState should use Object.values and ignore prototype properties', () => {
            // Simulate prototype pollution on Game.rooms
            Object.defineProperty(Game.rooms, 'polluted', {
                value: {
                    controller: { my: true, level: 8 },
                    find: jest.fn().mockReturnValue([]),
                    energyAvailable: 0,
                    energyCapacityAvailable: 0,
                },
                enumerable: true,
            });

            // This test is tricky because Object.values() includes own enumerable properties.
            // However, it avoids for...in which would include inherited enumerable properties.
            // If we use Object.create(null) for rooms it would be safer, but Game.rooms is an engine Proxy.

            const state = autoEvolution.analyzeBasicState();

            Object.prototype.evil = {
                controller: { my: true, level: 9 },
                find: jest.fn().mockReturnValue([]),
                energyAvailable: 0,
                energyCapacityAvailable: 0,
            };
            const state2 = autoEvolution.analyzeBasicState();
            expect(state2.roomCount).toBe(1); // Should only see 'polluted', not 'evil' from prototype
            delete Object.prototype.evil;
        });

        test('analyzeBottlenecks should ignore prototype properties', () => {
            Object.prototype.evilRoom = {
                controller: { my: true },
                find: jest.fn().mockReturnValue([]),
                name: 'EVIL',
            };

            const bottlenecks = autoEvolution.analyzeBottlenecks();
            expect(bottlenecks.length).toBe(0);
            delete Object.prototype.evilRoom;
        });
    });
});
