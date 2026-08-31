// Functions are now accessible via exports

/**
 * Utility function example
 * @param {*} value - Input value
 * @returns {*} Processed value
 */
function utilityFunction(value) {
  return value;
}

/**
 * Another function that needs to be accessible
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function anotherFunction(a, b) {
  return a + b;
}

// Exports - making functions accessible
module.exports = {
  utilityFunction,
  anotherFunction
};