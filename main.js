// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility

/**
 * Checks if a URL is accessible and valid
 * @param {string} url - The URL to check
 * @returns {Object} An object containing accessibility status and details
 */
function checkLinkAccessibility(url) {
  if (!url || typeof url !== 'string') {
    return {
      accessible: false,
      error: 'Invalid or missing URL'
    };
  }

  try {
    const parsedUrl = new URL(url);
    
    // Check for valid protocols
    const validProtocols = ['http:', 'https:', 'ftp:', 'mailto:'];
    if (!validProtocols.includes(parsedUrl.protocol)) {
      return {
        accessible: false,
        error: 'URL uses unsupported protocol'
      };
    }

    return {
      accessible: true,
      protocol: parsedUrl.protocol,
      host: parsedUrl.host,
      pathname: parsedUrl.pathname,
      isSecure: parsedUrl.protocol === 'https:'
    };
  } catch (e) {
    return {
      accessible: false,
      error: 'Invalid URL format'
    };
  }
}

/**
 * Checks accessibility for multiple URLs
 * @param {string[]} urls - Array of URLs to check
 * @returns {Object[]} Array of accessibility results
 */
function checkMultipleLinks(urls) {
  if (!Array.isArray(urls)) {
    return [];
  }
  
  return urls.map(url => checkLinkAccessibility(url));
}

/**
 * Filters out inaccessible links from a list
 * @param {string[]} urls - Array of URLs to filter
 * @returns {string[]} Array of accessible URLs only
 */
function filterAccessibleLinks(urls) {
  if (!Array.isArray(urls)) {
    return [];
  }
  
  return urls
    .map(url => checkLinkAccessibility(url))
    .filter(result => result.accessible)
    .map((result, index) => urls[index]);
}

module.exports = {
  checkLinkAccessibility,
  checkMultipleLinks,
  filterAccessibleLinks
};