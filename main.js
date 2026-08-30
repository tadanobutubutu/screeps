// TODO: This is the existing code that needs to be preserved

/**
 * Get the lang attribute value for the HTML element
 * Addresses REACT_015: Add lang attribute to HTML element
 * @returns {string} The language code (e.g., 'en', 'es', 'fr')
 */
function getLangAttribute() {
  // Default to 'en' - should be customized based on actual content language
  return 'en';
}

/**
 * Get accessible name for a person
 * Addresses REACT_015 and REACT_036: Person name for accessibility
 * @param {Object} person - Person object with name property
 * @returns {string} Accessible name for the person
 */
function personName(person) {
  if (!person) {
    return '';
  }
  return person.name || person.fullName || '';
}

/**
 * Validate table accessibility
 * Addresses REACT_027: Fix table structure issues
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with isValid and errors array
 */
function validateTableAccessibility(table) {
  const errors = [];
  
  if (!table) {
    return { isValid: false, errors: ['Table element is required'] };
  }
  
  // Check for caption or aria-labelledby
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label');
  const hasAriaLabelledby = table.getAttribute('aria-labelledby');
  
  if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
    errors.push('Table should have a caption, aria-label, or aria-labelledby');
  }
  
  // Check for th elements with scope or headers attribute
  const headers = table.querySelectorAll('th');
  if (headers.length > 0) {
    const hasProperHeaders = Array.from(headers).every(th => 
      th.getAttribute('scope') || th.getAttribute('id')
    );
    if (!hasProperHeaders) {
      errors.push('TH elements should have scope or id attributes');
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validate table structure
 * Addresses REACT_027: Fix table structure issues
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with isValid and errors array
 */
function validateTableStructure(table) {
  const errors = [];
  
  if (!table) {
    return { isValid: false, errors: ['Table element is required'] };
  }
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    errors.push('Table should have a thead element');
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    errors.push('Table should have a tbody element');
  }
  
  // Check that th elements are in thead
  const ths = table.querySelectorAll('th');
  const thsInThead = table.querySelectorAll('thead th');
  if (ths.length > 0 && thsInThead.length === 0) {
    errors.push('TH elements should be within thead');
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validate landmark elements
 * Addresses REACT_017: Add/fix landmark issues
 * @param {Element} element - The element to validate
 * @returns {Object} Validation result with isValid and errors array
 */
function validateLandmark(element) {
  const errors = [];
  const validLandmarks = [
    'header', 'nav', 'main', 'aside', 'footer', 
    'section', 'article', 'search', 'form'
  ];
  
  if (!element) {
    return { isValid: false, errors: ['Element is required'] };
  }
  
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  
  if (validLandmarks.includes(tagName) || (role && validLandmarks.includes(role))) {
    return { isValid: true, errors: [] };
  }
  
  errors.push('Element should be a valid landmark (header, nav, main, aside, footer, section, article, search, or form)');
  return { isValid: false, errors };
}

/**
 * Validate landmark structure
 * Addresses REACT_017 and REACT_025: Ensure unique landmarks
 * @param {Document} doc - The document to validate
 * @returns {Object} Validation result with isValid and errors array
 */
function validateLandmarkStructure(doc) {
  const errors = [];
  const landmarkCounts = {};
  const requiredUnique = ['main', 'header', 'footer'];
  
  if (!doc) {
    return { isValid: false, errors: ['Document is required'] };
  }
  
  // Check for required unique landmarks
  requiredUnique.forEach(landmark => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1) {
      errors.push(`There should be only one ${landmark} landmark, found ${elements.length}`);
    }
    landmarkCounts[landmark] = elements.length;
  });
  
  // Check for nav with aria-label for uniqueness
  const navs = doc.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    const label = nav.getAttribute('aria-label');
    if (!label && navs.length > 1) {
      errors.push(`Navigation landmark ${index + 1} should have an aria-label to distinguish it`);
    }
  });
  
  return { isValid: errors.length === 0, errors, landmarkCounts };
}

/**
 * Get accessible name for an SVG element
 * Addresses REACT_041: Add accessible names to SVGs
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
  if (!svg) {
    return '';
  }
  
  // Check aria-label first
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const doc = svg.ownerDocument || document;
    const labelElement = doc.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  return '';
}

/**
 * Create an accessible in-page button
 * Addresses REACT_036: Fix fake link issue
 * @param {Object} options - Button options
 * @param {string} options.label - Button label
 * @param {string} options.id - Button id (optional)
 * @param {string} options.href - Target href for navigation (optional)
 * @returns {HTMLButtonElement|HTMLAnchorElement} The created button element
 */
function createInPageButton(options = {}) {
  const { label = '', id = '', href = '' } = options;
  
  // Use a button element for in-page actions (not anchor with href)
  const button = document.createElement('button');
  
  if (id) {
    button.id = id;
  }
  
  button.textContent = label;
  button.setAttribute('type', 'button');
  
  // Ensure accessible name is properly set
  if (!button.getAttribute('aria-label') && !label) {
    button.setAttribute('aria-label', 'In-page action button');
  }
  
  return button;
}

// Export functions for testing
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