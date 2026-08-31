// main.js

// Existing function 1
function greet(name) {
  return `Hello, ${name}!`;
}

// TODO: Add the necessary new functions (without strict mode)

// New functions added as requested:
function calculateArea(width, height) {
  return width * height;
}

function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function isEven(number) {
  return number % 2 === 0;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Exports
module.exports = {
  greet,
  calculateArea,
  celsiusToFahrenheit,
  formatDate,
  isEven,
  generateId
};