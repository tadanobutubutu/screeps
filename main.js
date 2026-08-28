// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
  // Create a new button element
  const button = document.createElement('button');

  // Set the button's ID, text content, and class
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;

  // Append the button to the body or a specific container
  document.body.appendChild(button);

  // Return the created button for further manipulation if needed
  return button;
}

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Calculate and return the discounted price
function calculateDiscount(price, discountRate) {
    return price - (price * discountRate);
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }
  
  return null;
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement) return;
  
  const accessibleName = getSvgAccessibleName(svgElement);
  if (accessibleName) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  
  const hasFocusable = link.hasAttribute('tabindex') || link.tagName === 'A';
  const hasAccessibleName = link.hasAttribute('aria-label') || 
                            link.hasAttribute('aria-labelledby') ||
                            link.textContent.trim().length > 0;
  
  return hasFocusable && hasAccessibleName;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  const hasRole = button.hasAttribute('role') || button.tagName === 'BUTTON';
  const hasAccessibleName = button.hasAttribute('aria-label') || 
                            button.hasAttribute('aria-labelledby') ||
                            button.textContent.trim().length > 0;
  
  return hasRole && hasAccessibleName;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    issues: [],
    links: [],
    buttons: []
  };
  
  if (typeof container === 'undefined' || container === null) {
    return results;
  }
  
  const links = container.querySelectorAll('a, button, [role="link"], [role="button"]');
  links.forEach(link => {
    if (link.tagName === 'A' || link.hasAttribute('role') && link.getAttribute('role') === 'link') {
      if (!isLinkAccessible(link)) {
        results.issues.push({ type: 'inaccessible-link', element: link });
      }
      results.links.push(link);
    }
  });
  
  const buttons = container.querySelectorAll('button, [role="button"]');
  buttons.forEach(button => {
    if (!isButtonAccessible(button)) {
      results.issues.push({ type: 'inaccessible-button', element: button });
    }
    results.buttons.push(button);
  });
  
  return results;
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  if (!element) return;
  
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  const isValidRole = landmarkRoles.includes(role);
  
  if (isValidRole && !element.hasAttribute('role')) {
    element.setAttribute('role', role);
  }
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }
  
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return existingMain;
  }
  
  const main = document.createElement('main');
  const bodyChildren = Array.from(document.body.children);
  
  bodyChildren.forEach(child => {
    main.appendChild(child);
  });
  
  document.body.appendChild(main);
  return main;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const results = {
    issues: [],
    landmarks: []
  };
  
  if (typeof container === 'undefined' || container === null) {
    return results;
  }
  
  const landmarkSelectors = [
    'header[role="banner"]',
    'nav[role="navigation"]',
    'main[role="main"]',
    'aside[role="complementary"]',
    'footer[role="contentinfo"]',
    '[role="search"]',
    '[role="form"]',
    '[role="application"]'
  ];
  
  const allLandmarks = container.querySelectorAll(landmarkSelectors.join(', '));
  const mainLandmark = container.querySelector('main, [role="main"]');
  
  if (mainLandmark) {
    results.landmarks.push(mainLandmark);
    if (!mainLandmark.hasAttribute('aria-label') && !mainLandmark.hasAttribute('aria-labelledby')) {
      mainLandmark.setAttribute('aria-label', 'Main content');
    }
  } else {
    results.issues.push({ type: 'missing-main-landmark', element: null });
  }
  
  return results;
}

/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Initialize language attribute
  getLangAttribute();
  // Create in-page button for language toggle
  createInPageButton();
}

/**
 * Gets the lang attribute value from the document's HTML element.
 * If missing, sets it to 'en' and returns the value.
 * @returns {string|null} The lang attribute value or null if document is not available
 */
function getLangAttribute(element) {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement.lang;
  }
  return null;
}

/**
 * Adds lang attribute to the HTML element if missing.
 * @returns {HTMLElement|null} The HTML element or null if document is not available
 */
