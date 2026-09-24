// main.js - Accessibility fixes

/**
 * Gets the appropriate lang attribute for the HTML element.
 * @returns {string} The language code (e.g., 'en').
 */
function getLangAttribute() {
  // In a real implementation, this might come from configuration or navigator
  return navigator.language || 'en';
}

/**
 * Creates an in-page button for skip navigation.
 * @returns {HTMLElement} The skip button element.
 */
function createInPageButton() {
  const skipButton = document.createElement('button');
  skipButton.textContent = 'Skip to main content';
  skipButton.className = 'skip-link';
  skipButton.addEventListener('click', () => {
    const main = document.querySelector('main') || document.querySelector('#main');
    if (main) main.focus();
  });
  return skipButton;
}

/**
 * Validates table accessibility.
 * @param {HTMLTableElement} table - The table to validate.
 * @returns {boolean} True if accessible.
 */
function validateTableAccessibility(table) {
  // Check for summary attribute or caption
  if (!table.summary && !table.caption) {
    console.warn('Table missing summary or caption for accessibility.');
    return false;
  }
  // Check for proper header rows
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    console.warn('Table missing header cells.');
    return false;
  }
  return true;
}

/**
 * Validates table structure (e.g., correct use of tbody, thead).
 * @param {HTMLTableElement} table - The table to validate.
 * @returns {boolean} True if structure is valid.
 */
function validateTableStructure(table) {
  // Simple check: ensure table has rows
  if (table.rows.length === 0) {
    console.warn('Table has no rows.');
    return false;
  }
  // Could add more checks
  return true;
}

/**
 * Gets an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || 'SVG graphic';
}

/**
 * Sets accessibility attributes on an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @param {Object} attrs - Attributes to set (e.g., { 'aria-label': 'Chart' }).
 */
function setSvgAttributes(svg, attrs) {
  for (const [key, value] of Object.entries(attrs)) {
    svg.setAttribute(key, value);
  }
}

/**
 * Ensures that landmark elements have unique roles or labels.
 * This is a placeholder; actual implementation might check for duplicates.
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role], main, nav, aside, footer, header');
  const roles = new Set();
  landmarks.forEach(el => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    if (roles.has(role)) {
      console.warn(`Duplicate landmark role: ${role}`);
    } else {
      roles.add(role);
    }
  });
}

/**
 * Validates link accessibility.
 * @param {HTMLAnchorElement} link - The link element.
 * @returns {boolean} True if accessible.
 */
function validateLinkAccessibility(link) {
  const text = link.textContent.trim();
  if (!text) {
    console.warn('Link has no text content.');
    return false;
  }
  if (text === 'click here' || text === 'read more') {
    console.warn('Link has non-descriptive text.');
    return false;
  }
  return true;
}

/**
 * Handles fake links (e.g., elements that look like links but aren't).
 * Replaces them with proper buttons or adds role="button".
 */
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    // Add click event if needed
  });
}

/**
 * Adds proper landmark regions to the document.
 * Ensures there is a main, nav, etc. if missing.
 */
function addProperLandmarkRegions() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    document.body.insertBefore(main, document.body.firstChild);
  }
  // Similar for other landmarks
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    validateLinkAccessibility,
    handleFakeLinks,
    addProperLandmarkRegions
  };
}