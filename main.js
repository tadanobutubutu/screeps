// test_random.js
const { randomFunction } = require('../main.js'); // Example import

describe('randomFunction', () => {
  it('should return a random value', () => {
    const result = randomFunction();
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });
});