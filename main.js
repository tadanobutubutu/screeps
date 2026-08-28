// This is a simple utility library

function multiply(a, b) {
  return a * b;
}

function add(a, b) {
  return a + b;
}

// TODO: Implement divide function that handles division with proper error handling
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

function greet(name) {
  return `Hello, ${name}!`;
}

module.exports = {
  multiply,
  add,
  divide,
  greet
};