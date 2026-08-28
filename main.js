// main.js - No changes needed; the issue is in docs/dependency-graph.html
// The fix should be applied to the HTML file, not this JavaScript file.
// TODO: Add back any required exports that might have been?

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }
  
  // Set role attribute
  svgElement.setAttribute('role', 'img');
  
  // Set aria-label if not present
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (!ariaLabel) {
    svgElement.setAttribute('aria-label', svgElement.getAttribute('title') || svgElement.getAttribute('alt') || 'SVG Image');
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  // Check if link has proper href
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    return false;
  }

  // Check if link has text content or aria-label
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label');
  
  if (!hasText && !hasAriaLabel) {
    return false;
  }

  return true;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  // Check if button has type attribute
  const type = button.getAttribute('type');
  
  // Check if button has text content or aria-label
  const hasText = button.textContent.trim().length > 0;
  const hasAriaLabel = button.getAttribute('aria-label');
  const hasAriaLabelledby = button.getAttribute('aria-labelledby');
  
  if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
    return false;
  }

  return true;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    links: {
      accessible: [],
      inaccessible: []
    },
    buttons: {
      accessible: [],
      inaccessible: []
    },
    isFullyAccessible: true
  };

  // Check all links in the container
  const links = container.querySelectorAll ? container.querySelectorAll('a') : [];
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      results.links.accessible.push(link);
    } else {
      results.links.inaccessible.push(link);
      results.isFullyAccessible = false;
    }
  });

  // Check all buttons in the container
  const buttons = container.querySelectorAll ? container.querySelectorAll('button') : [];
  buttons.forEach(button => {
    if (isButtonAccessible(button)) {
      results.buttons.accessible.push(button);
    } else {
      results.buttons.inaccessible.push(button);
      results.isFullyAccessible = false;
    }
  });

  return results;
}

// Add the new renderIndexView function
/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Implement your code here.
  // Example of creating a button in-page:
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  // Append the button to the body or another element as needed
  document.body.appendChild(button);
}

// REACT_015: Add lang attribute to HTML element
/**
 * Gets the lang attribute value from the HTML element.
 * @param {Document} [doc=document] - The document to get lang attribute from
 * @returns {string|null} The lang attribute value or null if not set
 */
function getLangAttribute(doc = document) {
  if (!doc || !doc.documentElement) {
    return null;
  }
  return doc.documentElement.getAttribute('lang');
}

/**
 * Adds or updates the lang attribute on the HTML element.
 * @param {string} lang - The language code to set (e.g., 'en', 'es')
 * @param {Document} [doc=document] - The document to modify
 */
function addLangAttribute(lang, doc = document) {
  if (!doc || !doc.documentElement || !lang) {
    return;
  }
  doc.documentElement.setAttribute('lang', lang);
}

// REACT_027: Fix table structure issues
/**
 * Validates table accessibility by checking for proper structure.
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with isValid and issues array
 */
function validateTableAccessibility(table) {
  const result = { isValid: true, issues: [] };
  
  if (!table || table.nodeName.toLowerCase() !== 'table') {
    result.isValid = false;
    result.issues.push('Invalid table element');
    return result;
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    result.isValid = false;
    result.issues.push('Table missing caption');
  }
  
  // Check for th elements for data tables
  const thElements = table.querySelectorAll('th');
  if (thElements.length === 0) {
    result.issues.push('Table should have header cells (th) for accessibility');
  }
  
  return result;
}

/**
 * Validates the structure of a table.
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Structure validation result
 */
function validateTableStructure(table) {
  const result = { isValid: true, issues: [] };
  
  if (!table) {
    result.isValid = false;
    result.issues.push('Table element is required');
    return result;
  }
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    result.issues.push('Table should have a thead section');
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    result.issues.push('Table should have a tbody section');
  }
  
  // Check for proper column/row headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    result.issues.push('Table should have header cells');
  }
  
  return result;
}

/**
 * Fixes table structure issues.
 * @param {HTMLTableElement} table - The table to fix
 * @returns {HTMLTableElement} The fixed table
 */
function fixTableStructure(table) {
  if (!table) {
    return null;
  }
  
  // Ensure thead exists
  let thead = table.querySelector('thead');
  if (!thead) {
    thead = document.createElement('thead');
    table.insertBefore(thead, table.firstChild);
  }
  
  // Ensure tbody exists
  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
  }
  
  // Move first row to thead if it's headers
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.querySelector('th') && thead.children.length === 0) {
    thead.appendChild(firstRow);
  }
  
  return table;
}

// REACT_017: Add/fix landmark issues
/**
 * Adds a main landmark to the document.
 * @param {HTMLElement} [container=document.body] - The container to add main landmark to
 * @returns {HTMLElement} The main element created or found
 */
function addMainLandmark(container = document.body) {
  if (!container) {
    return null;
  }
  
  let mainElement = container.querySelector('main');
  
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');
    
    // Find appropriate insertion point
    const existingMain = container.querySelector('[role="main"]');
    if (existingMain) {
      return existingMain;
    }
    
    container.appendChild(mainElement);
  }
  
  return mainElement;
}

/**
 * Validates that landmarks exist in the document.
 * @param {Document} [doc=document] - The document to validate
 * @returns {Object} Validation result
 */
function validateLandmark(doc = document) {
  const result = { isValid: true, issues: [] };
  
  if (!doc) {
    result.isValid = false;
    result.issues.push('Document is required');
    return result;
  }
  
  // Check for main landmark
  const mainElements = doc.querySelectorAll('main, [role="main"]');
  result.landmarks.main = mainElements.length;
  if (mainElements.length === 0) {
    result.issues.push('Document missing main landmark');
  }
  
  // Check for header landmark
  const headerElements = doc.querySelectorAll('header, [role="banner"]');
  result.landmarks.header = headerElements.length;
  if (headerElements.length === 0) {
    result.issues.push('Document missing header landmark');
  }
  
  // Check for footer landmark
  const footerElements = doc.querySelectorAll('footer, [role="contentinfo"]');
  result.landmarks.footer = footerElements.length;
  if (footerElements.length === 0) {
    result.issues.push('Document missing footer landmark');
  }
  
  // Check for nav landmark
  const navElements = doc.querySelectorAll('nav, [role="navigation"]');
  result.landmarks.nav = navElements.length;
  
  result.isValid = result.issues.length === 0;
  
  return result;
}

/**
 * Validates landmark structure in the document.
 * @param {Document} [doc=document] - The document to validate
 * @returns {Object} Structure validation result
 */
function validateLandmarkStructure(doc = document) {
  const result = { isValid: true, issues: [] };
  
  if (!doc || !doc.body) {
    result.isValid = false;
    result.issues.push('Document body is required');
    return result;
  }
  
  // Check for proper nesting
  const mainElement = doc.querySelector('main, [role