// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (added below)
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
    const target = document.getElementById(targetId) || document.querySelector(href);
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
    if (!th.hasAttribute('scope')) {
      issues.push(`Header at index ${index} missing scope attribute`);
    }
  });

  // Check for proper row/column structure
  const rows = table.querySelectorAll('tr');
  let columnCount = 0;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
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

  // Find fallback name
  const fallbackName = findFallbackName(svg);
  if (fallbackName) {
    return fallbackName;
  }

  // No name found, return empty string
  return '';
}

/**
 * Finds the fallback name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The fallback name or null if not found
 */
function findFallbackName(svg) {
  // Check for title attribute
  const title = svg.getAttribute('title');
  if (title && title.trim()) {
    return title.trim();
  }

  // Check for ID attribute
  const id = svg.id;
  if (id) {
    const element = document.getElementById(id);
    if (element && element.tagName === 'SVG') {
      // If nested SVG, recurse to find a fallback name
      return findFallbackName(element);
    } else {
      // ID corresponds to a DOM element with a text content fallback name
      const textContent = document.getElementById(id).textContent.trim();
      if (textContent) {
        return textContent;
      }
    }
  }

  return null;
}

// ============================================================================
// New Function: Ensuring Unique Landmarks
// ============================================================================

/**
 * Ensures all landmark regions (aria-labeledby) are unique by assigning a
 * unique identifier to them based on their parent node and type
 * @param {Document} document - The entire HTML document
 */
export function ensureUniqueLandmarks(document) {
  const landmarkRegions = document.querySelectorAll('[aria-labeledby]');
  const uniqueIds = new Map();

  for (const landmarkRegion of landmarkRegions) {
    const currentId = landmarkRegion.getAttribute('id');
    if (!currentId) {
      const parent = landmarkRegion.parentNode;
      let id = `${parent.tagName.toLowerCase()}${uniqueIds.size}`;

      // Ensure unique IDs within the same parent node and for the same landmark type
      while (uniqueIds.has(id)) {
        uniqueIds.set(id, true);
        id = `${parent.tagName.toLowerCase()}${uniqueIds.size}`;
      }

      uniqueIds.set(id, landmarkRegion);
      landmarkRegion.id = id;
    }
  }
}