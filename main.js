// GitHub Issue Fix - Commit: 6009dec851a51383188dc071ee4edb6953001d55

// TODO: Add exports for new functions if needed - UPDATED: Added exports below

// Existing utility functions
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

function reverseString(str) {
  return str.split('').reverse().join('');
}

// New functions added
function isEven(num) {
  return num % 2 === 0;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Exports - PRESERVED existing exports and ADDED new function exports
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  reverseString,
  isEven,
  capitalizeFirst
};