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

    test('updateStreak increments streak when playing consecutively', () => {
        Memory.gamification.lastActiveDay = 9;
        Memory.gamification.streakDays = 3;
        global.Game.time = 10000;
        gamification.updateStreak();
        expect(Memory.gamification.streakDays).toBe(4);
    });

    test('updateStreak resets streak when missing a day', () => {
        Memory.gamification.lastActiveDay = 5;
        Memory.gamification.streakDays = 3;
        global.Game.time = 10000;
        gamification.updateStreak();
        expect(Memory.gamification.streakDays).toBe(1);
    });

    test('updateStreak unlocks 7 day streak achievement', () => {
        Memory.gamification.lastActiveDay = 9;
        Memory.gamification.streakDays = 6;
        global.Game.time = 10000;
        jest.spyOn(gamification, 'unlockAchievement').mockImplementation(() => {});
        gamification.updateStreak();
        expect(gamification.unlockAchievement).toHaveBeenCalledWith('streak_7', '7 Day Streak!', '🔥');
    });

    test('checkMilestones checks creep count milestones', () => {
        global.Game.creeps = {};
        global.Game.gcl = { level: 1 };
        for (let i = 0; i < 10; i++) {
            global.Game.creeps['creep' + i] = {};
        }
        jest.spyOn(gamification, 'unlockAchievement').mockImplementation(() => {});
        gamification.checkMilestones();
        expect(gamification.unlockAchievement).toHaveBeenCalledWith('creeps_10', '10 Creeps!', '👥');
    });

    test('checkMilestones checks GCL milestones', () => {
        global.Game.creeps = {};
        global.Game.gcl = { level: 2 };
        jest.spyOn(gamification, 'unlockAchievement').mockImplementation(() => {});
        gamification.checkMilestones();
        expect(gamification.unlockAchievement).toHaveBeenCalledWith('gcl_2', 'GCL 2!', '⬆️');
    });

    test('getRank returns correct rank for level', () => {
        Memory.gamification = { level: 1 };
        expect(gamification.getRank()).toBe('Newbie');
        
        Memory.gamification.level = 2;
        expect(gamification.getRank()).toBe('Beginner');
        
        Memory.gamification.level = 5;
        expect(gamification.getRank()).toBe('Intermediate');
        
        Memory.gamification.level = 10;
        expect(gamification.getRank()).toBe('Advanced');
        
        Memory.gamification.level = 15;
        expect(gamification.getRank()).toBe('Expert');
        
        Memory.gamification.level = 20;
        expect(gamification.getRank()).toBe('Master');
    });

    test('getRank handles undefined level', () => {
        delete Memory.gamification;
        expect(gamification.getRank()).toBe('Newbie');
    });
});
