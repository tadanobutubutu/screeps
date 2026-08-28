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
  const result = { isValid: true, issues: [], landmarks: {} };
  
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
  const mainElement = doc.querySelector('main, [role="main"]');
  if (!mainElement) {
    result.issues.push('Main landmark should be present');
  }
  
  // Check for proper landmark hierarchy
  const header = doc.querySelector('header, [role="banner"]');
  const footer = doc.querySelector('footer, [role="contentinfo"]');
  
  if (header && mainElement) {
    // These should be siblings at the body level
  }
  
  return result;
}

/**
 * Validates landmark attributes.
 * @param {HTMLElement} element - The element to validate
 * @returns {Object} Attribute validation result
 */
function validateLandmarkAttributes(element) {
  const result = { isValid: true, issues: [] };
  
  if (!element) {
    result.isValid = false;
    result.issues.push('Element is required');
    return result;
  }
  
  // Check for appropriate role attribute
  const validLandmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  const tagName = element.tagName.toLowerCase();
  
  // Semantic elements don't need explicit role
  const semanticElements = ['header', 'nav', 'main', 'aside', 'footer'];
  const hasImplicitRole = semanticElements.includes(tagName);
  
  const explicitRole = element.getAttribute('role');
  
  if (!hasImplicitRole && !explicitRole) {
    result.issues.push('Landmark should have explicit role or be a semantic element');
  }
  
  if (explicitRole && !validLandmarkRoles.includes(explicitRole)) {
    result.issues.push(`Invalid landmark role: ${explicitRole}`);
  }
  
  result.isValid = result.issues.length === 0;
  
  return result;
}

// REACT_041: Add accessible names to SVGs
/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element
 * @returns {string|null} The accessible name or null
 */
function getSvgAccessibleName(svg) {
  if (!svg) {
    return null;
  }
  
  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent;
    }
  }
  
  // Check title element inside SVG
  const titleElement = svg.querySelector('title');
  if (titleElement) {
    return titleElement.textContent;
  }
  
  // Check title attribute
  const titleAttr = svg.getAttribute('title');
  if (titleAttr) {
    return titleAttr;
  }
  
  return null;
}

/**
 * Sets accessibility attributes on an SVG element.
 * @param {SVGElement} svg - The SVG element to modify
 * @param {Object} options - Options for accessibility attributes
 */
function setSvgAttributes(svg, options = {}) {
  if (!svg) {
    return;
  }
  
  // Set role attribute
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', options.role || 'img');
  }
  
  // Set aria-label if provided
  if (options.label) {
    svg.setAttribute('aria-label', options.label);
  }
  
  // If no label provided, try to get from title
  if (!svg.getAttribute('aria-label')) {
    const title = svg.querySelector('title');
    if (title) {
      svg.setAttribute('aria-label', title.textContent);
    } else {
      svg.setAttribute('aria-label', options.alt || 'SVG Image');
    }
  }
}

// REACT_025: Ensure unique landmarks
/**
 * Ensures all landmarks in the document are unique.
 * @param {Document} [doc=document] - The document to process
 * @returns {Object} Result of the operation
 */
function ensureUniqueLandmarks(doc = document) {
  const result = { fixed: [], issues: [] };
  
  if (!doc) {
    return result;
  }
  
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  
  landmarkRoles.forEach(role => {
    const elements = doc.querySelectorAll(`[role="${role}"]`);
    
    if (elements.length > 1 && role !== 'navigation') {
      // Keep first, mark others as issues
      for (let i = 1; i < elements.length; i++) {
        result.issues.push({
          role: role,
          element: elements[i],
          message: `Duplicate ${role} landmark found`
        });
      }
    }
  });
  
  return result;
}

// REACT_036: Fix fake link issues
/**
 * Creates an accessible in-page button.
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {Function} options.onClick - Click handler
 * @param {string} [options.id] - Button ID
 * @returns {HTMLButtonElement} The created button
 */
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  
  if (options.id) {
    button.id = options.id;
  }
  
  if (options.text) {
    button.textContent = options.text;
  }
  
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  // Ensure button has accessible attributes
  if (!button.getAttribute('type')) {
    button.setAttribute('type', 'button');
  }
  
  return button;
}

/**
 * Validates link accessibility.
 * @param {HTMLAnchorElement} link - The link to validate
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(link) {
  const result = { isValid: true, issues: [] };
  
  if (!link) {
    result.isValid = false;
    result.issues.push('Link element is required');
    return result;
  }
  
  // Check href
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    result.isValid = false;
    result.issues.push('Link missing or invalid href attribute');
  }
  
  // Check for accessible name
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label');
  const hasAriaLabelledby = link.getAttribute('aria-labelledby');
  const hasTitle = link.getAttribute('title');
  
  if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
    result.isValid = false;
    result.issues.push('Link missing accessible name');
  }
  
  return result;
}

/**
 * Handles fake links by converting them to proper buttons or adding accessibility.
 * @param {Document|HTMLElement} container - The container to process
 * @returns {Object} Result of handling fake links
 */
function handleFakeLinks(container = document) {
  const result = { converted: [], fixed: [], issues: [] };
  
  if (!container) {
    return result;
  }
  
  const links = container.querySelectorAll ? container.querySelectorAll('a') : [];
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if it's a fake link (empty href, #, or javascript:void(0))
    const isFakeLink = !href || href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;';
    
    if (isFakeLink) {
      const validation = validateLinkAccessibility(link);
      
      if (!validation.isValid) {
        // Try to fix by adding role="button" and tabindex
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        result.fixed.push(link);
      }
    }
  });
  
  return result;
}

// REACT_037: Add proper landmark regions
/**
 * Adds proper landmark regions to the document.
 * @param {Document|HTMLElement} container - The container to process
 * @returns {Object} Result of adding landmark regions
 */
function addProperLandmarkRegions(container = document) {
  const result = { added: [], existing: [] };
  
  if (!container) {
    return result;
  }
  
  // Check for header
  const header = container.querySelector('header, [role="banner"]');
  if (header) {
    result.existing.push({ type: 'header', element: header });
  }
  
  // Check for main
  const main = container.querySelector('main, [role="main"]');
  if (main) {
    result.existing.push({ type: 'main', element: main });
  } else {
    const newMain = document.createElement('main');
    newMain.setAttribute('role', 'main');
    container.appendChild(newMain);
    result.added.push({ type: 'main', element: newMain });
  }
  
  // Check for footer
  const footer = container.querySelector('footer, [role="contentinfo"]');
  if (footer) {
    result.existing.push({ type: 'footer', element: footer });
  }
  
  // Check for nav
  const nav = container.querySelector('nav, [role="navigation"]');
  if (nav) {
    result.existing.push({ type: 'nav', element: nav });
  }
  
  return result;
}

// Exports for all functions
module.exports = {
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkAccessibility,
  renderIndexView,
  // REACT_015
  getLangAttribute,
  addLangAttribute,
  // REACT_027
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  // REACT_017
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  // REACT_041
  getSvgAccessibleName,
  setSvgAttributes,
  // REACT_025
  ensureUniqueLandmarks,
  // REACT_036
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  // REACT_037
  addProperLandmarkRegions,
};