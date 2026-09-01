// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// Exported functions
export function calculateSum(a, b) {
  return a + b;
}
export function calculateProduct(a, b) {
  return a * b;
}

// Address accessibility issues from insight report
export function getAccessibleGreeting(name) {
  // Assuming accessibility issue is related to providing a non-empty name
  if (!name) {
    throw new Error('Name must be provided to create an accessible greeting.');
  }
  return `Hello, ${name}!`;
}