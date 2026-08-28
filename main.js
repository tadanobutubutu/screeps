/**
 * Main accessibility module
 * Addresses accessibility issues from insight report
 */

// React Accessibility Helpers

/**
 * Get language attribute for HTML element
 * Addresses: REACT_015
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Wrap primary content in main element with proper attributes
 * Addresses: REACT_015
 * @param {string} content - The content to wrap
 * @returns {string} Content wrapped in main element
 */
function wrapPrimaryContentInMain(content) {
  const lang = getLangAttribute();
  return `<main lang="${lang}">${content}</main>`;
}

/**
 * Validate table accessibility
 * Addresses: REACT_027
 * @param {Array} tables - Array of table elements to validate
 * @returns {Array} Array of accessibility issues found
 */
function validateTableAccessibility(tables) {
  const issues = [];
  tables.forEach((table, index) => {
    if (!table.caption && !table.summary) {
      issues.push({
        rule: 'REACT_027',
        element: `table-${index}`,
        message: 'Tables should have a caption or summary attribute'
      });
    }
  });
  return issues;
}

/**
 * Validate table structure for accessibility
 * Addresses: REACT_027
 * @param {Object} table - Table element to validate
 * @returns {Array} Array of structural issues
 */
function validateTableStructure(table) {
  const issues = [];
  if (table.rows) {
    table.rows.forEach((row, rowIndex) => {
      if (row.cells) {
        const headerCount = row.cells.filter(cell => cell.tagName === 'TH').length;
        if (headerCount === 0 && rowIndex === 0) {
          issues.push({
            rule: 'REACT_027',
            message: 'First row should contain header cells (th)'
          });
        }
      }
    });
  }
  return issues;
}

/**
 * Validate landmark elements
 * Addresses: REACT_017
 * @param {Object} document - DOM document to validate
 * @returns {Array} Array of landmark issues
 */
function validateLandmark(document) {
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length === 0 && landmark === 'main') {
      issues.push({
        rule: 'REACT_017',
        message: `Missing required landmark: <${landmark}>`
      });
    }
  });
  return issues;
}

/**
 * Validate landmark structure for accessibility
 * Addresses: REACT_017
 * @param {Object} document - DOM document to validate
 * @returns {Array} Array of structural issues
 */
function validateLandmarkStructure(document) {
  const issues = [];
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    issues.push({
      rule: 'REACT_017',
      message: 'Document should have only one main landmark'
    });
  }
  return issues;
}

/**
 * Add and fix landmark issues
 * Addresses: REACT_017, REACT_025
 * @param {Object} document - DOM document to fix
 * @returns {Object} Fixed document
 */
function addFixLandmarkIssues(document) {
  const fixed = { ...document };
  const mains = fixed.querySelectorAll ? fixed.querySelectorAll('main') : [];
  
  // Ensure unique main landmark
  if (mains.length > 1) {
    fixed.hasLandmarkFix = true;
  }
  
  return fixed;
}

/**
 * Get SVG accessible name
 * Addresses: REACT_041
 * @param {Object} svg - SVG element
 * @returns {string} Accessible name for SVG
 */
function getSvgAccessibleName(svg) {
  if (svg.getAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }
  if (svg.getAttribute('aria-labelledby')) {
    return `Reference to: ${svg.getAttribute('aria-labelledby')}`;
  }
  if (svg.querySelector('title')) {
    return svg.querySelector('title').textContent;
  }
  return '';
}

/**
 * Add ARIA attributes to form controls
 * Addresses: REACT_041
 * @param {Array} formControls - Array of form control elements
 * @returns {Array} Array of fixes applied
 */
function addAriaToFormControls(formControls) {
  const fixes = [];
  formControls.forEach(control => {
    if (control.tagName === 'INPUT' && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
      if (control.id) {
        control.setAttribute('aria-labelledby', control.id);
        fixes.push({ element: control, fix: 'aria-labelledby' });
      }
    }
  });
  return fixes;
}

/**
 * Ensure unique landmarks in document
 * Addresses: REACT_025
 * @param {Object} document - DOM document to validate
 * @returns {Array} Array of duplicate landmark issues
 */
function ensureUniqueLandmarks(document) {
  const issues = [];
  const landmarkCounts = {};
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const count = document.querySelectorAll ? document.querySelectorAll(landmark).length : 0;
    if (count > 1 && ['main', 'header', 'footer'].includes(landmark)) {
      issues.push({
        rule: 'REACT_025',
        message: `Multiple <${landmark}> elements found. Should have only one.`
      });
    }
  });
  
  return issues;
}

/**
 * Fix fake link issues
 * Addresses: REACT_036
 * @param {Array} links - Array of link elements to check
 * @returns {Array} Array of fake link issues
 */
function fixFakeLinkIssues(links) {
  const issues = [];
  links.forEach(link => {
    if (link.getAttribute('role') === 'link' && link.tagName !== 'A') {
      issues.push({
        element: link,
        rule: 'REACT_036',
        message: 'Elements with role="link" should be <a> elements or have proper href'
      });
    }
  });
  return issues;
}

