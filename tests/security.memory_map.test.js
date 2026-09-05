/**
 * Security Memory Map and Diary Protection Tests
 */

const memVis = require('../memory.visualizer');

describe('Security: Memory Map and Diary Protections', () => {
    beforeEach(() => {
        global.Game = {
            time: 100,
            rooms: {},
            creeps: {},
            cpu: { getUsed: () => 1.0, limit: 20, bucket: 10000 },
            gcl: { level: 1 },
        };
        global.Memory = {
            creeps: {},
            rooms: {},
            map: {
                rooms: {},
                explored: [],
            },
        };
        // Mock FIND_SOURCES, etc.
        global.FIND_SOURCES = 1;
        global.FIND_MINERALS = 2;
        global.FIND_HOSTILE_CREEPS = 3;

        // Mock console.log
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    describe('Creep Diary: Prototype Pollution Protection', () => {
        test('addDiaryEntry() should not allow dangerous creep names', () => {
            const dangerousKey = 'constructor';
            memVis.addDiaryEntry(dangerousKey, 'Hack attempt');

            // Use hasOwnProperty to check if it was explicitly set
            expect(Object.prototype.hasOwnProperty.call(Memory.creeps, dangerousKey)).toBe(false);
        });

        test('readDiary() should handle dangerous creep names safely', () => {
            const dangerousKey = 'toString';
            const result = memVis.readDiary(dangerousKey);

            expect(result).toEqual([]);
        });
    });

    describe('Creep Diary: DoS Protection', () => {
        test('addDiaryEntry() should truncate long messages', () => {
            const creepName = 'testCreep';
            Memory.creeps[creepName] = {};
            const longMessage = 'a'.repeat(500);

            memVis.addDiaryEntry(creepName, longMessage);

            const entries = Memory.creeps[creepName].diary.entries;
            expect(entries[0].message.length).toBe(200);
            expect(entries[0].message).toBe('a'.repeat(200));
        });
    });
});
