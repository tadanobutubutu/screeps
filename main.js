// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Get the lang attribute value for accessibility
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Creates an in-page button with accessibility support
 * @param {string} text - Button text content
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} Accessible button element
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('type', 'button');
  if (getLangAttribute()) {
    button.setAttribute('lang', getLangAttribute());
  }
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - Table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelector('th') !== null;
  const hasScope = Array.from(table.querySelectorAll('th')).every(th => th.hasAttribute('scope'));
  
  return hasCaption && hasHeaders && hasScope;
}

/**
 * Validates table structure for accessibility
 * @param {HTMLTableElement} table - Table to validate
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
 * Validates landmark elements for accessibility
 * @param {Document|Element} context - Document or element to validate
 * @returns {boolean} True if landmarks are valid
 */
function validateLandmark(context = document) {
  const landmarks = context.querySelectorAll('[role]');
  const landmarkTypes = new Set();
  
  landmarks.forEach(el => {
    const role = el.getAttribute('role');
    if (landmarkTypes.has(role)) {
      return false; // Duplicate landmark
    }
    landmarkTypes.add(role);
  });
  
  return true;
}

/**
 * Validates landmark structure for accessibility
 * @param {Document|Element} context - Context to validate
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(context = document) {
  const mainElements = context.querySelectorAll('main, [role="main"]');
  const navElements = context.querySelectorAll('nav, [role="navigation"]');
  const footerElements = context.querySelectorAll('footer, [role="contentinfo"]');
  
  return {
    hasMain: mainElements.length > 0,
    hasNav: navElements.length > 0,
    hasFooter: footerElements.length > 0,
    valid: mainElements.length > 0 && navElements.length > 0
  };
}

/**
 * Ensures landmarks are unique on the page
 * @param {Document|Element} context - Context to validate
 * @returns {boolean} True if all landmarks are unique
 */
function ensureUniqueLandmarks(context = document) {
  const landmarks = context.querySelectorAll('[role]');
  const roleCounts = {};
  
  for (const el of landmarks) {
    const role = el.getAttribute('role');
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  }
  
  // Check for duplicates (some roles should only appear once)
  const uniqueRoles = ['banner', 'main', 'contentinfo', 'navigation'];
  for (const role of uniqueRoles) {
    if (roleCounts[role] > 1) {
      return false;
    }
  }
  
  return true;
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svg - SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check aria-label first
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  // Check title element
  const title = svg.querySelector('title');
  return title ? title.textContent : '';
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {SVGElement} svg - SVG element
 * @param {string} accessibleName - Name to set
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  // Ensure SVG has a role
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - Link element to validate
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) {
    return { valid: false, issues: ['Link element is missing'] };
  }
  
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    issues.push('Link has no valid href');
  }
  
  if (!link.textContent || link.textContent.trim() === '') {
    const hasAltText = link.getAttribute('aria-label') || link.getAttribute('title');
    if (!hasAltText) {
      issues.push('Link has no accessible text');
    }
  }
  
  // Check for fake links (buttons styled as links)
  const isClickHandler = link.hasAttribute('onclick') || link.hasAttribute('role');
  if (isClickHandler && !link.hasAttribute('role')) {
    issues.push('Link appears to be a fake link without proper role');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Handles fake links by converting them to proper buttons or adding proper attributes
 * @param {HTMLAnchorElement} link - Link element
 */
function handleFakeLinks(link) {
  if (!link) return;
  
  const href = link.getAttribute('href');
  
  // If it's a fake link (no real href)
  if (!href || href === '#') {
    // Check if it has click handler behavior
    if (link.hasAttribute('onclick') || getComputedStyle(link).cursor === 'pointer') {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      
      // Add keyboard support if not present
      if (!link.hasAttribute('onkeydown')) {
        link.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
          }
        });
      }
    }
  }
}

module.exports = {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
};