function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement;
  }
  return null;
}

/**
 * Fixes table structure issues in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to fix table issues in
 * @returns {NodeList} NodeList of fixed tables
 */
function fixTableStructureIssues(container = document) {
  if (typeof container === 'undefined' || container === null) {
    return document.querySelectorAll('table');
  }
  
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    const hasCaption = table.querySelector('caption');
    if (!hasCaption) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
    }
    
    const hasThead = table.querySelector('thead');
    if (!hasThead) {
      const thead = document.createElement('thead');
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        thead.appendChild(rows[0]);
        table.insertBefore(thead, table.firstChild);
      }
    }
  });
  
  return tables;
}

/**
 * Adds accessible names to all SVG elements in the container.
 * @param {HTMLElement} [container=document] - The container to process
 * @returns {Array} Array of SVG elements that were processed
 */
function addSvgAccessibleNames(container = document) {
  if (typeof container === 'undefined' || container === null) {
    container = document;
  }
  
  const svgs = container.querySelectorAll('svg');
  const processed = [];
  
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title && title.textContent) {
        svg.setAttribute('aria-label', title.textContent.trim());
        processed.push(svg);
      }
    }
  });
  
  return processed;
}

/**
 * Ensures unique landmark roles in the document.
 * @param {HTMLElement} [container=document] - The container to check
 * @returns {Array} Array of landmark elements that were modified
 */
function ensureUniqueLandmarks(container = document) {
  if (typeof container === 'undefined' || container === null) {
    container = document;
  }
  
  const mainCount = container.querySelectorAll('[role="main"], main').length;
  if (mainCount > 1) {
    const mains = container.querySelectorAll('[role="main"], main');
    for (let i = 1; i < mains.length; i++) {
      const main = mains[i];
      main.removeAttribute('role');
      main.setAttribute('aria-roledescription', 'complementary');
    }
  }
  
  return [];
}

/**
 * Fixes fake link issues by converting divs/spans with click handlers to actual links.
 * @param {HTMLElement} [container=document] - The container to check
 * @returns {Array} Array of elements that were converted
 */
function fixFakeLinkIssue(container = document) {
  if (typeof container === 'undefined' || container === null) {
    container = document;
  }
  
  const fakeLinks = container.querySelectorAll('div[role="link"], span[role="link"], div[onclick], span[onclick]');
  const fixed = [];
  
  fakeLinks.forEach(el => {
    if (el.tagName === 'DIV' || el.tagName === 'SPAN') {
      const a = document.createElement('a');
      const href = el.getAttribute('href') || '#';
      a.setAttribute('href', href);
      a.setAttribute('role', 'link');
      
      if (el.getAttribute('onclick')) {
        a.setAttribute('onclick', el.getAttribute('onclick'));
      }
      
      a.textContent = el.textContent;
      a.setAttribute('aria-label', el.getAttribute('aria-label') || el.textContent);
      
      el.parentNode.replaceChild(a, el);
      fixed.push(a);
    }
  });
  
  return fixed;
}

/**
 * Adds a main landmark element if one doesn't exist.
 * @param {HTMLElement} [container=document] - The container to modify
 * @returns {HTMLElement|null} The main element or null
 */
function addMainLandmark(container = document) {
  if (typeof container === 'undefined' || container === null) {
    container = document;
  }
  
  const existingMain = container.querySelector('main, [role="main"]');
  if (existingMain) {
    return existingMain;
  }
  
  const main = document.createElement('main');
  const bodyChildren = Array.from(container.body ? container.body.children : document.body.children);
  
  bodyChildren.forEach(child => {
    main.appendChild(child);
  });
  
  if (container.body) {
    container.body.appendChild(main);
  } else {
    document.body.appendChild(main);
  }
  
  return main;
}

/**
 * Adds accessible names to all form elements in the document.
 * @returns {Array} Array of processed form elements
 */
