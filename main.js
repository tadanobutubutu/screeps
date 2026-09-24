function greet(name) {
  return `Hello, ${name}!`;
}

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

// // TODO: Implement a function to count dependencies
function countDependencies(dependencies) {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0;
  }
  
  let count = Object.keys(dependencies).length;
  
  return count;
}

module.exports = {
  greet,
  add,
  subtract,
  multiply,
  divide,
  countDependencies
};