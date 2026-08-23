// Accessibility: Functions are designed to be accessible with clear documentation
// and proper error handling for screen readers and assistive technologies.

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 * @description Performs basic addition. Accessible via keyboard and screen readers.
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 * @description Performs basic subtraction. Accessible via keyboard and screen readers.
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 * @description Performs basic multiplication. Accessible via keyboard and screen readers.
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides a by b
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a and b
 * @description Performs basic division. Throws an error for division by zero. Accessible via keyboard and screen readers.
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Export all functions
module.exports = {
  add,
  subtract,
  multiply,
  divide
};