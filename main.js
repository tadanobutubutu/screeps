// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

/**
 * Checks if a given URL is accessible by making an HTTP HEAD request.
 * @param {string} url - The URL to check accessibility for.
 * @returns {Promise<boolean>} - Returns true if the link is accessible, false otherwise.
 */
async function isLinkAccessible(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Export the function for use in tests and other modules
module.exports = { isLinkAccessible };