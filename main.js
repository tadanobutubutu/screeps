// TODO: Add a new function named `calculateSum` as requested in the issue

function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('Input must be an array');
  }
  return numbers.reduce((sum, num) => sum + num, 0);
}

module.exports = { calculateSum };