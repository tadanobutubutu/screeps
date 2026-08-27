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

  // Check for proper table structure (thead, tbody, or tfoot)
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