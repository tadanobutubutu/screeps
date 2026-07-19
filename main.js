'use strict';

/**
 * Lightweight deployment helper utilities.
 *
 */

// Add a simple function that can be tested
function add(a, b) {
  return a + b;
}

// Add a simple function that can be tested
function subtract(a, b) {
  return a - b;
}

/**
 * Placeholder function to demonstrate proper addition of new code
 * @param {string} input - Input string to process
 * @returns {string} Processed string
 */
function processInput(input) {
  if (!input) {
    throw new Error('Input cannot be empty');
  }
  return input.trim();
}

module.exports = {
  add,
  subtract,
  processInput
};