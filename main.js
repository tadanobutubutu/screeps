// main.js
export function calculateSum(a, b) {
  return a + b;
}

export function subtractValues(a, b) {
  return a - b;
}

// Existing code from current main.js
<<<<<<< HEAD
export function multiplyValues(a, b) {
  return a * b;
}

export function divideValues(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}
=======

// Changes requested in the issue
export function multiplyValues(a, b) {
  return a * b;
}

export function divideValues(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}
>>>>>>> resolved

// Further code in main.js that should remain unchanged
export function exponentiateValues(a, b) {
  return Math.pow(a, b);
}

export function logarithmOfValue(value) {
  return Math.log(value);
}

export function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}