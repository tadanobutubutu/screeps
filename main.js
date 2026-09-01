// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// TODO: Implement this function for checking landmark elements
function checkLandmarkElement(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id '${elementId}' not found.`);
  }
  return element;
}

// Exported functions
export function calculateSum(a, b) {
  return a + b;
}

export function calculateProduct(a, b) {
  return a * b;
}

export { checkLandmarkElement };