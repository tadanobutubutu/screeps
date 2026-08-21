// Example existing `main.js` content with conflict markers

// <<<<<<< HEAD
import { sum } from './utils';
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
// =======
import { sum } from './utils';
test('sums numbers', () => {
  expect(sum(1, 2)).toBe(3);
});
// >>>>>>> branch-name