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

    test('addXP should validate amount (NaN protection)', () => {
        Memory.gamification.xp = 0;
        gamification.addXP(NaN, 'test');
        expect(Memory.gamification.xp).toBe(0);
    });

    test('addXP should validate amount (negative protection)', () => {
        Memory.gamification.xp = 10;
        gamification.addXP(-5, 'test');
        expect(Memory.gamification.xp).toBe(10);
    });

    test('addXP should truncate reason (Memory DoS protection)', () => {
        const longReason = 'a'.repeat(200);
        const expectedReason = 'a'.repeat(100);

        // Mock console.log to check the output
        const logSpy = jest.spyOn(console, 'log');

        gamification.addXP(10, longReason);

        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(`(${expectedReason})`));
        logSpy.mockRestore();
    });

    test('unlockAchievement should sanitize and truncate inputs', () => {
        const longId = 'id'.repeat(100);
        const longTitle = 'title'.repeat(100);
        const longIcon = 'icon'.repeat(100);

        const expectedId = longId.substring(0, 100);
        const expectedTitle = longTitle.substring(0, 100);
        const expectedIcon = longIcon.substring(0, 10);

        gamification.unlockAchievement(longId, longTitle, longIcon);

        expect(Memory.gamification.achievements).toContain(expectedId);
        expect(Memory.gamification.achievements).not.toContain(longId);
    });

    test('unlockAchievement should respect maximum achievements limit', () => {
        // Fill up to the limit (50)
        // We need to bypass the XP-induced level up achievements to keep it simple
        Memory.gamification.level = 999;

        for (let i = 0; i < 50; i++) {
            gamification.unlockAchievement(`ach_${i}`, `Achievement ${i}`);
        }

        // It might be more than 50 if level-up achievements were triggered before we set level = 999
        // So let's just ensure it's at least 50 and then add one more to trigger eviction
        const initialCount = Memory.gamification.achievements.length;
        const firstAchievement = Memory.gamification.achievements[0];

        // Add one more to definitely trigger eviction if we are at MAX_ACHIEVEMENTS
        gamification.unlockAchievement('overflow_test', 'Overflow Achievement');

        expect(Memory.gamification.achievements.length).toBeLessThanOrEqual(50);
        expect(Memory.gamification.achievements).toContain('overflow_test');

        if (initialCount >= 50) {
            expect(Memory.gamification.achievements).not.toContain(firstAchievement);
        }
    });

    test('checkLevelUp should handle invalid xpToNext', () => {
        Memory.gamification.xp = 10;
        Memory.gamification.xpToNext = 0; // Should be reset to 100

        gamification.checkLevelUp();

        expect(Memory.gamification.xpToNext).toBe(100);
    });
});
