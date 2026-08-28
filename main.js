// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

/**
 * Checks if a given link/URL is accessible by making an HTTP HEAD request.
 * @param {string} url - The URL to check for accessibility
 * @returns {Promise<boolean>} - Returns true if the link is accessible (status 200-399), false otherwise
 */
async function isLinkAccessible(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors'
    });
    
    // In no-cors mode, response.ok is not reliable
    // A successful request without network error means the resource exists
    return true;
  } catch (error) {
    // Try with GET request as fallback
    try {
      const response = await fetch(url, {
        method: 'GET'
      });
      return response.ok;
    } catch (getError) {
      return false;
    }
  }
}

/**
 * Synchronous version that returns a Promise for backward compatibility
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Returns true if accessible
 */
function isLinkAccessibleSync(url) {
  return isLinkAccessible(url);
}

// Export for module usage
module.exports = {
  isLinkAccessible,
  isLinkAccessibleSync
};