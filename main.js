// Example fix for memory.visualizer.js (line 31)
function visualizeMemory(data) {
  // Ensure all parentheses, brackets, and braces are properly closed
  // Check for missing commas in object/array literals
  // Verify template literals are properly terminated with backticks

  // Example of properly formatted code:
  const result = {
    total: data.total,
    used: data.used,
    // Ensure no trailing commas if not supported by your environment
  };

  // Make sure all string literals are properly quoted
  const message = `Memory usage: ${result.used}/${result.total}`;

  return message;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer in range [min, max]
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random element from an array.
 * @param {Array} arr - Array to choose from
 * @returns {*} Random element from array
 */
function randomChoice(arr) {
  if (!arr.length) return undefined;
  return arr[randomInt(0, arr.length - 1)];
}

module.exports = {
  visualizeMemory,
  randomInt,
  randomChoice
};