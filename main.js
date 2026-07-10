// main.js
/**
 * A simple math utility module.
 *
 * Exported functions:
 *  - add(a, b): returns the sum of two numbers.
 *  - subtract(a, b): returns the difference of two numbers.
 *  - multiply(a, b): returns the product of two numbers.
 *  - divide(a, b): returns the quotient of two numbers (throws on division by zero).
 */
const math = {
  add: (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('add: arguments must be numbers');
    }
    return a + b;
  },

  subtract: (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('subtract: arguments must be numbers');
    }
    return a - b;
  },

  multiply: (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('multiply: arguments must be numbers');
    }
    return a * b;
  },

  divide: (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('divide: arguments must be numbers');
    }
    if (b === 0) {
      throw new Error('divide: division by zero');
    }
    return a / b;
  },
};

module.exports = math;