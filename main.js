// TODO: add the new functions or changes requested in the issue

/**
 * Checks if a link is accessible by attempting to navigate to it
 * @param {string} link - The URL of the link to check
 * @returns {Promise<boolean>} - Resolves to true if the link is accessible, false otherwise
 */
async function isLinkAccessible(link) {
  try {
    const response = await fetch(link, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// New function requested in the issue (Add back any required exports that might have been?)
// Example: a hypothetical new function
/**
 * New function to demonstrate the addition of a new export
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} - The sum of a and b
 */
function add(a, b) {
  return a + b;
}

module.exports = {
  isEmpty,
  capitalize,
  getRandomInt,
  clamp,
  deepClone,
  add // Export the new function
};