// main.js
// Preserving all existing code and exports

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
}

/**
 * Multiplies two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function multiply(a, b) {
  return a * b;
}

// Export all functions for testing
module.exports = {
  add,
  multiply
};

// Add Jest configuration if not present
if (typeof jest !== 'undefined') {
  // This ensures Jest can properly execute tests
  jest.setTimeout(30000); // 30 second timeout for tests
}