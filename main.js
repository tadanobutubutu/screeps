// TODO: This is the existing code that needs to be preserved

/**
 * Accessibility Utility Functions
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix 26 table structure issues
 * - REACT_017: Add/fix 4 landmark issues
 * - REACT_041: Add accessible names to 2 SVGs
 * - REACT_025: Ensure unique landmarks (2 issues)
 * - REACT_036: Fix 1 fake link issue
 */

/**
 * Gets the language attribute value for the HTML element
 * Addresses REACT_015
 * @returns {string} The language code (e.g., 'en', 'es', 'fr')
 */
function getLangAttribute() {
  // Default to 'en' but should be dynamically set based on document language
  return document.documentElement.lang || 'en';
}

/**
 * Gets a person's name with proper accessibility handling
 * Addresses REACT_015 and REACT_036
 * @param {Object} person - Person object with name properties
 * @returns {string} Accessible name string
 */
function personName(person) {
  if (!person) return '';
  
  const parts = [];
  if (person.firstName) parts.push(person.firstName);
  if (person.middleName) parts.push(person.middleName);
  if (person.lastName) parts.push(person.lastName);
  
  const fullName = parts.join(' ');
  return fullName;
}

/**
 * Validates table accessibility requirements
 * Addresses REACT_027
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with passed status and any issues
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { passed: false, issues: ['Table element not provided'] };
  }
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaderCells = table.querySelector('th') !== null;
  const hasScope = table.querySelectorAll('th[scope]').length > 0;
  
  if (!hasCaption) {
    issues.push('Table should have a caption element for accessibility');
  }
  
  if (!hasHeaderCells) {
    issues.push('Table should have header cells (th) for accessibility');
  }
  
  if (!hasScope) {
    issues.push('Header cells should have scope attributes');
  }
  
  return {
    passed: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates table structure for accessibility
 * Addresses REACT_027
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with passed status and any issues
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    return { passed: false, issues: ['Table element not provided'] };
  }
  
  const rows = table.querySelectorAll('tr');
  const cells = table.querySelectorAll('td, th');
  
  if (rows.length === 0) {
    issues.push('Table must have at least one row');
  }
  
  if (cells.length === 0) {
    issues.push('Table must have at least one cell');
  }
  
  // Check for proper table structure
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  if (thead && !thead.querySelector('th')) {
    issues.push('thead should contain th elements for headers');
  }
  
  return {
    passed: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates landmark regions for accessibility
 * Addresses REACT_017
 * @param {Document|Element} context - The context to search in
 * @returns {Object} Validation result with passed status and any issues
 */
function validateLandmark(context = document) {
  const issues = [];
  const landmarks = context.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], header, [role="contentinfo"], footer, [role="search"], [role="complementary"], aside');
  
  if (landmarks.length === 0) {
    issues.push('Page should have at least one landmark region');
  }
  
  const mainLandmarks = context.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length === 0) {
    issues.push('Page should have a main landmark');
  }
  
  if (mainLandmarks.length > 1) {
    issues.push('Page should have only one main landmark');
  }
  
  return {
    passed: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates landmark structure for proper nesting and organization
 * Addresses REACT_017 and REACT_025
 * @param {Document|Element} context - The context to search in
 * @returns {Object} Validation result with passed status and any issues
 */
function validateLandmarkStructure(context = document) {
  const issues = [];
  const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary'];
  const existingLandmarks = new Map();
  
  landmarkRoles.forEach(role => {
    const elements = context.querySelectorAll(`[role="${role}"], ${role === 'main' ? 'main' : role}`);
    if (elements.length > 1) {
      issues.push(`Multiple ${role} landmarks found (${elements.length}). Only one should exist per page.`);
    }
  });
  
  return {
    passed: issues.length === 0,
    issues: issues
  };
}

/**
 * Gets accessible name for an SVG element
 * Addresses REACT_041
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const referencedElement = document.getElementById(ariaLabelledBy);
    if (referencedElement) return referencedElement.textContent;
  }
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  return '';
}

/**
 * Creates an accessible in-page button
 * Addresses REACT_036
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {Function} options.onClick - Click handler
 * @param {string} options.id - Button ID
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  
  if (options.id) {
    button.id = options.id;
  }
  
  if (options.text) {
    button.textContent = options.text;
    button.setAttribute('aria-label', options.text);
  }
  
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

// Export all functions for use in other modules
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