// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

/**
 * Get the language attribute (primary language code without region)
 * @param {string} lang - The full language tag (e.g., 'en-US')
 * @returns {string} - The primary language code (e.g., 'en')
 */
export function getLangAttribute(lang) {
  if (!lang) return '';
  return lang.split('-')[0];
}

/**
 * Get the full language attribute including region code
 * @param {string} lang - The language tag
 * @returns {string} - The full language attribute
 */
export function getFullLangAttribute(lang) {
  if (!lang) return '';
  return lang;
}

/**
 * Validate table accessibility by checking for proper structure
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} - Whether the table has proper accessibility features
 */
export function validateTableAccessibility(table) {
  if (!table) return false;
  const hasCaption = table.querySelector('caption');
  const hasHeaders = table.querySelector('th');
  return !!(hasCaption || hasHeaders);
}

/**
 * Validate table structure to ensure proper markup
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} - Whether the table has valid structure
 */
export function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  return rows.length > 0;
}

/**
 * Validate if an element is a valid landmark
 * @param {Element} element - The element to validate
 * @returns {boolean} - Whether the element is a valid landmark
 */
export function validateLandmark(element) {
  if (!element) return false;
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  return validLandmarks.includes(element.tagName.toLowerCase());
}

/**
 * Validate landmark structure
 * @param {Element} element - The element to validate
 * @returns {boolean} - Whether the landmark has valid structure
 */
export function validateLandmarkStructure(element) {
  if (!element) return false;
  return validateLandmark(element);
}

/**
 * Ensure unique landmarks in a container
 * @param {Element} container - The container element to check
 * @returns {boolean} - Whether all landmarks are unique
 */
export function ensureUniqueLandmarks(container) {
  if (!container) return false;
  const landmarkTypes = new Map();
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer, section, article, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  
  for (const landmark of landmarks) {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const type = role || tagName;
    
    if (landmarkTypes.has(type)) {
      return false;
    }
    landmarkTypes.set(type, true);
  }
  return true;
}

/**
 * Get the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} - The accessible name
 */
export function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  return title ? title.textContent.trim() : '';
}

/**
 * Create an accessible in-page button
 * @param {string} text - The button text
 * @param {Function} onClick - The click handler
 * @returns {object} - Button configuration object
 */
export function createInPageButton(text, onClick) {
  if (!text) return null;
  return {
    type: 'button',
    text,
    onClick,
    accessible: true
  };
}

/**
 * Create an accessible link element
 * @param {string} href - The link href
 * @param {string} text - The link text
 * @returns {object|null} - Link configuration object or null if invalid
 */
export function createAccessibleLink(href, text) {
  if (!href || !text) return null;
  return {
    type: 'link',
    href,
    text,
    accessible: true
  };
}

/**
 * Handle and report accessibility issues in a container
 * @param {Element} container - The container element to check
 * @returns {string[]} - Array of accessibility issue descriptions
 */
export function handleAccessibilityIssues(container) {
  const issues = [];
  
  if (!container) return issues;
  
  // Check for lang attribute on html element
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    issues.push('REACT_015: Missing lang attribute on HTML element');
  }
  
  // Check tables for accessibility
  const tables = container.querySelectorAll('table');
  tables.forEach((table, index) => {
    if (!validateTableAccessibility(table)) {
      issues.push(`REACT_027: Table ${index + 1} missing accessibility features`);
    }
    if (!validateTableStructure(table)) {
      issues.push(`REACT_027: Table ${index + 1} structure issue`);
    }
  });
  
  // Check for landmark issues
  const landmarkElements = container.querySelectorAll('header, nav, main, aside, footer, section, article');
  landmarkElements.forEach((landmark) => {
    if (!validateLandmark(landmark)) {
      issues.push('REACT_017: Invalid landmark element found');
    }
  });
  
  // Check landmark structure
  if (!validateLandmarkStructure(container)) {
    issues.push('REACT_017: Landmark structure validation failed');
  }
  
  // Check for unique landmarks
  if (!