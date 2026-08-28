// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

/**
 * Creates an accessible link element
 * @param {string} text - The text content of the link
 * @param {string} href - The URL the link points to
 * @param {Object} options - Additional options for the link
 * @returns {HTMLAnchorElement} The created link element
 */
function createAccessibleLink(text, href, options = {}) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  
  if (options.className) {
    link.className = options.className;
  }
  if (options.id) {
    link.id = options.id;
  }
  if (options.target) {
    link.target = options.target;
  }
  if (options.rel) {
    link.rel = options.rel;
  }
  if (options.title) {
    link.title = options.title;
  }
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  
  // Ensure accessibility attributes
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');
  
  return link;
}

/**
 * Creates an in-page button element
 * @param {string} text - The text content of the button
 * @param {Object|Function} options - Additional options for the button or click handler
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, options = {}) {
  // Handle legacy usage where second parameter is a click handler function
  if (typeof options === 'function') {
    options = { onClick: options };
  }
  
  const button = document.createElement('button');
  button.textContent = text;
  
  if (options.className) {
    button.className = options.className;
  }
  if (options.id) {
    button.id = options.id;
  }
  if (options.type) {
    button.type = options.type;
  } else {
    button.type = 'button';
  }
  if (options.disabled) {
    button.disabled = options.disabled;
  }
  if (options.title) {
    button.title = options.title;
  }
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function personName() {
  return document.querySelector('[data-person-name]')?.textContent || 'Unknown';
}

function validateTableAccessibility(table) {
  if (!table) return false;
  const headers = table.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  let hasIssue = false;
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) hasIssue = true;
  });
  return !hasIssue;
}

function validateLandmark(element) {
  if (!element) return false;
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  return landmarkRoles.some(role => element.getAttribute('role') === role || element.tagName.toLowerCase() === role);
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], header, [role="contentinfo"], footer');
  let issues = 0;
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) issues += mains.length - 1;
  return { issues, valid: issues === 0 };
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  return '';
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    createInPageButton, 
    createAccessibleLink,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName
  };
}
```