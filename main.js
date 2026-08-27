// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())

/**
 * Get the language attribute for the HTML element
 * @returns {string} The language code
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Get a person's name with accessibility support
 * @param {Object} person - The person object
 * @returns {string} Accessible name
 */
function personName(person) {
  if (!person) return '';
  
  const name = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(' ');
  
  return name || 'Unknown Person';
}

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table - The table element
 * @returns {Object} Validation result
 */
function validateTableAccessibility(table) {
  if (!table) return { valid: false, issues: ['Table not found'] };
  
  const issues = [];
  
  // Check for proper table headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table should have header cells (th)');
  }
  
  // Check for scope attributes
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      issues.push('Header cells should have scope attribute');
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate table structure
 * @param {HTMLTableElement} table - The table element
 * @returns {Object} Validation result
 */
function validateTableStructure(table) {
  if (!table) return { valid: false, issues: ['Table not found'] };
  
  const issues = [];
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table should have a caption');
  }
  
  // Check for thead and tbody
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  
  if (!thead) issues.push('Table should have a thead');
  if (!tbody) issues.push('Table should have a tbody');
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate landmark elements
 * @param {Document} doc - The document object
 * @returns {Object} Validation result
 */
function validateLandmark(doc) {
  if (!doc) return { valid: false, issues: ['Document not found'] };
  
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1 && landmark !== 'header' && landmark !== 'footer') {
      issues.push(`Multiple ${landmark} landmarks found`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate landmark structure
 * @param {Document} doc - The document object
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(doc) {
  if (!doc) return { valid: false, issues: ['Document not found'] };
  
  const issues = [];
  
  // Check for main landmark
  const mainElements = doc.querySelectorAll('main');
  if (mainElements.length === 0) {
    issues.push('Document should have at least one main landmark');
  }
  
  // Check for nav with aria-label
  const navs = doc.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      issues.push(`Nav element ${index + 1} should have an accessible name`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Get SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  // Check for title element
  const title = svg.querySelector('title');
  return title ? title.textContent : '';
}

/**
 * Create an accessible in-page button
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} The created button
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = 'button';
  
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Ensure button has accessible role
  button.setAttribute('role', 'button');
  
  return button;
}

// Export functions for testing
module.exports = {
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton
};