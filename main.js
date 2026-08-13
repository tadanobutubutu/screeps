// test_random.js
const { randomFunction } = require('../main.js');

describe('randomFunction', () => {
  it('should return a random number between min and max', () => {
    const min = 1;
    const max = 10;
    const result = randomFunction(min, max);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it('should handle edge cases', () => {
    expect(randomFunction(5, 5)).toBe(5);
    expect(randomFunction(0, 0)).toBe(0);
  });
});