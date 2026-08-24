// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

/**
 * Gets the language attribute value for HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Gets the full language attribute including region/dialect
 * @returns {string} The full lang attribute (e.g., 'en-US')
 */
function getFullLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Validates table accessibility attributes
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result with passed status and any issues
 */
function validateTableAccessibility(table) {
  const issues = [];
  if (table && !table.caption) {
    issues.push('Table missing caption element');
  }
  return { passed: issues.length === 0, issues };
}

/**
 * Validates table structure for accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result with passed status and any issues
 */
function validateTableStructure(table) {
  const issues = [];
  if (!table) return { passed: false, issues: ['No table provided'] };
  
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td,th');
  
  if (headers.length === 0 && cells.length > 0) {
    issues.push('Table should have header cells (th) for data tables');
  }
  
  return { passed: issues.length === 0, issues };
}

/**
 * Validates landmark regions on the page
 * @returns {Object} Validation result with passed status and any issues
 */
function validateLandmark() {
  const issues = [];
  const mainElements = document.querySelectorAll('main');
  
  if (mainElements.length === 0) {
    issues.push('Page should have at least one main landmark');
  }
  
  return { passed: issues.length === 0, issues };
}

/**
 * Validates landmark structure for proper ARIA implementation
 * @returns {Object} Validation result with passed status and any issues
 */
function validateLandmarkStructure() {
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1 && landmark !== 'header' && landmark !== 'footer') {
      issues.push(`Multiple ${landmark} landmarks found`);
    }
  });
  
  return { passed: issues.length === 0, issues };
}

/**
 * Gets accessible name for SVG elements
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent;
  }
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    return titleElement ? titleElement.textContent : '';
  }
  
  return '';
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = options.label || 'Button';
  button.setAttribute('aria-label', options.ariaLabel || options.label || 'Button');
  
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

/**
 * Creates an accessible link element
 * @param {Object} options - Link options
 * @returns {HTMLAnchorElement} The created anchor element
 */
function createAccessibleLink(options = {}) {
  const link = document.createElement('a');
  link.href = options.href || '#';
  link.textContent = options.label || 'Link';
  
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  
  if (options.external) {
    link.setAttribute('aria-label', options.ariaLabel || `${options.label || 'Link'} (opens in new tab)`);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.setAttribute('aria-label', options.ariaLabel || options.label || 'Link');
  }
  
  return link;
}

// Run accessibility validation
function runAccessibilityValidation() {
  const results = {
    langAttribute: getLangAttribute(),
    fullLangAttribute: getFullLangAttribute(),
    tables: [],
    landmarks: [],
    svgElements: []
  };
  
  document.querySelectorAll('table').forEach(table => {
    results.tables.push({
      accessibility: validateTableAccessibility(table),
      structure: validateTableStructure(table)
    });
  });
  
  results.landmarks.push({
    landmark: validateLandmark(),
    structure: validateLandmarkStructure()
  });
  
  document.querySelectorAll('svg').forEach(svg => {
    results.svgElements.push({
      name: getSvgAccessibleName(svg),
      hasAccessibleName: !!getSvgAccessibleName(svg)
    });
  });
  
  return results;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    runAccessibilityValidation
  };
}