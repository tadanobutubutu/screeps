// Jest tests for random functionality
const { randomInt, randomChoice } = require('./main.js');

describe('random utilities', () => {
  test('randomInt generates integer in range', () => {
    const result = randomInt(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('randomChoice selects from array', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = randomChoice(arr);
    expect(arr).toContain(result);
  });

  test('randomInt returns inclusive bounds', () => {
    const min = 5;
    const max = 5;
    const result = randomInt(min, max);
    expect(result).toBe(5);
  });
});