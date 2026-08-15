// test_1.js
const { test, expect } = require('@jest/globals');

test('random returns a number', () => {
  const random = require('../src/random').default;
  const result = random();
  expect(typeof result).toBe('number');
});