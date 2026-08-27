// Main module for the application

// Example of how to export a required function from another file
// const { myFunction } = require('./otherFile');
// module.exports = { myFunction };

// Basic utility functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Export all utilities
module.exports = {
  add,
  subtract,
  multiply,
  divide
};