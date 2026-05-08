/**
 * tests/security.robust_init.test.js
 * Security tests for robust memory initialization in core systems.
 * Verifies recovery from partially initialized or empty root objects.
 */

'use strict';

const autoEvolution = require('../auto.evolution');
const adaptiveSystem = require('../system.adaptive');

describe('Security: Robust Initialization', () => {
    beforeEach(() => {
        global.Game = {
            time: 100,
            cpu: {
                getUsed: jest.fn().mockReturnValue(10),
                limit: 20,
                bucket: 10000,
            },
            gcl: { level: 1 },
            rooms: {},
            creeps: {},
            spawns: {},
            constructionSites: {},
        };
        global.Memory = {};
        global.RawMemory = {
            get: jest.fn().mockReturnValue('{}'),
        };
    });

    describe('auto.evolution initialization', () => {
        test('it should recover from an empty Memory.evolution object', () => {
            // Simulate corrupted/partially initialized memory
            global.Memory.evolution = {};

            // Should not throw and should populate defaults
            expect(() => autoEvolution.init()).not.toThrow();

            expect(global.Memory.evolution.history).toBeDefined();
            expect(Array.isArray(global.Memory.evolution.history)).toBe(true);
            expect(global.Memory.evolution.queue).toBeDefined();
            expect(global.Memory.evolution.stats).toBeDefined();
            expect(global.Memory.evolution.stats.totalEvolutions).toBe(0);
        });

        test('it should preserve existing properties while populating missing ones', () => {
            global.Memory.evolution = {
                lastRCL: 5,
                // history is missing
            };

            autoEvolution.init();

            expect(global.Memory.evolution.lastRCL).toBe(5);
            expect(global.Memory.evolution.history).toBeDefined();
            expect(Array.isArray(global.Memory.evolution.history)).toBe(true);
        });
    });

    describe('system.adaptive initialization', () => {
        test('it should recover from an empty Memory.adaptive object', () => {
            global.Memory.adaptive = {};

            expect(() => adaptiveSystem.init()).not.toThrow();

            expect(global.Memory.adaptive.currentMode).toBe(adaptiveSystem.MODE.NORMAL);
            expect(global.Memory.adaptive.stats).toBeDefined();
            expect(global.Memory.adaptive.stats.normalCount).toBe(0);
            expect(global.Memory.adaptive.modeHistory).toBeDefined();
            expect(Array.isArray(global.Memory.adaptive.modeHistory)).toBe(true);
        });

        test('it should preserve existing mode while populating missing stats', () => {
            global.Memory.adaptive = {
                currentMode: adaptiveSystem.MODE.EMERGENCY,
            };

            adaptiveSystem.init();

            expect(global.Memory.adaptive.currentMode).toBe(adaptiveSystem.MODE.EMERGENCY);
            expect(global.Memory.adaptive.stats).toBeDefined();
            expect(global.Memory.adaptive.stats.emergencyCount).toBe(0);
        });
    });
});
