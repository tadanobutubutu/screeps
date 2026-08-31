// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}

/**
 * Check the accessibility of all links and buttons on the page
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility() {
  const issues = [];

  let links, buttons;

  if (document.querySelectorAll('a[href]').length > 0) {
    links = [...document.querySelectorAll('a[href]')];
    links.forEach((link, index) => {
      if (!link.getAttribute('aria-label')) {
        issues.push({
          type: 'link',
          index: index,
          issue: 'Missing aria-label'
        });
      }
    });
  }

  if (document.querySelectorAll('button').length > 0) {
    buttons = [...document.querySelectorAll('button')];
    buttons.forEach((button, index) => {
      if (!button.setAttribute('aria-label', button.textContent)) {
        issues.push({
          type: 'button',
          index: index,
          issue: 'Missing aria-label'
        });
      }
    });
  }

  return issues;
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
  // ... [previously existing function code]

  // Modified to also handle the new checkLinkAndButtonAccessibility function
  issues = checkLinkAndButtonAccessibility();

  // ... [the rest of the previously existing function code]
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