function setFormElementAccessibleNames() {
  const formElements = [];
  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
      const name = input.getAttribute('name');
      const id = input.getAttribute('id');
      const placeholder = input.getAttribute('placeholder');
      
      if (name) {
        input.setAttribute('aria-label', name);
        formElements.push(input);
      } else if (id) {
        input.setAttribute('aria-label', id.replace(/[^a-zA-Z]/g, ' '));
        formElements.push(input);
      } else if (placeholder) {
        input.setAttribute('aria-label', placeholder);
        formElements.push(input);
      }
    }
  });
  
  return formElements;
}

/**
 * Adds a11y attributes to interactive elements to ensure they are keyboard accessible.
 * @returns {Array} Array of elements with added attributes
 */
function addA11yAttributesToInteractiveElements() {
  const interactiveElements = [];
  const interactive = document.querySelectorAll('[tabindex], button, a, input, select, textarea, [role="button"], [role="link"]');
  
  interactive.forEach(el => {
    if (!el.hasAttribute('tabindex') && ['button', 'a', 'input', 'select', 'textarea'].includes(el.tagName.toLowerCase())) {
      el.setAttribute('tabindex', '0');
      interactiveElements.push(el);
    }
  });
  
  return interactiveElements;
}

/**
 * Checks if an element has missing ARIA properties.
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if the element is missing required ARIA properties, false otherwise
 */
function hasMissingAriaProperties(element) {
  const requiredAriaProps = ['role', 'aria-label', 'aria-labelledby', 'tabindex'];
  
  return !requiredAriaProps.every(prop => element.hasAttribute(prop));
}

/**
 * Validates that table elements meet accessibility standards.
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} True if the table is accessible, false otherwise
 */
function validateTableAccessibility(table) {
  if (!table) return false;

  let isValid = true;

  // Check for caption element
  if (!table.querySelector('caption')) {
    console.warn('Table is missing a <caption> element for accessibility.');
    isValid = false;
  }

  // Check for thead element
  if (!table.querySelector('thead')) {
    console.warn('Table is missing a <thead> element.');
    isValid = false;
  }

  // Check for tbody element
  if (!table.querySelector('tbody')) {
    console.warn('Table is missing a <tbody> element.');
    isValid = false;
  }

  // Check for scope attributes on th elements
  const thElements = table.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      console.warn('Table header <th> element is missing a scope attribute.', th);
      isValid = false;
    }
  });

  return isValid;
}

/**
 * Validates the structure of table elements to ensure they conform to best practices.
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} True if the table structure is valid, false otherwise
 */
function validateTableStructure(table) {
  if (!table) return false;

  let isValid = true;

  // Check that all cells are within rows
  const cells = table.querySelectorAll('td, th');
  cells.forEach(cell => {
    const parentRow = cell.closest('tr');
    if (!parentRow) {
      console.warn('Table cell is not contained within a table row.', cell);
      isValid = false;
    }
  });

  // Check for presence of at least one row
  if (!table.querySelector('tr')) {
    console.warn('Table has no rows.');
    isValid = false;
  }

  // Ensure table headers are present
  if (!table.querySelector('th')) {
    console.warn('Table has no header cells (<th>).');
    isValid = false;
  }

  // Validate proper nesting of table elements
  const allowedChildren = ['caption', 'colgroup', 'thead', 'tbody', 'tfoot', 'tr'];
  const directChildren = Array.from(table.children);
  directChildren.forEach(child => {
    if (!allowedChildren.includes(child.tagName.toLowerCase())) {
      console.warn(`Table contains an unexpected direct child element: <${child.tagName.toLowerCase()}>.`);
      isValid = false;
    }
  });

  return isValid;
}

/**
 * Implements function for addressing accessibility issues from insight report.
 * Identifies and fixes common accessibility problems found in the document.
 * @param {HTMLElement} [container=document] - The container to check for accessibility issues
 * @returns {Object} An object containing the results of the accessibility fixes
 */
