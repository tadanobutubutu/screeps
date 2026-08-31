// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

/**
 * Checks links and buttons for accessibility issues
 * @param {Array} elements - Array of DOM elements to check (links and buttons)
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(elements) {
  const issues = [];
  
  elements.forEach((element, index) => {
    if (!element) {
      return;
    }
    
    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    
    if (tagName === 'a' || tagName === 'link') {
      const hasAccessibleName = element.getAttribute('aria-label') || 
                                element.textContent || 
                                element.innerText ||
                                element.title;
      
      if (!hasAccessibleName) {
        issues.push({
          type: 'link',
          element: element,
          index: index,
          issue: 'Link has no accessible name'
        });
      }
    } else if (tagName === 'button') {
      const hasAccessibleName = element.getAttribute('aria-label') || 
                                element.textContent || 
                                element.innerText ||
                                element.title;
      
      if (!hasAccessibleName) {
        issues.push({
          type: 'button',
          element: element,
          index: index,
          issue: 'Button has no accessible name'
        });
      }
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