// TODO: Add back any required exports that might have been removed.

/**
 * Utility functions and exports
 */

const VERSION = '1.0.0';

/**
 * Helper function to greet
 * @param {string} name - The name to greet
 * @returns {string} The greeting message
 */
function greet(name) {
  if (!name || typeof name !== 'string') {
    return 'Hello, World!';
  }
  return `Hello, ${name}!`;
}

/**
 * Calculate the sum of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The sum
 */
function sum(numbers) {
  if (!Array.isArray(numbers)) {
    return 0;
  }
  return numbers.reduce((acc, num) => acc + (typeof num === 'number' ? num : 0), 0);
}

/**
 * Get the current version
 * @returns {string} The version string
 */
function getVersion() {
  return VERSION;
}

/**
 * Check if a value is defined
 * @param {*} value - Any value to check
 * @returns {boolean} True if defined, false otherwise
 */
function isDefined(value) {
  return value !== undefined && value !== null;
}

module.exports = {
  VERSION,
  greet,
  sum,
  getVersion,
  isDefined
};