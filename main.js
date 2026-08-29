// main.js - Link accessibility checker

// Existing utility functions (if any)
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// TODO: Implement this function for checking link accessibility
async function checkLinkAccessibility(url) {
  // Validate URL format first
  if (!url || typeof url !== 'string') {
    return {
      url: url,
      accessible: false,
      error: 'Invalid URL: URL must be a non-empty string'
    };
  }

  try {
    // Check if URL has valid format
    if (!validateUrl(url)) {
      return {
        url: url,
        accessible: false,
        error: 'Invalid URL format'
      };
    }

    // Attempt to fetch the URL with a HEAD request
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    return {
      url: url,
      accessible: response.ok,
      status: response.status,
      statusText: response.statusText,
      redirected: response.redirected,
      type: response.type
    };
  } catch (error) {
    return {
      url: url,
      accessible: false,
      error: error.message,
      name: error.name
    };
  }
}

// Batch check for multiple links
async function checkMultipleLinks(urls) {
  const results = await Promise.all(
    urls.map(url => checkLinkAccessibility(url))
  );
  return results;
}

module.exports = {
  checkLinkAccessibility,
  checkMultipleLinks,
  validateUrl
};