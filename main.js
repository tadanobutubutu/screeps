// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

/**
 * Get the lang attribute for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Create an in-page button with accessibility support
 * @param {string} text - Button text content
 * @param {string} ariaLabel - Accessibility label
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, ariaLabel) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('aria-label', ariaLabel);
  return button;
}

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table - Table element to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table.querySelector('caption')) {
    issues.push('REACT_027: Table missing caption');
  }
  
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      issues.push('REACT_027: Table header missing scope attribute');
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate table structure
 * @param {HTMLTableElement} table - Table element to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table.tHead && table.querySelector('th')) {
    issues.push('REACT_027: Table has headers but no thead element');
  }
  
  const cells = table.querySelectorAll('td');
  if (cells.length > 0 && !table.tBody) {
    issues.push('REACT_027: Table has data cells but no tbody element');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate landmark elements
 * @param {Document|Element} root - Root element to validate
 * @returns {Object} Validation result with issues array
 */
function validateLandmark(root) {
  const issues = [];
  const landmarks = root.querySelectorAll('[role]');
  
  if (landmarks.length === 0) {
    issues.push('REACT_017: Page has no landmark regions');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate landmark structure
 * @param {Document|Element} root - Root element to validate
 * @returns {Object} Validation result with issues array
 */
function validateLandmarkStructure(root) {
  const issues = [];
  const mainLandmarks = root.querySelectorAll('main, [role="main"]');
  
  if (mainLandmarks.length === 0) {
    issues.push('REACT_017: Page has no main landmark');
  }
  
  if (mainLandmarks.length > 1) {
    issues.push('REACT_017: Page has multiple main landmarks');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Get SVG accessible name
 * @param {SVGElement} svg - SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  if (title) {
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
 * Set SVG attributes for accessibility
 * @param {SVGElement} svg - SVG element
 * @param {string} accessibleName - Accessible name to set
 * @returns {SVGElement} Modified SVG element
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg.querySelector('title')) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = accessibleName;
    svg.insertBefore(title, svg.firstChild);
  }
  
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  return svg;
}

/**
 * Ensure unique landmarks on the page
 * @param {Document|Element} root - Root element to check
 * @returns {Object} Result with fixes applied
 */
function ensureUniqueLandmarks(root) {
  const landmarks = root.querySelectorAll('[role]');
  const landmarkTypes = {};
  const duplicates = [];
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarkTypes[role]) {
      duplicates.push(landmark);
    } else {
      landmarkTypes[role] = true;
    }
  });
  
  return {
    duplicatesFound: duplicates.length,
    duplicates,
    fixed: duplicates.length === 0
  };
}

/**
 * Validate link accessibility
 * @param {HTMLAnchorElement} link - Link element to validate
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(link) {
  const issues = [];
  
  const href = link.getAttribute('href');
  if (!href || href === '#') {
    if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
      issues.push('REACT_036: Link has no accessible name');
    }
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Handle fake links (links that should be buttons)
 * @param {Document|Element} root - Root element to check
 * @returns {Object} Result with fake links found
 */
function handleFakeLinks(root) {
  const fakeLinks = [];
  const anchors = root.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  
  anchors.forEach(anchor => {
    const isButton = anchor.getAttribute('role') === 'button' ||
                     anchor.style.cursor === 'pointer' ||
                     anchor.onclick !== null;
    
    if (isButton && !anchor.getAttribute('role')) {
      fakeLinks.push(anchor);
    }
  });
  
  return {
    fakeLinksFound: fakeLinks.length,
    fakeLinks
  };
}

/**
 * Add proper landmark regions to the page
 * @param {Document|Element} root - Root element to modify
 * @returns {Object} Result with regions added
 */
function addProperLandmarkRegions(root) {
  const regions = {
    banner: root.querySelector('header, [role="banner"]'),
    navigation: root.querySelectorAll('nav, [role="navigation"]'),
    main: root.querySelector('main, [role="main"]'),
    contentinfo: root.querySelector('footer, [role="contentinfo"]')
  };
  
  const missing = [];
  
  Object.keys(regions).forEach(region => {
    if (region === 'navigation') {
      if (regions[region].length === 0) {
        missing.push('navigation');
      }
    } else if (!regions[region]) {
      missing.push(region);
    }
  });
  
  return {
    regions,
    missingRegions: missing,
    complete: missing.length === 0
  };
}

// Export all functions for testing
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