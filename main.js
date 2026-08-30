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

// Existing isLinkAccessible function implementation
// ...

module.exports = {
  isEmpty,
  capitalize,
  getRandomInt,
  clamp,
  deepClone,
  isLinkAccessible
};