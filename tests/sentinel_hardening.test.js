/**
 * tests/sentinel_hardening.test.js
 * Security hardening verification tests
 */

const cache = require('../src/utils/cache');
const { REPAIR_THRESHOLD } = require('../src/constants');

describe('Sentinel: Security Hardening Verification', () => {
    beforeEach(() => {
        global.Game = { time: 100 };
        global.global = global;
        // cache.js might have already initialized global.cache, so we reset it
        global.cache = undefined;
    });

    describe('Global Cache Hardening', () => {
        test('global.cache should be an Object with null prototype', () => {
            // Trigger cache initialization
            cache.getStats();

            expect(global.cache).toBeDefined();
            expect(Object.getPrototypeOf(global.cache)).toBeNull();
            expect(global.cache.toString).toBeUndefined();
            expect(global.cache.hasOwnProperty).toBeUndefined();
        });

        test('invalidatePattern should reject excessively long patterns', () => {
            const longPattern = 'a'.repeat(101);
            const fetcher = jest.fn().mockReturnValue('data');

            cache.get('test_key', fetcher, 10);
            expect(global.cache['test_key']).toBeDefined();

            // Should do nothing due to length limit
            cache.invalidatePattern(longPattern);
            expect(global.cache['test_key']).toBeDefined();

            // Should work for short patterns
            cache.invalidatePattern('test_');
            expect(global.cache['test_key']).toBeUndefined();
        });
    });

    describe('Constants and Lookups Hardening', () => {
        test('REPAIR_THRESHOLD should be an Object with null prototype', () => {
            expect(Object.getPrototypeOf(REPAIR_THRESHOLD)).toBeNull();
        });

        test('REPAIR_THRESHOLD should correctly handle lookups with constants', () => {
            // These constants are defined in src/constants.js if undefined
            expect(STRUCTURE_ROAD).toBe('road');
            expect(REPAIR_THRESHOLD[STRUCTURE_ROAD]).toBe(0.5);
            expect(REPAIR_THRESHOLD['road']).toBe(0.5);

            expect(STRUCTURE_WALL).toBe('constructedWall');
            expect(REPAIR_THRESHOLD[STRUCTURE_WALL]).toBe(0.0001);
            expect(REPAIR_THRESHOLD['constructedWall']).toBe(0.0001);
        });

        test('REPAIR_THRESHOLD should NOT have inherited properties', () => {
            expect(REPAIR_THRESHOLD.toString).toBeUndefined();
        });
    });
});
