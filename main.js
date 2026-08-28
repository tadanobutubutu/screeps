// main.js - Main application logic

/**
 * Checks if a link is accessible and properly configured for accessibility
 * @param {string} url - The URL to check
 * @returns {Object} - Object containing isAccessible boolean and message string
 */
function checkLinkAccessibility(url) {
  // Check if URL is provided
  if (!url || typeof url !== 'string') {
    return {
      isAccessible: false,
      message: 'No URL provided'
    };
  }

  try {
    const urlObj = new URL(url);
    
    // Check for valid protocol
    if (!['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol)) {
      return {
        isAccessible: false,
        message: `Invalid protocol: ${urlObj.protocol}`
      };
    }

    // Check for empty hostname
    if (!urlObj.hostname) {
      return {
        isAccessible: false,
        message: 'No hostname provided'
      };
    }

    // Check for fragment-only URLs (page anchors are accessible)
    if (url.startsWith('#')) {
      return {
        isAccessible: true,
        message: 'Internal page anchor'
      };
    }

    return {
      isAccessible: true,
      message: 'Link is accessible'
    };
  } catch (error) {
    return {
      isAccessible: false,
      message: `Invalid URL format: ${error.message}`
    };
  }
}

// Example usage
function validatePageLinks() {
  const links = document.querySelectorAll('a[href]');
  const results = [];

  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const result = checkLinkAccessibility(href);
    
    if (!result.isAccessible) {
      console.warn(`Link ${index + 1}: ${result.message}`, href);
    }
    
    results.push({
      index,
      href,
      ...result
    });
  });

  return results;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkLinkAccessibility, validatePageLinks };
}