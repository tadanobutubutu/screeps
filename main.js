// TODO: This is the existing code that needs to be preserved

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
 * Checks links and buttons in the document for missing accessible names
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility() {
  const issues = [];
  const elements = document.querySelectorAll('a, button');

  elements.forEach((element, index) => {
    const hasAccessibleName = checkAccessibleName(element);
    if (!hasAccessibleName) {
      issues.push({
        type: element.tagName.toLowerCase() === 'a' ? 'link' : 'button',
        element: element,
        index: index,
        parentNode: element.parentNode
      });
    }
  });

  return issues;
}

/**
 * Determines whether an element has an accessible name
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element has an accessible name
 */
function checkAccessibleName(element) {
  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim() !== '') {
    return true;
  }

  // Check for aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement && labelElement.textContent.trim() !== '') {
      return true;
    }
  }

  // Check for visible text content
  if (element.textContent.trim() !== '') {
    return true;
  }

  // Check for child img with alt text
  const img = element.querySelector('img[alt]');
  if (img && img.getAttribute('alt') && img.getAttribute('alt').trim() !== '') {
    return true;
  }

  // Check for title attribute
  const title = element.getAttribute('title');
  if (title && title.trim() !== '') {
    return true;
  }

  // Check for input with alt or aria-label (for embedded controls)
  const input = element.querySelector('input[type="image"][alt], input[type="image"][aria-label]');
  if (input) {
    const alt = input.getAttribute('alt');
    const inputAriaLabel = input.getAttribute('aria-label');
    if ((alt && alt.trim() !== '') || (inputAriaLabel && inputAriaLabel.trim() !== '')) {
      return true;
    }
  }

  return false;
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

function checkLinkAndButtonAccessibility(container) {
  const root = container || (typeof document !== 'undefined' ? document : null);
  if (!root || typeof root.querySelectorAll !== 'function') {
    return [];
  }

  const issues = [];
  let index = 0;

  const checkType = (selector, type) => {
    const elements = root.querySelectorAll(selector);
    elements.forEach((el) => {
      const textContent = el.textContent ? el.textContent.trim() : '';
      const ariaLabel = el.getAttribute ? el.getAttribute('aria-label') : null;
      const hasName = textContent.length > 0 || (ariaLabel && ariaLabel.trim().length > 0);
      if (!hasName) {
        issues.push({
          type: type,
          element: el,
          index: index++
        });
      }
    });
  };

  checkType('a', 'link');
  checkType('button', 'button');

  return issues;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkLinkAndButtonAccessibility,
    addressAccessibilityIssues,
    calculateSum,
    calculateProduct,
    renderDependencyGraph,
    displayModuleStructure
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkLinkAndButtonAccessibility;
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.renderDependencyGraph = renderDependencyGraph;
  window.displayModuleStructure = displayModuleStructure;
}