function addressAccessibilityIssues(container = document) {
  const results = {
    fixed: [],
    issues: [],
    summary: {
      total: 0,
      fixed: 0,
      remaining: 0
    }
  };

  if (typeof container === 'undefined' || container === null) {
    return results;
  }

  // Add main landmark if missing
  if (!container.querySelector('main')) {
    const main = wrapPrimaryContentInMain();
    if (main) {
      results.fixed.push({ type: 'main-landmark', element: main });
      results.summary.fixed++;
    }
  }
  results.summary.total++;

  // Add lang attribute if missing
  if (typeof document !== 'undefined' && document.documentElement && !document.documentElement.lang) {
    const htmlElement = addLangAttribute();
    if (htmlElement) {
      results.fixed.push({ type: 'lang-attribute', element: htmlElement });
      results.summary.fixed++;
    }
  }
  results.summary.total++;

  // Set accessibility props on SVG elements
  const svgs = container.querySelectorAll('svg');
  svgs.forEach(svg => {
    setSvgAccessibilityProps(svg);
    results.fixed.push({ type: 'svg-accessibility', element: svg });
    results.summary.fixed++;
  });
  results.summary.total += svgs.length;

  // Add SVG accessible names
  if (typeof addSvgAccessibleNames === 'function') {
    const svgResults = addSvgAccessibleNames(container);
    if (svgResults && svgResults.length) {
      svgResults.forEach(el => {
        results.fixed.push({ type: 'svg-accessible-name', element: el });
        results.summary.fixed++;
      });
    }
  }

  // Ensure unique landmarks
  if (typeof ensureUniqueLandmarks === 'function') {
    const landmarkResults = ensureUniqueLandmarks(container);
    if (landmarkResults && landmarkResults.length) {
      landmarkResults.forEach(item => {
        results.fixed.push({ type: 'unique-landmark', element: item });
        results.summary.fixed++;
      });
    }
  }

  // Fix fake link issues
  if (typeof fixFakeLinkIssue === 'function') {
    const fakeLinkResults = fixFakeLinkIssue(container);
    if (fakeLinkResults && fakeLinkResults.length) {
      fakeLinkResults.forEach(item => {
        results.fixed.push({ type: 'fake-link', element: item });
        results.summary.fixed++;
      });
    }
  }

  // Fix table structure issues
  if (typeof fixTableStructureIssues === 'function') {
    const fixedTables = fixTableStructureIssues(container);
    if (fixedTables && fixedTables.length) {
      fixedTables.forEach(table => {
        results.fixed.push({ type: 'table-structure', element: table });
        results.summary.fixed++;
      });
    }
  }

  // Add main landmark
  if (typeof addMainLandmark === 'function') {
    const mainResult = addMainLandmark(container);
    if (mainResult) {
      results.fixed.push({ type: 'add-main-landmark', element: mainResult });
      results.summary.fixed++;
    }
  }

  // Set accessible names for form elements
  if (typeof setFormElementAccessibleNames === 'function') {
    const formElements = setFormElementAccessibleNames();
    if (formElements && formElements.length) {
      formElements.forEach(el => {
        results.fixed.push({ type: 'form-accessible-name', element: el });
        results.summary.fixed++;
      });
    }
  }

  // Add a11y attributes to interactive elements
  if (typeof addA11yAttributesToInteractiveElements === 'function') {
    const interactiveElements = addA11yAttributesToInteractiveElements();
    if (interactiveElements && interactiveElements.length) {
      interactiveElements.forEach(el => {
        results.fixed.push({ type: 'interactive-a11y', element: el });
        results.summary.fixed++;
      });
    }
  }

  // Validate table accessibility and structure
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    if (!validateTableAccessibility(table)) {
      results.issues.push({ type: 'inaccessible-table', element: table });
      results.summary.remaining++;
    }
    if (!validateTableStructure(table)) {
      results.issues.push({ type: 'invalid-table-structure', element: table });
      results.summary.remaining++;
    }
  });
  results.summary.total += tables.length;

  // Check for missing ARIA properties on elements
  const allElements = container.querySelectorAll('*');
  allElements.forEach(element => {
    if (hasMissingAriaProperties(element)) {
      results.issues.push({ type: 'missing-aria', element: element });
      results.summary.remaining++;
    }
  });

  // Check link and button accessibility
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    if (!isLinkAccessible(link)) {
      results.issues.push({ type: 'inaccessible-link', element: link });
      results.summary.remaining++;
    }
  });
  results.summary.total += links.length;

  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (!isButtonAccessible(button)) {
      results.issues.push({ type: 'inaccessible-button', element: button });
      results.summary.remaining++;
    }
  });
  results.summary.total += buttons.length;

  // Check landmarks
  if (typeof checkLandmarks === 'function') {
    const landmarkResults = checkLandmarks(container);
    if (landmarkResults && landmarkResults.issues) {
      landmarkResults.issues.forEach(issue => {
        results.issues.push({ type: 'landmark-issue', element: issue });
        results.summary.remaining++;
      });
    }
  }

  return results;
}