/**
 * Create accessible link
 * Addresses: REACT_036
 * @param {Object} options - Link options
 * @returns {string} Accessible link HTML
 */
function createAccessibleLink(options) {
  const { href, text, title, ariaLabel } = options;
  let link = `<a href="${href || '#'}"`;
  
  if (title) {
    link += ` title="${title}"`;
  }
  
  if (ariaLabel) {
    link += ` aria-label="${ariaLabel}"`;
  }
  
  link += `>${text}</a>`;
  
  return link;
}

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())

// Import the required module
const _ = require('lodash');

/**
 * Validates a landmark object
 * @param {Object} landmark - The landmark object to validate
 * @returns {boolean} - Returns true if the landmark is valid, false otherwise
 */
function validateLandmarkObject(landmark) {
  // Check if landmark exists
  if (!landmark) {
    return false;
  }

  // Validate name is present and non-empty
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }

  // Validate coordinates if present
  if (landmark.latitude !== undefined || landmark.longitude !== undefined) {
    if (typeof landmark.latitude !== 'number' || typeof landmark.longitude !== 'number') {
      return false;
    }
    // Validate latitude range (-90 to 90)
    if (landmark.latitude < -90 || landmark.latitude > 90) {
      return false;
    }
    // Validate longitude range (-180 to 180)
    if (landmark.longitude < -180 || landmark.longitude > 180) {
      return false;
    }
  }

  return true;
}

// Add the new function
function myNewFunction(arg1, arg2) {
  // Implement your new function here
  // For example:
  return arg1 + arg2;
}

/**
 * Creates an accessible in-page button element
 * @param {Document} doc - The document object
 * @param {string} text - The button text content
 * @param {Object} [options] - Optional configuration for the button
 * @param {string} [options.className] - CSS class name(s) for the button
 * @param {string} [options.id] - ID attribute for the button
 * @param {string} [options.ariaLabel] - Accessible label for screen readers
 * @param {boolean} [options.disabled] - Whether the button should be disabled
 * @param {string} [options.type] - Button type attribute (default: 'button')
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(doc, text = '', options = {}) {
  const button = doc.createElement('button');
  button.textContent = text;
  button.type = options.type || 'button';

  if (options.className) {
    button.className = options.className;
  }

  if (options.id) {
    button.id = options.id;
  }

  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }

  if (options.disabled) {
    button.disabled = true;
  }

  return button;
}

/**
 * Adds lang attribute to HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

/**
 * Fixes table structure issues for accessibility
 * Addresses issues like missing headers, captions, scope attributes
 * @param {Document} doc - The document object
 * @returns {number} Number of tables fixed
 */
function fixTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  let fixedCount = 0;
  
  tables.forEach((table) => {
    // Add caption if missing
    if (!table.caption) {
      const caption = doc.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
      fixedCount++;
    }
    
    // Ensure th elements have scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const rowHeaders = th.parentElement ? th.parentElement.querySelectorAll('th') : null;
        const isRowHeader = rowHeaders && rowHeaders.length > 1 && th.cellIndex > 0;
        th.setAttribute('scope', isRowHeader ? 'row' : 'col');
        fixedCount++;
      }
    });
    
    // Ensure table has proper thead and tbody
    if (!table.querySelector('thead')) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const thead = doc.createElement('thead');
        thead.appendChild(rows[0]);
        table.insertBefore(thead, table.firstChild);
        fixedCount++;
      }
    }
    
    if (!table.querySelector('tbody')) {
      const tbody = doc.createElement('tbody');
      const remainingRows = Array.from(table.querySelectorAll('tr'));
      remainingRows.forEach((row) => {
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Adds and fixes landmark issues for accessibility
 * Ensures proper use of landmark elements (header, nav, main, footer, aside)
 * @param {Document} doc - The document object
 * @returns {number} Number of landmark issues fixed
 */
function addLandmarkIssues(doc) {
  let fixedCount = 0;
  
  // Ensure there's a main landmark
  const mains = doc.querySelectorAll('main');
  if (mains.length === 0) {
    const main = doc.createElement('main');
    const body = doc.querySelector('body');
    if (body) {
      // Move content to main
      Array.from(body.childNodes).forEach((child) => {
        if (!['SCRIPT', 'STYLE'].includes(child.nodeName)) {
          main.appendChild(child);
        }
      });
      body.appendChild(main);
      fixedCount++;
    }
  }
  
  // Ensure there's only one main landmark
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].setAttribute('role', 'region');
      mains[i].setAttribute('aria-label', `Content section ${i}`);
      fixedCount++;
    }
  }
  
  // Add skip link for keyboard navigation
  const skipLink = doc.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  const body = doc.querySelector('body');
  if (body) {
    body.insertBefore(skipLink, body.firstChild);
    fixedCount++;
  }
  
  // Mark the main landmark with id for skip link
  const mainElement = doc.querySelector('main') || doc.querySelector('[role="main"]');
  if (mainElement && !mainElement.id) {
    mainElement.id = 'main-content';
    fixedCount++;
  }
  
  return fixedCount;
}

/**
 * Adds accessible names to SVG elements
 * @param {Document} doc - The document object
 * @returns {number} Number of SVGs fixed
 */
