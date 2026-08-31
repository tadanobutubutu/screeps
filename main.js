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

function calculateProduct(a, b) {
  return a * b;
}

function checkLinkAndButtonAccessibility(rootElement) {
  const elements = rootElement || (typeof document !== 'undefined' ? document : null);
  
  if (!elements) {
    return {
      totalIssues: 0,
      issues: [],
      hasIssues: false
    };
  }

  const issues = [];

  // Check links for accessibility
  const links = elements.querySelectorAll('a[href], area[href]');
  links.forEach((link, index) => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label');
    const hasAriaLabelledBy = link.getAttribute('aria-labelledby');
    const hasTitle = link.getAttribute('title');
    const img = link.querySelector('img[alt]');
    const hasImgAlt = img && img.getAttribute('alt') && img.getAttribute('alt').trim().length > 0;
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasImgAlt) {
      issues.push({
        type: 'link',
        index: index,
        element: link
      });
    }
  });

  // Check buttons for accessibility
  const buttons = elements.querySelectorAll('button, [role="button"]');
  buttons.forEach((button, index) => {
    const hasText = button.textContent.trim().length > 0;
    const hasAriaLabel = button.getAttribute('aria-label');
    const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
    const hasTitle = button.getAttribute('title');
    const img = button.querySelector('img[alt]');
    const hasImgAlt = img && img.getAttribute('alt') && img.getAttribute('alt').trim().length > 0;
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasImgAlt) {
      issues.push({
        type: 'button',
        index: index,
        element: button
      });
    }
  });

  const result = {
    totalIssues: issues.length,
    issues: issues,
    hasIssues: issues.length > 0
  };

  return result;
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