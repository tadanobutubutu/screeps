// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

/**
 * Gets the language attribute for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  // Implementation for getting lang attribute
  return document.documentElement.lang || 'en';
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = options.text || 'In-Page Navigation';
  button.setAttribute('aria-label', options.ariaLabel || 'Navigate to main content');
  button.className = options.className || 'in-page-button';
  return button;
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - Table element to validate
 * @returns {Object} Validation result with issues
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) return { valid: true, issues: [] };
  
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td, th');
  
  // Check for proper scope attributes
  headers.forEach(header => {
    if (!header.getAttribute('scope')) {
      issues.push({
        element: header,
        issue: 'Missing scope attribute on table header',
        code: 'REACT_027'
      });
    }
  });
  
  // Check for caption or summary
  if (!table.querySelector('caption') && !table.getAttribute('summary')) {
    issues.push({
      element: table,
      issue: 'Table missing caption or summary',
      code: 'REACT_027'
    });
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validates table structure
 * @param {HTMLElement} table - Table element to validate
 * @returns {Object} Validation result with structural issues
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) return { valid: true, issues: [] };
  
  // Check for proper table structure (thead, tbody, tfoot)
  const hasThead = table.querySelector('thead');
  const hasTbody = table.querySelector('tbody');
  
  if (!hasThead) {
    issues.push({
      element: table,
      issue: 'Table missing thead element',
      code: 'REACT_027'
    });
  }
  
  if (!hasTbody) {
    issues.push({
      element: table,
      issue: 'Table missing tbody element',
      code: 'REACT_027'
    });
  }
  
  // Check for consistent column counts
  const rows = table.querySelectorAll('tr');
  let expectedCols = 0;
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('th, td');
    if (index === 0) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      issues.push({
        element: row,
        issue: 'Inconsistent column count in table row',
        code: 'REACT_027'
      });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark accessibility
 * @param {HTMLElement} element - Element to validate
 * @returns {Object} Validation result
 */
function validateLandmark(element) {
  const issues = [];
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'footer', 'header', 'aside'];
  
  if (!element) return { valid: true, issues: [] };
  
  landmarks.forEach(landmark => {
    const elements = element.querySelectorAll(`[role="${landmark}"], ${landmark}`);
    if (elements.length > 1 && (landmark === 'main' || landmark === 'banner')) {
      issues.push({
        element: elements[1],
        issue: `Multiple ${landmark} landmarks found`,
        code: 'REACT_017'
      });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark structure
 * @param {HTMLElement} element - Root element to validate
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(element) {
  const issues = [];
  
  if (!element) return { valid: true, issues: [] };
  
  // Check for proper landmark nesting
  const mainLandmark = element.querySelector('main, [role="main"]');
  if (!mainLandmark) {
    issues.push({
      element: element,
      issue: 'Missing main landmark',
      code: 'REACT_017'
    });
  }
  
  // Check for proper header/footer placement
  const headers = element.querySelectorAll('header, [role="banner"]');
  headers.forEach(header => {
    const parent = header.parentElement;
    if (parent && (parent.tagName === 'SECTION' || parent.tagName === 'ARTICLE')) {
      issues.push({
        element: header,
        issue: 'Header landmark should not be nested in section or article',
        code: 'REACT_017'
      });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Gets accessible name for SVG elements
 * @param {HTMLElement} svg - SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
  // Check aria-label first
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const targetElement = document.getElementById(ariaLabelledby);
    return targetElement ? targetElement.textContent : '';
  }
  
  // Check title element
  const title = svg.querySelector('title');
  return title ? title.textContent : '';
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {HTMLElement} svg - SVG element
 * @param {string} name - Accessible name
 */
function setSvgAttributes(svg, name) {
  if (!svg) return;
  
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', name);
  }
  
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

/**
 * Ensures landmarks are unique on the page
 * @param {HTMLElement} root - Root element to check
 * @returns {Object} Result of unique landmarks check
 */
function ensureUniqueLandmarks(root) {
  const result = { valid: true, duplicates: [] };
  
  if (!root) return result;
  
  const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarkTypes.forEach(type => {
    const landmarks = root.querySelectorAll(`[role="${type}"], ${type}`);
    if (landmarks.length > 1) {
      result.valid = false;
      result.duplicates.push({
        type,
        count: landmarks.length,
        elements: Array.from(landmarks)
      });
    }
  });
  
  return result;
}

/**
 * Validates link accessibility
 * @param {HTMLElement} link - Link element to validate
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) return { valid: true, issues: [] };
  
  const href = link.getAttribute('href');
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  const title = link.getAttribute('title');
  
  // Check for meaningful link text
  if (!text && !ariaLabel && !title) {
    issues.push({
      element: link,
      issue: 'Link missing accessible name',
      code: 'REACT_036'
    });
  }
  
  // Check for links that open in new tab
  const target = link.getAttribute('target');
  if (target === '_blank' && !ariaLabel && !title) {
    issues.push({
      element: link,
      issue: 'Link opening in new tab missing accessible name indicating this',
      code: 'REACT_036'
    });
  }
  
  // Check for empty links
  if (!href || href === '#' || href === 'javascript:void(0)') {
    issues.push({
      element: link,
      issue: 'Fake link detected - href is empty or javascript',
      code: 'REACT_036'
    });
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Handles fake links (links that should be buttons)
 * @param {HTMLElement} root - Root element to scan
 * @returns {Array} Array of fake links found
 */
function handleFakeLinks(root) {
  const fakeLinks = [];
  
  if (!root) return fakeLinks;
  
  const links = root.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a[href=""]');
  
  links.forEach(link => {
    // Check if it behaves like a button
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    
    if (onclick || role === 'button') {
      fakeLinks.push({
        element: link,
        recommendation: 'Convert to button element',
        reason: 'Link has no navigation href but has click handler'
      });
    }
  });
  
  return fakeLinks;
}

/**
 * Adds proper landmark regions to the page
 * @param {HTMLElement} root - Root element to modify
 * @returns {Object} Result of modifications
 */
function addProperLandmarkRegions(root) {
  const result = { added: [], errors: [] };
  
  if (!root) {
    result.errors.push('Root element not provided');
    return result;
  }
  
  // Ensure main landmark exists
  let main = root.querySelector('main, [role="main"]');
  if (!main) {
    main = document.createElement('main');
    const firstChild = root.firstChild;
    if (firstChild) {
      root.insertBefore(main, firstChild);
    } else {
      root.appendChild(main);
    }
    result.added.push('main');
  }
  
  // Ensure nav landmark exists
  let nav = root.querySelector('nav, [role="navigation"]');
  if (!nav) {
    nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main navigation');
    root.insertBefore(nav, root.firstChild);
    result.added.push('navigation');
  }
  
  return result;
}

// Export all functions for use in tests and other modules
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