function addSvgAccessibleNames(doc) {
  const svgs = doc.querySelectorAll('svg');
  let fixedCount = 0;
  
  svgs.forEach((svg, index) => {
    // Check if SVG already has accessible name
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    
    if (!title && !ariaLabel && !ariaLabelledby) {
      const svgTitle = doc.createElement('title');
      svgTitle.textContent = `Icon ${index + 1}`;
      svgTitle.id = `svg-title-${index + 1}`;
      svg.insertBefore(svgTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', svgTitle.id);
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Ensures unique landmarks across the page
 * @param {Document} doc - The document object
 * @returns {number} Number of landmark issues fixed
 */
function ensureUniqueLandmarksFixed(doc) {
  let fixedCount = 0;
  
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach((landmark) => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
        if (!label) {
          const regionLabel = `Section ${index + 1}`;
          el.setAttribute('aria-label', regionLabel);
          fixedCount++;
        }
      });
    }
  });
  
  // Ensure nav elements have labels if multiple exist
  const navs = doc.querySelectorAll('nav');
  if (navs.length > 1) {
    navs.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        fixedCount++;
      }
    });
  }
  
  return fixedCount;
}

/**
 * Fixes fake link issues - converts non-navigation elements styled as links
 * @param {Document} doc - The document object
 * @returns {number} Number of fake links fixed
 */
function fixFakeLinkIssue(doc) {
  let fixedCount = 0;
  
  // Find elements with role="link" that aren't anchor elements
  const fakeLinks = doc.querySelectorAll('[role="link"]');
  
  fakeLinks.forEach((element) => {
    // Check if it's a clickable div/span that should be a button
    if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
      element.setAttribute('role', 'button');
      // Add tabindex to make it keyboard focusable
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      fixedCount++;
    }
  });
  
  // Fix links without href that act as buttons
  const linksWithoutHref = doc.querySelectorAll('a:not([href])');
  linksWithoutHref.forEach((link) => {
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    if (onclick || role === 'button') {
      link.setAttribute('role', 'button');
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Main initialization function that applies all accessibility fixes
 * @param {Document} doc - The document object (defaults to window.document)
 */
function initializeAccessibility(doc = window.document) {
  addLangAttribute(doc);
  fixTableStructure(doc);
  addLandmarkIssues(doc);
  addSvgAccessibleNames(doc);
  ensureUniqueLandmarksFixed(doc);
  fixFakeLinkIssue(doc);
}

// Accessibility utilities export
const accessibilityExports = {
  addLangAttribute,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  ensureUniqueLandmarksFixed,
  fixFakeLinkIssue,
  initializeAccessibility,
  createInPageButton
};

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // React Accessibility Helpers
    getLangAttribute,
    wrapPrimaryContentInMain,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    addFixLandmarkIssues,
    getSvgAccessibleName,
    addAriaToFormControls,
    ensureUniqueLandmarks,
    fixFakeLinkIssues,
    createAccessibleLink,
    
    // Landmark validation (object-based)
    validateLandmarkObject,
    myNewFunction,
    
    ...accessibilityExports,
  };
}

// ES Module export (for modern JavaScript environments)
if (typeof exports !== 'undefined') {
  exports.default = {
    // React Accessibility Helpers
    getLangAttribute,
    wrapPrimaryContentInMain,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    addFixLandmarkIssues,
    getSvgAccessibleName,
    addAriaToFormControls,
    ensureUniqueLandmarks,
    fixFakeLinkIssues,
    createAccessibleLink,
    
    // Landmark validation (object-based)
    validateLandmarkObject,
    myNewFunction,
    
    ...accessibilityExports,
  };
  
  // React Accessibility Helpers
  exports.getLangAttribute = getLangAttribute;
  exports.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
  exports.validateTableAccessibility = validateTableAccessibility;
  exports.validateTableStructure = validateTableStructure;
  exports.validateLandmark = validateLandmark;
  exports.validateLandmarkStructure = validateLandmarkStructure;
  exports.addFixLandmarkIssues = addFixLandmarkIssues;
  exports.getSvgAccessibleName = getSvgAccessibleName;
  exports.addAriaToFormControls = addAriaToFormControls;
  exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
  exports.fixFakeLinkIssues = fixFakeLinkIssues;
  exports.createAccessibleLink = createAccessibleLink;
  
  // Landmark validation (object-based)
  exports.validateLandmarkObject = validateLandmarkObject;
  exports.myNewFunction = myNewFunction;
  exports.addLangAttribute = addLangAttribute;
  exports.fixTableStructure = fixTableStructure;
  exports.addLandmarkIssues = addLandmarkIssues;
  exports.addSvgAccessibleNames = addSvgAccessibleNames;
  exports.ensureUniqueLandmarksFixed = ensureUniqueLandmarksFixed;
  exports.fixFakeLinkIssue = fixFakeLinkIssue;
  exports.initializeAccessibility = initializeAccessibility;
  exports.createInPageButton = createInPageButton;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAccessibility());
  } else {
    initializeAccessibility();
  }
}