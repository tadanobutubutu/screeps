// Example of how a properly formatted test_random.js might look
const { describe, it, expect } = require('@jest/globals');
const { randomFunction } = require('../main.js');

describe('randomFunction tests', () => {
  it('should do something', () => {
    expect(randomFunction()).toBeDefined();
  });
});