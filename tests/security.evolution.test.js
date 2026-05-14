/**
 * Security: Evolution System DoS Protection Tests
 */

const autoEvolution = require('../auto.evolution');

describe('Security: Evolution System DoS Protection', () => {
    beforeEach(() => {
        global.Game = {
            time: 100,
            cpu: { getUsed: () => 1.0, limit: 100 },
            rooms: {},
            creeps: {},
            gcl: { level: 1 },
            spawns: {},
        };
        global.Memory = {};
        autoEvolution.init();

        // Mock console.log
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('addToQueue should respect MAX_QUEUE limit (10)', () => {
        // Fill queue to MAX_QUEUE (10)
        for (let i = 0; i < 15; i++) {
            autoEvolution.addToQueue({ type: `test_${i}`, action: 'test_action', priority: 1 });
        }

        expect(Memory.evolution.queue.length).toBe(10);
    });

    test('processQueue should rotate history when exceeding MAX_HISTORY (50)', () => {
        // Process 60 unique items
        for (let i = 0; i < 60; i++) {
            // Bypass addToQueue limit for setup
            Memory.evolution.queue.push({ type: `test_${i}`, action: 'test_action', priority: 1 });
            autoEvolution.processQueue();
        }

        expect(Memory.evolution.history.length).toBe(50);
        // The last added item should be at the end
        expect(Memory.evolution.history[49].type).toBe('test_59');
        // The first 10 items should have been shifted out
        expect(Memory.evolution.history[0].type).toBe('test_10');
    });

    test('processQueue should rotate suggestions when exceeding MAX_SUGGESTIONS (20)', () => {
        // processQueue calls generateCodeSuggestion which populates suggestions
        for (let i = 0; i < 30; i++) {
            Memory.evolution.queue.push({ type: `test_${i}`, action: 'test_action', priority: 1 });
            autoEvolution.processQueue();
        }

        expect(Memory.evolution.suggestions.length).toBe(20);
        // The last added suggestion should be at the end
        expect(Memory.evolution.suggestions[19].type).toBe('test_29');
        // The first 10 suggestions should have been shifted out
        expect(Memory.evolution.suggestions[0].type).toBe('test_10');
    });
});
