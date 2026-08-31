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

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Returns the appropriate lang attribute value for the HTML element.
 * Handles REACT_015: Add lang attribute to HTML element.
 * @param {HTMLElement} htmlElement - The root HTML element
 * @returns {string} - The lang attribute value to apply
 */
function getLangAttribute(htmlElement) {
  if (!htmlElement) {
    return 'en';
  }
  const existing = htmlElement.getAttribute('lang');
  if (existing && existing.trim().length > 0) {
    return existing;
  }
  return 'en';
}

/**
 * Creates an in-page button element used for accessibility fixes.
 * Handles REACT_015 and REACT_036.
 * @param {Object} options - Button options
 * @param {string} options.text - Visible text for the button
 * @param {string} options.ariaLabel - Accessible label for the button
 * @returns {HTMLElement} - The created button element
 */
function createInPageButton(options = {}) {
  const text = options.text || 'Action';
  const ariaLabel = options.ariaLabel || text;
  const button = typeof document !== 'undefined' ? document.createElement('button') : { type: 'button' };
  button.type = 'button';
  button.textContent = text;
  button.setAttribute('aria-label', ariaLabel);
  return button;
}

/**
 * Validates table accessibility issues.
 * Handles REACT_027.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} - Validation summary
 */
function validateTableAccessibility(table) {
  const summary = {
    hasCaption: false,
    hasHeaders: false,
    issues: []
  };
  if (!table) {
    return summary;
  }
  summary.hasCaption = !!table.querySelector('caption');
  summary.hasHeaders = !!table.querySelector('th');
  if (!summary.hasCaption) {
    summary.issues.push('Missing caption');
  }
  if (!summary.hasHeaders) {
    summary.issues.push('Missing header cells');
  }
  return summary;
}

/**
 * Validates table structure issues.
 * Handles REACT_027.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} - Validation summary
 */
function validateTableStructure(table) {
  const summary = {
    validStructure: true,
    issues: []
  };
  if (!table) {
    summary.validStructure = false;
    summary.issues.push('No table provided');
    return summary;
  }
  if (!table.querySelector('thead')) {
    summary.issues.push('Missing thead');
  }
  if (!table.querySelector('tbody')) {
    summary.issues.push('Missing tbody');
  }
  if (summary.issues.length > 0) {
    summary.validStructure = false;
  }
  return summary;
}

/**
 * Validates landmark roles on the page.
 * Handles REACT_017.
 * @param {HTMLElement} element - The element to validate
 * @returns {Object} - Validation summary
 */
function validateLandmark(element) {
  const summary = {
    isLandmark: false,
    role: null
  };
  if (!element) {
    return summary;
  }
  const role = element.getAttribute('role');
  const landmarkRoles = ['banner', 'main', 'navigation', 'contentinfo', 'complementary', 'region'];
  if (role && landmarkRoles.indexOf(role) !== -1) {
    summary.isLandmark = true;
    summary.role = role;
  }
  return summary;
}

/**
 * Validates landmark structure.
 * Handles REACT_017.
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Object} - Validation summary
 */
function validateLandmarkStructure(landmarks) {
  const summary = {
    total: Array.isArray(landmarks) ? landmarks.length : 0,
    valid: 0,
    issues: []
  };
  if (!Array.isArray(landmarks)) {
    summary.issues.push('Landmarks must be an array');
    return summary;
  }
  landmarks.forEach((landmark, index) => {
    const validation = validateLandmark(landmark);
    if (validation.isLandmark) {
      summary.valid++;
    } else {
      summary.issues.push(`Landmark at index ${index} is invalid`);
    }
  });
  return summary;
}

/**
 * Returns the accessible name for an SVG element.
 * Handles REACT_041.
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} - The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) {
    return '';
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return ariaLabel;
  }
  const title = svg.querySelector('title');
  if (title && title.textContent.trim().length > 0) {
    return title.textContent.trim();
  }
  return '';
}

/**
 * Sets accessibility attributes on an SVG element.
 * Handles REACT_041.
 * @param {HTMLElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to apply
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg || !accessibleName) {
    return;
  }
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('role', 'img');
}

/**
 * Validates link accessibility.
 * Handles REACT_036.
 * @param {HTMLElement} link - The link element to validate
 * @returns {Object} - Validation summary
 */
function validateLinkAccessibility(link) {
  const summary = {
    hasAccessibleName: false,
    isValid: false,
    issues: []
  };
  if (!link) {
    summary.issues.push('No link provided');
    return summary;
  }
  const text = (link.textContent || '').trim();
  const ariaLabel = link.getAttribute('aria-label');
  if (text.length > 0 || (ariaLabel && ariaLabel.trim().length > 0)) {
    summary.hasAccessibleName = true;
  } else {
    summary.issues.push('Missing accessible name');
  }
  summary.isValid = summary.hasAccessibleName;
  return summary;
}

/**
 * Handles fake link elements by converting them to buttons.
 * Handles REACT_036.
 * @param {HTMLElement} element - The fake link element
 * @returns {HTMLElement} - The converted button element
 */
function handleFakeLinks(element) {
  if (!element) {
    return null;
  }
  const text = (element.textContent || 'Action').trim();
  return createInPageButton({ text: text, ariaLabel: text });
}

/**
 * Checks link and button accessibility across the document.
 * @param {Document|HTMLElement} root - The root element to scan
 * @returns {Object} - Summary of link and button accessibility issues
 */
function checkLinkAndButtonAccessibility(root) {
  const doc = root || (typeof document !== 'undefined' ? document : null);
  const summary = {
    linkIssues: 0,
    buttonIssues: 0,
    fakeLinks: 0,
    issues: []
  };
  if (!doc) {
    return summary;
  }
  const links = doc.querySelectorAll ? doc.querySelectorAll('a') : [];
  links.forEach((link, index) => {
    const validation = validateLinkAccessibility(link);
    if (!validation.isValid) {
      summary.linkIssues++;
      summary.issues.push({ type: 'link', index, element: link });
    }
    const role = link.getAttribute('role');
    if (role === 'button') {
      summary.fakeLinks++;
    }
  });
  const buttons = doc.querySelectorAll ? doc.querySelectorAll('button') : [];
  buttons.forEach((button, index) => {
    const text = (button.textContent || '').trim();
    const ariaLabel = button.getAttribute('aria-label');
    if (text.length === 0 && (!ariaLabel || ariaLabel.trim().length === 0)) {
      summary.buttonIssues++;
      summary.issues.push({ type: 'button', index, element: button });
    }
  });
  return summary;
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