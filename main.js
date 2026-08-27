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
  // (code for setSvgAccessibilityProps remains the same)
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  // (code for isLinkAccessible remains the same)
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  // (code for isButtonAccessible remains the same)
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  // (code for checkAccessibility remains the same)
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  // (code for checkLandmarkElement remains the same)
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  // (code for wrapPrimaryContentInMain remains the same)
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
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
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement.lang;
  }
  return null;
}

/**
 * Creates an in-page button to toggle language settings.
 * @returns {HTMLButtonElement|null} The created button element or null if document is not available
 */
function createInPageButton() {
  if (typeof document !== 'undefined' && document.body) {
    const button = document.createElement('button');
    button.textContent = 'Toggle Language';
    button.setAttribute('aria-label', 'Toggle Language');
    button.addEventListener('click', () => {
      const currentLang = document.documentElement.lang;
      document.documentElement.lang = (currentLang === 'en') ? 'fr' : 'en';
    });
    document.body.appendChild(button);
    return button;
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
 * Validates table accessibility by checking for proper headers, captions, and ARIA attributes.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} An object containing validation results
 */
function validateTableAccessibility(table) {
  const results = {
    isAccessible: true,
    issues: [],
    table: table
  };

  if (!table) {
    results.isAccessible = false;
    results.issues.push('Table is null or undefined');
    return results;
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    results.isAccessible = false;
    results.issues.push('Table is missing a caption element');
  }

  // Check for headers (th elements)
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    results.isAccessible = false;
    results.issues.push('Table is missing header cells (th elements)');
  } else {
    // Check that headers have scope attribute or are associated with cells via id/headers
    let hasScopedHeaders = false;
    headers.forEach(th => {
      if (th.hasAttribute('scope') || th.hasAttribute('id')) {
        hasScopedHeaders = true;
      }
    });
    if (!hasScopedHeaders) {
      results.isAccessible = false;
      results.issues.push('Table headers are missing scope attributes or IDs');
    }
  }

  // Check for proper table structure (tbody, thead, or tfoot)
  const structuralElements = table.querySelectorAll('thead, tbody, tfoot');
  if (structuralElements.length === 0) {
    results.isAccessible = false;
    results.issues.push('Table is missing proper structural elements (thead, tbody, or tfoot)');
  }

  return results;
}

/**
 * Validates table structure by checking for proper nesting and element types.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} An object containing validation results
 */
function validateTableStructure(table) {
  const results = {
    isValid: true,
    issues: [],
    table: table
  };

  if (!table) {
    results.isValid = false;
    results.issues.push('Table is null or undefined');
    return results;
  }

  // Check that table doesn't contain non-table elements directly
  const allowedChildren = ['CAPTION', 'COLGROUP', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'COL'];
  const directChildren = Array.from(table.children);
  
  directChildren.forEach(child => {
    if (allowedChildren.indexOf(child.tagName) === -1) {
      results.isValid = false;
      results.issues.push('Table contains invalid child element: ' + child.tagName);
    }
  });

  // Check that tr elements are inside thead, tbody, or tfoot
  const trElements = table.querySelectorAll('tr');
  trElements.forEach(tr => {
    const parent = tr.parentElement;
    if (parent && parent.tagName !== 'THEAD' && parent.tagName !== 'TBODY' && parent.tagName !== 'TFOOT' && parent.tagName !== 'TABLE') {
      results.isValid = false;
      results.issues.push('tr element is not properly nested in a structural element');
    }
  });

  // Check that td/th elements are inside tr
  const cells = table.querySelectorAll('td, th');
  cells.forEach(cell => {
    const parent = cell.parentElement;
    if (!parent || parent.tagName !== 'TR') {
      results.isValid = false;
      results.issues.push('Cell element is not inside a tr element');
    }
  });

  return results;
}

/**
 * Fixes table structure issues in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to fix table issues in
 * @returns {NodeList} NodeList of fixed tables
 */
