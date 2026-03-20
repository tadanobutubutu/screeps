/**
 * Security: Gamification Combo System Tests
 */

const gamification = require('../gamification');

describe('Security: Gamification Combo System', () => {
    beforeEach(() => {
        global.Game = {
            time: 100,
            spawns: {}
        };
        global.Memory = {
            gamification: {
                combos: {}
            }
        };
        // Mock console.log to avoid cluttering test output
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('addCombo should reject unsafe keys (Prototype Pollution protection)', () => {
        const result = gamification.addCombo('__proto__');
        expect(result).toBe(0);
        // Should not be an OWN property
        expect(Object.prototype.hasOwnProperty.call(Memory.gamification.combos, '__proto__')).toBe(false);
    });

    test('addCombo should truncate long keys (Memory DoS protection)', () => {
        const longKey = 'a'.repeat(100);
        const expectedKey = 'a'.repeat(32);

        gamification.addCombo(longKey);

        expect(Memory.gamification.combos[expectedKey]).toBeDefined();
        expect(Memory.gamification.combos[longKey]).toBeUndefined();
    });

    test('addCombo should respect maximum combo types limit (Memory DoS protection)', () => {
        // Fill up to the limit (10)
        for (let i = 0; i < 10; i++) {
            gamification.addCombo(`type_${i}`);
        }
        expect(Object.keys(Memory.gamification.combos).length).toBe(10);

        // Try to add one more
        const result = gamification.addCombo('one_too_many');
        expect(result).toBe(0);
        expect(Object.keys(Memory.gamification.combos).length).toBe(10);
        expect(Memory.gamification.combos['one_too_many']).toBeUndefined();
    });

    test('addCombo should still work for normal keys', () => {
        const result = gamification.addCombo('harvest');
        expect(result).toBe(1);
        expect(Memory.gamification.combos['harvest']).toBeDefined();
        expect(Memory.gamification.combos['harvest'].count).toBe(1);
    });
});
