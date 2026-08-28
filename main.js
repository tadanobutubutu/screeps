// main.js

export function calculateSum(a, b) {
  return a + b;
}

export function calculateDifference(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

export function isEven(number) {
  return number % 2 === 0;
}

export function isOdd(number) {
  return number % 2 !== 0;
}

export function formatString(text) {
  if (typeof text !== 'string') {
    return String(text);
  }
  return text.trim().toLowerCase();
}

export function capitalizeFirstLetter(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// TODO: Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
// export function calculateSum(a, b) { return a + b; }