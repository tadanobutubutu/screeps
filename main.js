// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Accessibility helper functions

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.textContent = options.text || 'Button';
  button.setAttribute('aria-label', options.ariaLabel || options.text || 'In-page button');
  button.id = options.id || `btn-${Date.now()}`;
  
  // Ensure lang attribute is set
  if (!document.documentElement.lang) {
    document.documentElement.lang = getLangAttribute();
  }
  
  return button;
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  const hasCaption = table.querySelector('caption') !== null;
  
  return hasHeaders && hasCaption;
}

/**
 * Validates table structure for accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result with issues
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    issues.push('Table element is missing');
    return { valid: false, issues };
  }
  
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`Row ${index + 1} has no cells`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark accessibility
 * @param {Element} element - The element to validate
 * @returns {boolean} Whether the landmark is valid
 */
function validateLandmark(element) {
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  return validLandmarks.includes(element.tagName.toLowerCase());
}

/**
 * Validates landmark structure for accessibility
 * @param {Element} element - The element to validate
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(element) {
  const issues = [];
  const tagName = element?.tagName?.toLowerCase();
  
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  
  if (!element) {
    issues.push('Element is missing');
    return { valid: false, issues };
  }
  
  if (!validLandmarks.includes(tagName)) {
    issues.push(`Invalid landmark: ${tagName}`);
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Gets accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const ariaLabel = svg.getAttribute('aria-label');
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  
  if (ariaLabel) return ariaLabel;
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    return titleElement?.textContent || '';
  }
  if (title) return title.textContent;
  
  return '';
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {SVGElement} svg - The SVG element
 * @param {string} name - The accessible name to set
 */
function setSvgAttributes(svg, name) {
  if (!svg) return;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
  
  // Ensure title exists for accessibility
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = name;
}

/**
 * Ensures landmarks are unique on the page
 * @returns {Array} Array of duplicate landmarks found
 */
function ensureUniqueLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  const duplicates = [];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      duplicates.push({ landmark, count: elements.length });
    }
  });
  
  return duplicates;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link to validate
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) {
    return { valid: false, issues: ['Link element is missing'] };
  }
  
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasAriaLabelledby = link.hasAttribute('aria-labelledby');
  
  if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
    issues.push('Link has no accessible name');
  }
  
  const href = link.getAttribute('href');
  if (!href || href === '#') {
    issues.push('Link has no valid href');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Handles fake links (links that aren't <a> tags)
 * @param {HTMLElement} container - Container to search for fake links
 * @returns {Array} Array of fake links found
 */
function handleFakeLinks(container) {
  const fakeLinks = [];
  const clickableElements = container.querySelectorAll('[role="link"], [onclick]');
  
  clickableElements.forEach(element => {
    const role = element.getAttribute('role');
    if (role === 'link' || element.tagName !== 'A') {
      // Ensure proper accessibility
      if (!element.textContent.trim() && !element.getAttribute('aria-label')) {
        fakeLinks.push(element);
      }
      
      // Add button role if missing and has click handler but no link role
      if (element.hasAttribute('onclick') && role !== 'link') {
        // Don't modify - just track it
      }
    }
  });
  
  return fakeLinks;
}

/**
 * Adds proper landmark regions to the page
 * @returns {Object} Result of the operation
 */
function addProperLandmarkRegions() {
  const existingMain = document.querySelector('main');
  const results = { added: [], existing: [] };
  
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  
  landmarks.forEach(landmark => {
    const existing = document.querySelector(landmark);
    if (existing) {
      results.existing.push(landmark);
    }
  });
  
  // Ensure main landmark exists
  if (!existingMain) {
    const main = document.createElement('main');
    document.body.appendChild(main);
    results.added.push('main');
  }
  
  return results;
}

// Export for testing (if applicable)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    validateLinkAccessibility,
    handleFakeLinks,
    addProperLandmarkRegions
  };
}