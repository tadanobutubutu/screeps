// main.js

const sum = (a, b) => a + b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b !== 0 ? a / b : undefined);
const subtract = (a, b) => a - b;

// TODO: Add any required exports that might have been removed
module.exports = { sum, multiply, divide, subtract };