// Make functions accessible globally for browser usage
const globalObject = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global);
globalObject.setSvgAccessibilityProps = setSvgAccessibilityProps;
globalObject.isLinkAccessible = isLinkAccessible;
globalObject.isButtonAccessible = isButtonAccessible;
globalObject.checkAccessibility = checkAccessibility;
globalObject.checkLandmarkElement = checkLandmarkElement;
globalObject.checkLandmarks = checkLandmarks;
globalObject.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
globalObject.renderIndexView = renderIndexView;
globalObject.getLangAttribute = getLangAttribute;
globalObject.createInPageButton = createInPageButton;
globalObject.addLangAttribute = addLangAttribute;
globalObject.fixTableStructureIssues = fixTableStructureIssues;
globalObject.addMainLandmark = addMainLandmark;
globalObject.addSvgAccessibleNames = addSvgAccessibleNames;
globalObject.ensureUniqueLandmarks = ensureUniqueLandmarks;
globalObject.fixFakeLinkIssue = fixFakeLinkIssue;
globalObject.setFormElementAccessibleNames = setFormElementAccessibleNames;
globalObject.addA11yAttributesToInteractiveElements = addA11yAttributesToInteractiveElements;
globalObject.hasMissingAriaProperties = hasMissingAriaProperties;
globalObject.getSvgAccessibleName = getSvgAccessibleName;
globalObject.addressAccessibilityIssues = addressAccessibilityIssues;
globalObject.validateTableAccessibility = validateTableAccessibility;
globalObject.validateTableStructure = validateTableStructure;
globalObject.calculateDiscount = calculateDiscount;

// Import module's main exports and requires fs and path modules
const fs = require('fs');
const path = require('path');

// Function to update a TH scope attribute (imports and modifies curly_braces.js)
function updateThScopeAttribute() {
    // ... Code from the origin/main branch ...
}

// Example usage of calculateDiscount and updateThScopeAttribute functions
const price = 100;
const discountRate = 0.2;
updateThScopeAttribute();
const discountedPrice = calculateDiscount(price, discountRate);
console.log('Discounted price:', discountedPrice);

// Exports for all functions
module.exports = {
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkAccessibility,
  checkLandmarkElement,
  checkLandmarks,
  wrapPrimaryContentInMain,
  renderIndexView,
  getLangAttribute,
  createInPageButton,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  setFormElementAccessibleNames,
  addA11yAttributesToInteractiveElements,
  hasMissingAriaProperties,
  getSvgAccessibleName,
  addressAccessibilityIssues,
  validateTableAccessibility,
  validateTableStructure,
  calculateDiscount,
  updateThScopeAttribute
};