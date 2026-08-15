// test_random.js
const { randomNumber } = require('../main');

describe('randomNumber', () => {
  it('should return a number between min and max', () => {
    const min = 1;
    const max = 10;
    const result = randomNumber(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it('should return an integer when min and max are integers', () => {
    const min = 5;
    const max = 15;
    const result = randomNumber(min, max);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should handle edge cases where min equals max', () => {
    const value = 7;
    const result = randomNumber(value, value);
    expect(result).toBe(value);
  });
});