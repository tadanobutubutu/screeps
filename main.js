// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility

/**
 * Checks if a given link/URL is accessible
 * @param {string} url - The URL to check accessibility for
 * @param {Object} options - Optional configuration for the check
 * @param {number} options.timeout - Timeout in milliseconds (default: 5000)
 * @param {Object} options.headers - Custom headers to send with the request
 * @returns {Promise<boolean>} - Returns true if the link is accessible, false otherwise
 */
async function isLinkAccessible(url, options = {}) {
  const { timeout = 5000, headers = {} } = options;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'LinkChecker/1.0',
        ...headers
      },
      signal: controller.signal,
      mode: 'no-cors'
    });
    
    clearTimeout(timeoutId);
    
    // With mode: 'no-cors', we can't check status, so any response means accessible
    return response.type === 'opaque' || response.ok;
  } catch (error) {
    return false;
  }
}

module.exports = { isLinkAccessible };