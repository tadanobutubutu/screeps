// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// main.js - Main application entry point

// Exported functions
export function calculateSum(a, b) {
  return a + b;
}
export function calculateProduct(a, b) {
  return a * b;
}

// TODO: Any additional changes requested in the issue should be added after this function

// Additional function as per the issue
export function calculateAverage(a, b) {
  return (a + b) / 2;
}