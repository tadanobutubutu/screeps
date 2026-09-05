/**
 * Accessibility helper functions for main.js
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix table structure issues
 * - REACT_041: Add accessible names to SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix fake link issues
 */

/**
 * Gets the lang attribute for the HTML element based on content
 * @param {string} language - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value
 */
function getLangAttribute(language = 'en') {
  return language;
}

/**
 * Sets the lang attribute on the HTML element
 * @param {string} language - The language code
 */
function setHtmlLangAttribute(language = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', language);
  }
}

/**
 * Provides accessible name for person-related elements
 * @param {HTMLElement} element - The element to make accessible
 * @param {string} personName - The name to use
 */
function personName(element, personName) {
  if (element) {
    element.setAttribute('aria-label', personName);
    element.setAttribute('role', 'img');
  }
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelector('th') !== null;
  
  return hasCaption || hasHeaders;
}

/**
 * Validates table structure for accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result with issues
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    issues.push('Table not found');
    return { valid: false, issues };
  }
  
  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const rows = table.querySelectorAll('tr');
  
  if (!tbody && rows.length === 0) {
    issues.push('Table missing body');
  }
  
  // Check for th elements with scope attributes
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push(`Header at index ${index} missing scope attribute`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Gets accessible name for SVG elements
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 */
function getSvgAccessibleName(svg, accessibleName) {
  if (!svg) return;
  
  // Set aria-label for screen readers
  svg.setAttribute('aria-label', accessibleName);
  
  // Add title element if not present
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    title.textContent = accessibleName;
    svg.insertBefore(title, svg.firstChild);
  } else {
    title.textContent = accessibleName;
  }
  
  // Link title to SVG with aria-labelledby
  const titleId = `svg-title-${Date.now()}`;
  title.setAttribute('id', titleId);
  svg.setAttribute('aria-labelledby', titleId);
}

/**
 * Ensures unique landmarks on the page
 * @returns {Object} Information about landmark uniqueness
 */
function ensureUniqueLandmarks() {
  const landmarks = {
    banner: [],
    navigation: [],
    main: [],
    contentinfo: [],
    complementary: [],
    search: []
  };
  
  // Find all landmarks
  document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"], header, nav, main, footer, aside')
    .forEach(element => {
      const role = element.getAttribute('role') || element.tagName.toLowerCase();
      if (landmarks[role]) {
        landmarks[role].push(element);
      }
    });
  
  // Mark duplicates
  const issues = [];
  Object.keys(landmarks).forEach(landmarkType => {
    const elements = landmarks[landmarkType];
    if (elements.length > 1) {
      // Keep first, mark others
      elements.slice(1).forEach((el, index) => {
        const uniqueId = `landmark-${landmarkType}-${index + 1}`;
        el.setAttribute('id', uniqueId);
        el.setAttribute('aria-label', `${landmarkType} ${index + 2}`);
        issues.push(`Duplicate ${landmarkType} landmark given unique ID: ${uniqueId}`);
      });
    }
  });
  
  return {
    landmarks,
    issues,
    hasIssues: issues.length > 0
  };
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement} The accessible button
 */
function createInPageButton(options = {}) {
  const {
    text = 'Button',
    onClick = () => {},
    ariaLabel = '',
    id = ''
  } = options;
  
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('type', 'button');
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (id) {
    button.id = id;
  }
  
  // Ensure proper button semantics
  button.addEventListener('click', (e) => {
    // Ensure this is treated as a real button, not a link
    e.preventDefault();
    onClick(e);
  });
  
  return button;
}

/**
 * Fixes fake links (anchor tags without href that function as buttons)
 * @returns {Array} List of fixed fake links
 */
function fixFakeLinks() {
  const fakeLinks = [];
  
  document.querySelectorAll('a:not([href]), a[href="#"], a[href=""], a[href="javascript:void(0)"]')
    .forEach(link => {
      const role = link.getAttribute('role');
      if (role !== 'button' && !link.hasAttribute('href')) {
        link.setAttribute('role', 'button');
        fakeLinks.push(link);
      }
    });
  
  return fakeLinks;
}

/**
 * Initializes all accessibility features
 * @param {string} language - Page language code
 */
function initializeAccessibility(language = 'en') {
  setHtmlLangAttribute(language);
  ensureUniqueLandmarks();
  fixFakeLinks();
  
  // Validate all tables
  document.querySelectorAll('table').forEach(table => {
    if (!validateTableAccessibility(table)) {
      console.warn('Table accessibility issue detected:', table);
    }
    validateTableStructure(table);
  });
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    setHtmlLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    ensureUniqueLandmarks,
    createInPageButton,
    fixFakeLinks,
    initializeAccessibility
  };
}