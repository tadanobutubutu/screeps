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

  const summary = {
    totalIssues: issues.length,
    linkIssuesFixed: 0,
    buttonIssuesFixed: 0,
    skipped: 0,
    fixes: []
  };

  issues.forEach((issue) => {
    if (!issue.element || !issue.element.parentNode) {
      summary.skipped++;
      return;
    }

    try {
      if (issue.type === 'link') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.linkIssuesFixed++;
        summary.fixes.push({
          type: 'link',
          index: issue.index,
          action: 'Added accessible text content'
        });
      } else if (issue.type === 'button') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.buttonIssuesFixed++;
        summary.fixes.push({
          type: 'button',
          index: issue.index,
          action: 'Added accessible name'
        });
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue.type,
        index: issue.index,
        action: 'Failed to fix',
        error: error.message
      });
    }
  });

  return summary;
}

/**
 * Check accessibility of links and buttons within the given HTML content
 * @param {string} htmlContent - HTML content to check for accessibility issues
 * @param {boolean} options.useStrict - Enable strict checks for accessibility issues
 * @returns {Object} - An array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(htmlContent, options = {}) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const links = doc.querySelectorAll('a:not([href])');
  const buttons = doc.querySelectorAll('button:not([aria-label])');

  const issues = [];

  Array.from(links).forEach((link, index) => {
    if (options.useStrict) {
      if (!link.textContent.trim()) {
        issues.push({
          type: 'link',
          index: index + 1,
          element: link
        });
      }
    } else {
      if (!link.hasAttribute('href')) {
        issues.push({
          type: 'link',
          index: index + 1,
          element: link
        });
      }
    }
  });

  Array.from(buttons).forEach((button, index) => {
    if (options.useStrict) {
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        issues.push({
          type: 'button',
          index: index + 1,
          element: button
        });
      }
    } else {
      if (!button.getAttribute('aria-label')) {
        issues.push({
          type: 'button',
          index: index + 1,
          element: button
        });
      }
    }
  });

  return issues;
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

// TODO: Implement the new function as per the new issue requirements (below this line)