// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}
// TODO: Any additional changes requested in the issue should be added after this function

// Exported functions
export function calculateSum(a, b) {
  return a + b;
}
export function calculateProduct(a, b) {
  return a * b;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateSum, calculateProduct };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
}