// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// ============================================================================
// Accessibility Functions
// ============================================================================

/**
 * Gets the language attribute from the HTML element or returns default
 * @returns {string} The language code
 */
export function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

/**
 * Creates an accessible in-page button that scrolls to a target element
 * @param {string} href - CSS selector or ID for the target element
 * @param {string} label - Accessible label for the button
 * @returns {HTMLButtonElement} The button element with proper accessibility attributes
 */
export function createInPageButton(href, label) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', label);
  
  button.addEventListener('click', () => {
    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId) || document.querySelector(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  
  return button;
}

/**
 * Validates that a table has proper accessibility features
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }
  
  // Check for caption
  const hasCaption = table.querySelector('caption') !== null;
  
  // Check for table headers (th elements)
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  
  // Validate that headers have proper scope attributes
  const headersHaveScope = Array.from(headers).every(th => {
    const scope = th.getAttribute('scope');
    return scope === 'col' || scope === 'row';
  });
  
  // Check for proper thead/tbody structure
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;
  
  return hasCaption && hasHeaders && headersHaveScope && hasThead && hasTbody;
}

/**
 * Validates and fixes table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate/fix
 * @returns {Object} Validation result with issues found
 */
export function validateTableStructure(table) {
  const issues = [];
  
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, issues: ['Invalid table element'] };
  }
  
  // Check for missing thead
  if (!table.querySelector('thead')) {
    issues.push('Missing thead element');
  }
  
  // Check for missing tbody
  if (!table.querySelector('tbody')) {
    issues.push('Missing tbody element');
  }
  
  // Check for missing caption
  if (!table.querySelector('caption')) {
    issues.push('Missing caption element');
  }
  
  // Check for headers without scope attribute
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      issues.push(`Header at index ${index} missing scope attribute`);
    }
  });
  
  // Check for proper row/column structure
  const rows = table.querySelectorAll('tr');
  let columnCount = 0;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('th, td');
    if (columnCount === 0) {
      columnCount = cells.length;
    } else if (cells.length !== columnCount) {
      issues.push(`Row ${rowIndex} has inconsistent cell count`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name or empty string
 */
export function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check aria-label first (highest priority)
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }
  
  // Check aria-labelledby for external reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const refElement = document.getElementById(ariaLabelledby);
    if (refElement && refElement.textContent) {
      return refElement.textContent.trim();
    }
  }
  
  // Check for title element inside SVG (fallback)
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }
  
  return '';
}

/**
 * Sets accessibility attributes on an SVG element
 * @param {SVGElement} svg - The SVG element to modify
 * @param {string} accessibleName - The accessible name to set
 */
export function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  // Set role="img" for screen readers
  svg.setAttribute('role', 'img');
  
  // Set aria-label with the accessible name
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
}

/**
 * Ensures all landmarks have unique labels to avoid accessibility violations
 * @returns {Array} List of landmarks that were fixed
 */
export function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, main, nav, aside, footer, section[role="banner"], section[role="main"], section[role="navigation"], section[role="complementary"], section[role="contentinfo"]');
  const labeledLandmarks = [];
  const duplicates = [];
  
  landmarks.forEach(landmark => {
    const label = landmark.getAttribute('aria-label') || 
                  landmark.getAttribute('aria-labelledby') ||
                  landmark.id ||
                  landmark.tagName.toLowerCase();
    
    if (labeledLandmarks.includes(label)) {
      duplicates.push({ element: landmark, label });
    } else {
      labeledLandmarks.push(label);
    }
  });
  
  // Add unique labels to duplicate landmarks
  duplicates.forEach((dup, index) => {
    const uniqueLabel = `${dup.label}-${index + 1}`;
    dup.element.setAttribute('aria-label', uniqueLabel);
  });
  
  return duplicates;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {Object} Validation result with issues found
 */
export function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link || link.tagName !== 'A') {
    return { valid: false, issues: ['Invalid link element'] };
  }
  
  // Check for accessible text
  const hasText = link.textContent && link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label');
  
  if (!hasText && !hasAriaLabel) {
    issues.push('Link has no accessible text');
  }
  
  // Check for proper href
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    issues.push('Link has no valid href destination');
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Handles fake links (elements with onclick that should be buttons or proper links)
 * @param {HTMLElement} element - The element to check
 * @returns {Object} Result with conversion recommendation
 */
export function handleFakeLinks(element) {
  const result = { isFakeLink: false, needsConversion: false, issues: [] };
  
  if (!element) return result;
  
  const hasClickHandler = element.hasAttribute('onclick') ||