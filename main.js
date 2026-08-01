// main.js - Core module exports

/**
 * Adds two numbers together.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The sum of a and b
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts the second number from the first.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The difference of a and b
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The product of a and b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides the first number by the second.
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} The quotient of a and b
 * @throws {Error} If b is zero
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

/**
 * Checks if a value is even.
 * @param {number} n - The number to check
 * @returns {boolean} True if n is even, false otherwise
 */
function isEven(n) {
  return n % 2 === 0;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  isEven,
};