function fixTableStructureIssues(container = document) {
  if (!container) {
    return [];
  }

  const tables = container.querySelectorAll('table');
  const fixedTables = [];

  tables.forEach(table => {
    let wasFixed = false;

    // Run validations
    const accessibilityResult = validateTableAccessibility(table);
    const structureResult = validateTableStructure(table);

    // Fix: Add caption if missing
    if (accessibilityResult.issues.indexOf('Table is missing a caption element') !== -1) {
      const caption = table.ownerDocument.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
      wasFixed = true;
    }

    // Fix: Add scope attribute to headers if missing
    const headers = table.querySelectorAll('th');
    if (headers.length > 0) {
      let needsScope = true;
      headers.forEach(th => {
        if (th.hasAttribute('scope') || th.hasAttribute('id')) {
          needsScope = false;
        }
      });
      if (needsScope) {
        headers.forEach((th, index) => {
          // Determine if it's a row or column header based on position
          const parent = th.parentElement;
          if (parent && parent.tagName === 'TR') {
            const isFirstRow = parent === parent.parentElement.firstElementChild;
            th.setAttribute('scope', isFirstRow ? 'col' : 'row');
          } else {
            th.setAttribute('scope', 'col');
          }
        });
        wasFixed = true;
      }
    }

    // Fix: Wrap content in tbody if not present
    const structuralElements = table.querySelectorAll('thead, tbody, tfoot');
    if (structuralElements.length === 0) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const tbody = table.ownerDocument.createElement('tbody');
        const firstRow = rows[0];
        const parent = firstRow.parentElement;
        if (parent === table) {
          // Move rows into tbody
          rows.forEach(row => {
            tbody.appendChild(row.cloneNode(true));
            row.parentNode.removeChild(row);
          });
          table.appendChild(tbody);
          wasFixed = true;
        }
      }
    }

    if (wasFixed) {
      fixedTables.push(table);
    }
  });

  return fixedTables;
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
 * Adds accessible names to all form elements in the document.
 * @returns {NodeList} NodeList of processed form elements
 */
function setFormElementAccessibleNames() {
  // (existing code for setFormElementAccessibleNames remains the same)
}

/**
 * Adds a11y attributes to interactive elements to ensure they are keyboard accessible.
 * @returns {Array} Array of elements with added attributes
 */
function addA11yAttributesToInteractiveElements() {
  // (existing code for addA11yAttributesToInteractiveElements remains the same)
}

/**
 * Adds accessible names to SVG elements that need them.
 * @param {HTMLElement} container - The container to check for SVG elements
 * @returns {Array} Array of SVG elements with accessible names added
 */
function addSvgAccessibleNames(container = document) {
  const results = [];
  const svgs = container.querySelectorAll('svg');
  
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      if (!svg.querySelector('title')) {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = 'SVG image';
        svg.insertBefore(title, svg.firstChild);
        results.push(svg);
      } else if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', 'SVG image');
        results.push(svg);
      }
    }
  });
  
  return results;
}

/**
 * Ensures landmarks have unique roles to avoid redundancy.
 * @param {HTMLElement} container - The container to check for landmarks
 * @returns {Array} Array of landmark elements processed
 */
function ensureUniqueLandmarks(container = document) {
  const results = [];
  const landmarks = container.querySelectorAll('[role]');
  const rolesFound = new Set();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (rolesFound.has(role)) {
      const uniqueId = 'landmark-' + Math.random().toString(36).substr(2, 9);
      landmark.setAttribute('aria-label', role + ' ' + uniqueId);
      results.push(landmark);
    } else {
      rolesFound.add(role);
    }
  });
  
  return results;
}

/**
 * Fixes fake link accessibility issues.
 * @param {HTMLElement} container - The container to check for fake links
 * @returns {Array} Array of fake link elements fixed
 */
function fixFakeLinkIssue(container = document) {
  const results = [];
  const fakeLinks = container.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
  
  fakeLinks.forEach(link => {
    if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
      results.push(link);
    }
  });
  
  return results;
}

/**
 * Adds main landmark element if missing.
 * @param {HTMLElement} container - The container to check for main landmark
 * @returns {HTMLElement|null} The main element added or null if not needed
 */
function addMainLandmark(container = document) {
  if (!container.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content');
    
    const firstChild = container.firstElementChild;
    if (firstChild) {
      container.insertBefore(main, firstChild);
    } else {
      container.appendChild(main);
    }
    
    return main;
  }
  
  return null;
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
globalObject.validateTableAccessibility = validateTableAccessibility;
globalObject.validateTableStructure = validateTableStructure;
globalObject.addMainLandmark = addMainLandmark;
globalObject.addSvgAccessibleNames = addSvgAccessibleNames;
globalObject.ensureUniqueLandmarks = ensureUniqueLandmarks;
globalObject.fixFakeLinkIssue = fixFakeLinkIssue;
globalObject.setFormElementAccessibleNames = setFormElementAccessibleNames;
globalObject.addA11yAttributesToInteractiveElements = addA11yAttributesToInteractiveElements;
globalObject.hasMissingAriaProperties = hasMissingAriaProperties;
globalObject.getSvgAccessibleName = getSvgAccessibleName;
globalObject.addressAccessibilityIssues = addressAccessibilityIssues;

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
  validateTableAccessibility,
  validateTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  setFormElementAccessibleNames,
  addA11yAttributesToInteractiveElements,
  hasMissingAriaProperties,
  getSvgAccessibleName,
  addressAccessibilityIssues
};