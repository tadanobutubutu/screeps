const { generateRandomNumber } = require('./src/random');

// test_random.js // This file contains tests for random number generation functions

describe('Random number generation', () => {
    test('generates a number within specified range', () => {
        const min = 1;
        const max = 10;
        const result = generateRandomNumber(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
    });

    test('generates different numbers on subsequent calls', () => {
        const result1 = generateRandomNumber(1, 10);
        const result2 = generateRandomNumber(1, 10);
        expect(result1).not.toBe(result2);
    });
});