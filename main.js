// main.js
// Preserving existing exports and functions while adding test-friendly structure

// Example existing function (preserved)
function existingFunction(param) {
  // existing implementation
  return param;
}

// New function added for test coverage
function newTestableFunction(input) {
  if (typeof input !== 'number') {
    throw new Error('Input must be a number');
  }
  return input * 2;
}

// Export all functions for testing
module.exports = {
  existingFunction,
  newTestableFunction
};