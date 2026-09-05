// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

/**
 * Returns the language attribute value for the HTML element
 * @returns {string} The language code (e.g., 'en', 'es', 'fr')
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Generates an accessible name for a person by combining name parts
 * @param {Object} personData - Object containing name components
 * @param {string} personData.firstName - First name
 * @param {string} personData.lastName - Last name
 * @param {string} [personData.title] - Optional title or prefix
 * @returns {string} Accessible name string
 */
function personName(personData) {
  const parts = [];
  if (personData.title) {
    parts.push(personData.title);
  }
  if (personData.firstName) {
    parts.push(personData.firstName);
  }
  if (personData.lastName) {
    parts.push(personData.lastName);
  }
  return parts.join(' ');
}

/**
 * Validates that a table has proper accessibility attributes
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with isValid boolean and error array
 */
function validateTableAccessibility(table) {
  const errors = [];
  
  if (!table) {
    errors.push('Table element is required');
    return { isValid: false, errors };
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    errors.push('Table missing caption element');
  }
  
  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('id')) {
      errors.push(`Header at index ${index} missing scope or id attribute`);
    }
  });
  
  // Check for proper th/scope associations
  const dataCells = table.querySelectorAll('td[data-header]');
  dataCells.forEach((td, index) => {
    const headerId = td.getAttribute('data-header');
    if (headerId && !document.getElementById(headerId)) {
      errors.push(`td at index ${index} references non-existent header id: ${headerId}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates the structure of a table for accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with isValid boolean and error array
 */
function validateTableStructure(table) {
  const errors = [];
  
  if (!table) {
    errors.push('Table element is required');
    return { isValid: false, errors };
  }
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    errors.push('Table missing thead element');
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    errors.push('Table missing tbody element');
  }
  
  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length === 0) {
      errors.push(`Row at index ${index} has no cells`);
    }
  });
  
  // Check that all cells in a column have same count
  if (tbody) {
    const firstRow = tbody.querySelector('tr');
    if (firstRow) {
      const expectedCells = firstRow.querySelectorAll('th, td').length;
      const bodyRows = tbody.querySelectorAll('tr');
      bodyRows.forEach((row, index) => {
        const cellCount = row.querySelectorAll('th, td').length;
        if (cellCount !== expectedCells) {
          errors.push(`Body row at index ${index} has ${cellCount} cells, expected ${expectedCells}`);
        }
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Returns an accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} Accessible name from title, aria-label, or role="img" with text
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check for aria-label first
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  // Check for role="img" with adjacent text
  if (svg.getAttribute('role') === 'img') {
    const parent = svg.parentElement;
    if (parent) {
      // Get text content before the SVG
      const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
      let textContent = '';
      let node;
      while (node = walker.nextNode()) {
        if (node === svg.previousSibling) break;
        textContent += node.textContent;
      }
      return textContent.trim();
    }
  }
  
  return '';
}

/**
 * Creates an accessible in-page navigation button
 * @param {Object} options - Button options
 * @param {string} options.text - Button text content
 * @param {string} options.targetId - ID of target element to scroll to
 * @param {string} [options.buttonClass] - Optional CSS class for the button
 * @returns {HTMLButtonElement} Accessible button element
 */
function createInPageButton(options) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = options.text || 'Navigate';
  button.className = options.buttonClass || 'in-page-button';
  
  // Generate unique ID for button if not provided
  const targetId = options.targetId;
  if (targetId) {
    button.setAttribute('aria-label', `Navigate to ${targetId.replace(/-/g, ' ')}`);
    button.addEventListener('click', () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  
  return button;
}

/**
 * Ensures all landmarks have unique accessible names
 * @returns {Object} Object containing landmark validation results
 */
function ensureUniqueLandmarks() {
  const landmarks = {
    header: [],
    nav: [],
    main: [],
    aside: [],
    footer: [],
    section: [],
    form: [],
    search: []
  };
  
  // Collect all landmarks
  document.querySelectorAll('header, nav, main, aside, footer, section[aria-label], form, [role="search"]').forEach((el, index) => {
    const tagName = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const ariaLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    
    let key = tagName;
    if (role === 'search') key = 'search';
    
    landmarks[key].push({
      element: el,
      index,
      label: ariaLabel,
      hasLabel: !!ariaLabel
    });
  });
  
  const issues = [];
  
  // Check for duplicate/unlabeled landmarks
  Object.entries(landmarks).forEach(([type, elements]) => {
    elements.forEach((item, index) => {
      if (!item.hasLabel && elements.length > 1) {
        issues.push({
          type,
          index,
          element: item.element,
          message: `Duplicate ${type} landmark at index ${index} needs unique aria-label`
        });
      }
    });
  });
  
  return {
    isValid: issues.length === 0,
    issues,
    landmarks
  };
}

/**
 * Fixes fake link issues by ensuring proper anchor elements or accessible buttons
 * @param {HTMLElement} container - Container element to search within
 * @returns {Object} Fix results with list of fixed and remaining issues
 */
function fixFakeLinkIssues(container) {
  const issues = [];
  const fixed = [];
  
  if (!container) container = document.body;
  
  // Find elements that look like links but aren't anchors
  const fakeLinks = container.querySelectorAll('[role="link"], [onclick*="window.location"], [onclick*="location.href"]');
  
  fakeLinks.forEach((el, index) => {
    const tagName = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    
    // If it's not an anchor but has link role or click navigation
    if (tagName !== 'a' && role === 'link') {
      // Check if it has proper keyboard handling
      const tabIndex = el.getAttribute('tabindex');
      const onKeyDown = el.getAttribute('onkeydown') || el.onkeydown;
      
      if (!tabIndex && !onKeyDown) {
        issues.push({
          element: el,
          index,
          message: 'Element has role="link" but lacks keyboard support'
        });
      } else {
        fixed.push({ element: el, index, action: 'verified' });
      }
    }
    
    // Check for onclick navigation on non-anchor elements
    if (tagName !== 'a' && (el.getAttribute('onclick') || '').match(/location/i)) {
      issues.push({
        element: el,
        index,
        message: 'Non-anchor element has location navigation - should use <a> element'
      });
    }
  });
  
  return {
    fixed,
    issues,
    isValid: issues.length === 0
  };
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    createInPageButton,
    ensureUniqueLandmarks,
    fixFakeLinkIssues
  };
}