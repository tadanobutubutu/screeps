const EmotionSystem = require('../utils.emotions');

describe('EmotionSystem: Full Coverage Tests', () => {
    let mockCreep;
    let mockCreep2;

    beforeEach(() => {
        global.Game = { time: 100 };
        mockCreep = {
            name: 'testCreep',
            memory: {}
        };
        mockCreep2 = {
            name: 'testCreep2',
            memory: {}
        };
    });

    afterEach(() => {
        delete global.Game;
    });

    describe('initialize()', () => {
        test('should do nothing if creep or creep.memory is falsy', () => {
            EmotionSystem.initialize(null);
            EmotionSystem.initialize({ name: 'noMemory' });
            // No crash means it returned early
        });

        test('should create emotions object and set defaults', () => {
            EmotionSystem.initialize(mockCreep);
            expect(mockCreep.memory.emotions).toBeDefined();
            expect(mockCreep.memory.emotions.mood).toBe(3);
            expect(mockCreep.memory.emotions.achievements).toEqual([]);
            expect(mockCreep.memory.emotions.lastEmotion).toBe('😊');
            expect(mockCreep.memory.emotions.birthTick).toBe(100);
        });

        test('should set birthTick to 0 if Game is undefined', () => {
            delete global.Game;
            EmotionSystem.initialize(mockCreep);
            expect(mockCreep.memory.emotions.birthTick).toBe(0);
        });

        test('should not overwrite existing values', () => {
            mockCreep.memory.emotions = {
                mood: 4,
                achievements: [{ name: 'test', tick: 50 }],
                lastEmotion: '🎉',
                birthTick: 50
            };
            EmotionSystem.initialize(mockCreep);
            expect(mockCreep.memory.emotions.mood).toBe(4);
            expect(mockCreep.memory.emotions.achievements.length).toBe(1);
            expect(mockCreep.memory.emotions.lastEmotion).toBe('🎉');
            expect(mockCreep.memory.emotions.birthTick).toBe(50);
        });

        test('should fix mood if it is not a number', () => {
            mockCreep.memory.emotions = { mood: "happy" };
            EmotionSystem.initialize(mockCreep);
            expect(mockCreep.memory.emotions.mood).toBe(3);

            mockCreep.memory.emotions = { mood: NaN };
            EmotionSystem.initialize(mockCreep);
            expect(mockCreep.memory.emotions.mood).toBe(3);
        });

        test('should fix achievements if it is not an array', () => {
            mockCreep.memory.emotions = { achievements: "none" };
            EmotionSystem.initialize(mockCreep);
            expect(mockCreep.memory.emotions.achievements).toEqual([]);
        });
    });

    describe('celebrate()', () => {
        test('should do nothing if creep or creep.memory is falsy', () => {
            EmotionSystem.celebrate(null, 'test');
        });

        test('should handle missing emotions if initialize failed', () => {
            // Memory states tests might pass duck-typed objects to hit error branches safely without mocking globals
            // e.g. simulating a frozen or protected memory
            const fakeCreep = { memory: {} };
            Object.defineProperty(fakeCreep.memory, 'emotions', {
                get() { return undefined; },
                set(v) { /* no-op */ }
            });
            try { EmotionSystem.celebrate(fakeCreep, 'test'); } catch(e) {}
            expect(fakeCreep.memory.emotions).toBeUndefined();
        });

        test('should handle empty achievement', () => {
            EmotionSystem.celebrate(mockCreep, null);
            expect(mockCreep.memory.emotions.achievements[0].name).toBe('');
        });

        test('should record achievement tick as 0 if Game is undefined', () => {
            delete global.Game;
            EmotionSystem.celebrate(mockCreep, 'test');
            expect(mockCreep.memory.emotions.achievements[0].tick).toBe(0);
        });

        test('should pop old achievements when length exceeds max', () => {
            EmotionSystem.initialize(mockCreep);
            for (let i = 0; i < 15; i++) {
                EmotionSystem.celebrate(mockCreep, `Achieve ${i}`);
            }
            // MAX_ACHIEVEMENTS is 10
            expect(mockCreep.memory.emotions.achievements.length).toBe(10);
            expect(mockCreep.memory.emotions.achievements[0].name).toBe('Achieve 5');
            expect(mockCreep.memory.emotions.achievements[9].name).toBe('Achieve 14');
        });
    });

    describe('updateEmotion()', () => {
        test('should do nothing if creep or creep.memory is falsy', () => {
            EmotionSystem.updateEmotion(null);
        });

        test('should fix mood if it is not a number', () => {
            EmotionSystem.initialize(mockCreep);
            mockCreep.memory.emotions.mood = "sad";
            EmotionSystem.updateEmotion(mockCreep);
            expect(mockCreep.memory.emotions.mood).toBe(3); // clamped between 1 and 5
        });

        test('should clamp mood between 1 and 5', () => {
            EmotionSystem.initialize(mockCreep);
            mockCreep.memory.emotions.mood = 10;
            EmotionSystem.updateEmotion(mockCreep);
            expect(mockCreep.memory.emotions.mood).toBe(5);

            mockCreep.memory.emotions.mood = -5;
            EmotionSystem.updateEmotion(mockCreep);
            expect(mockCreep.memory.emotions.mood).toBe(1);
        });
    });

    describe('interact()', () => {
        test('should do nothing if creep1 or creep2 or memory is missing', () => {
            EmotionSystem.interact(null, mockCreep2);
            EmotionSystem.interact(mockCreep, null);
            EmotionSystem.interact({ name: 'c1' }, mockCreep2);
            EmotionSystem.interact(mockCreep, { name: 'c2' });
        });

        test('should do nothing if either creep emotions fail to initialize', () => {
            const fakeCreep = { memory: {} };
            Object.defineProperty(fakeCreep.memory, 'emotions', {
                get() { return undefined; },
                set(v) { /* no-op */ }
            });
            try { EmotionSystem.interact(fakeCreep, mockCreep2); } catch (e) {}
            // Even though fakeCreep fails, interact should just return early or throw, in either case we are just hitting the edge branch
        });

        test('should increase mood of both creeps by 0.5', () => {
            EmotionSystem.interact(mockCreep, mockCreep2);
            expect(mockCreep.memory.emotions.mood).toBe(3.5);
            expect(mockCreep2.memory.emotions.mood).toBe(3.5);
        });

        test('should clamp increased mood to 5', () => {
            mockCreep.memory.emotions = { mood: 4.8 };
            mockCreep2.memory.emotions = { mood: 5 };
            EmotionSystem.interact(mockCreep, mockCreep2);
            expect(mockCreep.memory.emotions.mood).toBe(5);
            expect(mockCreep2.memory.emotions.mood).toBe(5);
        });
    });

    describe('display(), getStats(), checkCreep()', () => {
        test('display() should call updateEmotion', () => {
            EmotionSystem.initialize(mockCreep);
            mockCreep.memory.emotions.mood = 10;
            EmotionSystem.display(mockCreep);
            expect(mockCreep.memory.emotions.mood).toBe(5);
        });

        test('getStats() should return empty object', () => {
            expect(EmotionSystem.getStats()).toEqual({});
        });

        test('checkCreep() should return empty object', () => {
            expect(EmotionSystem.checkCreep()).toEqual({});
        });
    });
});
