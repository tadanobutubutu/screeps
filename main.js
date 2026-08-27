// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!(link instanceof HTMLAnchorElement)) {
    return false; // Ensure the element is a valid anchor element
  }

  // Check for the presence of `href` attribute
  if (!link.hasAttribute('href')) {
    return false;
  }

  // Check for the presence of `aria-label` or `title` attribute
  if (!link.hasAttribute('aria-label') && !link.hasAttribute('title')) {
    return false;
  }

  // Check if the `href` is a valid URL
  try {
    const url = new URL(link.getAttribute('href'));
    if (!url.href.startsWith('http') && !url.href.startsWith('https')) {
      return false; // Links should ideally be to HTTP or HTTPS URLs
    }
  } catch (e) {
    return false; // Invalid URL
  }

  // If all checks pass, the link is accessible
  return true;
}

// Export the new function
module.exports = {
  setSvgAccessibilityProps,
  isLinkAccessible,
};