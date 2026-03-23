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
});
