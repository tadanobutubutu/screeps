// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;
  
  // ... Existing code for addressAccessibilityIssues function

}

/**
 * Check if a given element has any accessibility issues
 * @param {Element} element - DOM element to check
 * @returns {Object | undefined} - Object with the issue details if found, undefined otherwise
 */
function checkLinkAndButtonAccessibility(element) {
  if (!element || !element.tagName) return;

  const tagName = element.tagName.toLowerCase();

  if (tagName === 'a' || tagName === 'button') {
    // Check for presence of visible or ARIA text
    const textContents = Array.from(element.textContent.trim().split(/\s+/));
    const hasVisibleText = textContents.length > 0;
    const hasAriaAttr = element.hasAttribute('aria-label');

    if (!hasVisibleText && !hasAriaAttr) {
      return {
        type: tagName,
        index: document.getElementById(element.id) ? document.getElementById(element.id).getAttribute('data-testid') : undefined,
        accessibilityIssue: 'Missing clear text content'
      };
    }
  }

  return undefined;
}

function calculateProduct(a, b) {
  return a * b;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkLinkAndButtonAccessibility, addressAccessibilityIssues, calculateSum, calculateProduct };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
}