// test_random.js
const { randomInt } = require('../main.js');

describe('randomInt', () => {
  test('generates a random integer within the specified range', () => {
    const min = 1;
    const max = 10;
    const result = randomInt(min, max);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('throws an error when min is greater than max', () => {
    expect(() => randomInt(10, 1)).toThrow('Max must be greater than min');
  });

  test('returns min when min equals max', () => {
    expect(randomInt(5, 5)).toBe(5);
  });
});