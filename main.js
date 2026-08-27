// Existing code line 1
// Existing code line 2
// TODO: Add a new function named `calculateSum` as requested in the issue

/**
 * Calculates the sum of all provided numbers.
 * @param {...number} numbers - The numbers to sum.
 * @returns {number} The sum of all input numbers.
 */
function calculateSum(...numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

// Preserve any existing exports
module.exports = {
  calculateSum
};