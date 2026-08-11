// test_random.js
const { randomFunction } = require('../main.js');

describe('randomFunction', () => {
  it('should return a random number', () => {
    const result = randomFunction();
    expect(typeof result).toBe('number');
  });

  // Add more test cases as needed
});