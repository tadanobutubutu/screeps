// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

/**
 * Checks if a link element is accessible (has discernible text or aria-label)
 * @param {HTMLElement} linkElement - The link element to check
 * @returns {boolean} - True if the link is accessible
 */
function isLinkAccessible(linkElement) {
  if (!linkElement || linkElement.tagName !== 'A') {
    return false;
  }
  
  const ariaLabel = linkElement.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return true;
  }
  
  const textContent = linkElement.textContent;
  if (textContent && textContent.trim().length > 0) {
    return true;
  }
  
  // Check for img with alt text inside the link
  const img = linkElement.querySelector('img');
  if (img && img.getAttribute('alt')) {
    return true;
  }
  
  // Check for aria-labelledby
  const labelledBy = linkElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    return true;
  }
  
  return false;
}

/**
 * Checks links and buttons for accessibility issues
 * @param {Document|HTMLElement} [root=document] - The root element to search within
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(root = document) {
  const issues = [];

  // Check links
  const links = root.querySelectorAll('a');
  links.forEach((link, index) => {
    if (!isLinkAccessible(link)) {
      issues.push({
        type: 'link',
        element: link,
        index: index,
        message: 'Link has no discernible text'
      });
    }
  });

  // Check buttons
  const buttons = root.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const ariaLabel = button.getAttribute('aria-label');
    const textContent = button.textContent && button.textContent.trim();
    
    if (!ariaLabel && !textContent) {
      issues.push({
        type: 'button',
        element: button,
        index: index,
        message: 'Button has no accessible name'
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