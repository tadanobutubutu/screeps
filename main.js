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

// Export the functions for testing
module.exports = {
  add,
  subtract
};