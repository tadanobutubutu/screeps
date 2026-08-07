// Example of how a properly formatted test_random.js might look
const { randomFunction } = require('../main.js');

describe('randomFunction', () => {
  it('should return a random value', () => {
    const result = randomFunction();
    expect(typeof result).toBe('number');
  });
});