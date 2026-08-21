// main.js

/**
 * Adds two numbers.
 *
 * @param {number} a - First operand.
 * @param {number} b - Second operand.
 * @returns {number} Sum of a and b.
 */
function add(a, b) {
  return a + b;
}

/**
 * Preserve any existing exports and add the new `add` function.
 */
const existingExports = module.exports || {};

module.exports = {
  ...existingExports,
  add,
};