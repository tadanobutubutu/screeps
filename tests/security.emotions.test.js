/**
 * Security Emotions Protection Tests
 */

const EmotionSystem = require('../utils.emotions');

describe('Security: Emotions Protection', () => {
    let mockCreep;

    beforeEach(() => {
        global.Game = {
            time: 100,
            creeps: {}
        };
        global.Memory = {
            creeps: {}
        };
        global.RESOURCE_ENERGY = 'energy';
        mockCreep = {
            name: 'testCreep',
            memory: {
                emotions: {
                    mood: 3,
                    achievements: []
                }
            },
            say: jest.fn()
        };
    });

    describe('EmotionSystem: Memory DoS Protection', () => {
        test('celebrate() should truncate long achievement names', () => {
            const longAchievement = 'a'.repeat(500);
            EmotionSystem.celebrate(mockCreep, longAchievement);

            const achievements = mockCreep.memory.emotions.achievements;
            expect(achievements[0].name.length).toBeLessThanOrEqual(100);
            expect(achievements[0].name).toBe('a'.repeat(100));
        });

        test('celebrate() should limit number of achievements to 10', () => {
            for (let i = 0; i < 15; i++) {
                EmotionSystem.celebrate(mockCreep, `Achievement ${i}`);
            }

            const achievements = mockCreep.memory.emotions.achievements;
            expect(achievements.length).toBe(10);
            // Oldest should be shifted out if implemented with shift()
            // or we just check the count for now.
            expect(achievements[achievements.length - 1].name).toBe('Achievement 14');
        });
    });

    describe('EmotionSystem: Robustness and NaN Protection', () => {
        test('initialize() should fill in missing defaults even if object exists', () => {
            mockCreep.memory.emotions = { mood: 1 }; // Partially initialized
            EmotionSystem.initialize(mockCreep);

            expect(mockCreep.memory.emotions.mood).toBe(1);
            expect(mockCreep.memory.emotions.achievements).toBeInstanceOf(Array);
            expect(mockCreep.memory.emotions.lastEmotion).toBeDefined();
            expect(mockCreep.memory.emotions.birthTick).toBe(100);
        });

        test('updateEmotion() should recover from NaN mood', () => {
            // Adjust Game.time to avoid early return in updateEmotion
            // updateOffset = 'testCreep'.length % 5 = 4
            // (101 + 4) % 5 === 0
            global.Game.time = 101;
            mockCreep.memory.emotions.mood = NaN;
            mockCreep.store = { getUsedCapacity: () => 0, getCapacity: () => 100 };
            mockCreep.hits = 100;
            mockCreep.hitsMax = 100;
            mockCreep.pos = { x: 10, y: 10 };

            EmotionSystem.updateEmotion(mockCreep);

            expect(isNaN(mockCreep.memory.emotions.mood)).toBe(false);
            expect(mockCreep.memory.emotions.mood).toBeGreaterThanOrEqual(1);
            expect(mockCreep.memory.emotions.mood).toBeLessThanOrEqual(5);
        });

        test('interact() should recover from NaN mood in both creeps', () => {
            const mockCreep2 = {
                name: 'testCreep2',
                memory: { emotions: { mood: NaN } },
                pos: { x: 11, y: 11, inRangeTo: () => true },
                say: jest.fn()
            };
            mockCreep.pos = { x: 10, y: 10, inRangeTo: () => true };
            mockCreep.memory.emotions.mood = NaN;

            EmotionSystem.interact(mockCreep, mockCreep2);

            expect(isNaN(mockCreep.memory.emotions.mood)).toBe(false);
            expect(isNaN(mockCreep2.memory.emotions.mood)).toBe(false);
            expect(mockCreep.memory.emotions.mood).toBe(3.5); // 3 (default) + 0.5
            expect(mockCreep2.memory.emotions.mood).toBe(3.5);
        });

        test('interact() should handle null/undefined creeps gracefully', () => {
            expect(() => EmotionSystem.interact(null, mockCreep)).not.toThrow();
            expect(() => EmotionSystem.interact(mockCreep, undefined)).not.toThrow();
            expect(() => EmotionSystem.interact({}, {})).not.toThrow();
        });
    });
});
