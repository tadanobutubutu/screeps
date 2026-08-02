// test_random.js
const { isValidNumber, generateRandom } = require('../main.js');

describe('Random Number Tests', () => {
  test('should generate a valid random number', () => {
    const result = generateRandom(1, 100);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(100);
  });

  test('should validate numbers correctly', () => {
    expect(isValidNumber(42)).toBe(true);
    expect(isValidNumber('hello')).toBe(false);
    expect(isValidNumber(null)).toBe(false);
  });

  test('should handle edge cases', () => {
    expect(generateRandom(0, 1)).toBeGreaterThanOrEqual(0);
    expect(generateRandom(-10, -1)).toBeLessThanOrEqual(-1);
  });
});