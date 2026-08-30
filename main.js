// main.js

const existingUtil = (x) => x * 2;

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

const VERSION = '1.0.0';

module.exports = {
  greet,
  add,
  subtract,
  multiply,
  divide,
  existingUtil,
  VERSION,
};