// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

/**
 * Checks for accessibility issues on links and buttons within a given root element
 * @param {Object} rootElement - The root DOM element to scan for accessibility issues
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(rootElement) {
  const issues = [];
  const baseElement = rootElement || (typeof document !== 'undefined' ? document.body : null);

  if (!baseElement) {
    return issues;
  }

  const links = baseElement.querySelectorAll ? baseElement.querySelectorAll('a') : [];
  const buttons = baseElement.querySelectorAll ? baseElement.querySelectorAll('button') : [];

  let index = 0;

  links.forEach((link) => {
    const hasText = link.textContent && link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label');
    const hasAccessibleName = hasText || hasAriaLabel;

    if (!hasAccessibleName) {
      issues.push({
        type: 'link',
        element: link,
        index: index++,
        issue: 'Link is missing accessible text or aria-label'
      });
    }
  });

  buttons.forEach((button) => {
    const hasText = button.textContent && button.textContent.trim().length > 0;
    const hasAriaLabel = button.getAttribute('aria-label');
    const hasAccessibleName = hasText || hasAriaLabel;

    if (!hasAccessibleName) {
      issues.push({
        type: 'button',
        element: button,
        index: index++,
        issue: 'Button is missing accessible text or aria-label'
      });
    }
  });

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