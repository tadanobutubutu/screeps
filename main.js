// test_random.js
const { randomNumber, randomString } = require('../main');

describe('randomNumber', () => {
  test('generates a number within the specified range', () => {
    const min = 1;
    const max = 10;
    const result = randomNumber(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  test('throws error when min is greater than max', () => {
    expect(() => randomNumber(10, 1)).toThrow('Min must be less than or equal to max');
  });
});

describe('randomString', () => {
  test('generates a string of the specified length', () => {
    const length = 8;
    const result = randomString(length);
    expect(result).toHaveLength(length);
  });

  test('generates different strings on subsequent calls', () => {
    const first = randomString(10);
    const second = randomString(10);
    expect(first).not.toBe(second);
  });
});