function getLangAttribute() {
  return 'en';
}

/**
 * Create an accessible in-page button
 * @param {Object} options - Button options
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.textContent = options.text || 'Button';
  button.setAttribute('aria-label', options.ariaLabel || options.text || 'In-page button');
  if (options.lang) {
    button.setAttribute('lang', options.lang);
  }
  return button;
}

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table not found'] };
  }
  
  const headers = table.querySelectorAll('th');
  const hasCaption = table.querySelector('caption') !== null;
  
  if (headers.length === 0) {
    issues.push('Table should have header cells (th)');
  }
  
  if (!hasCaption && !table.getAttribute('aria-label')) {
    issues.push('Table should have a caption or aria-label');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate table structure
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table not found'] };
  }
  
  const rows = table.querySelectorAll('tr');
  let hasHeaderRow = false;
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length === 0) {
      issues.push(`Row ${index} has no cells`);
    }
    if (row.querySelector('th')) {
      hasHeaderRow = true;
    }
  });
  
  if (!hasHeaderRow) {
    issues.push('Table should have a header row with th elements');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate landmark accessibility
 * @param {Document} doc - The document to validate
 * @returns {Object} Validation result
 */
function validateLandmark(doc) {
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1) {
      const count = elements.length;
      issues.push(`Multiple ${landmark} landmarks found: ${count}`);
    }
  });
  
  const mainElement = doc.querySelector('main') || doc.querySelector('[role="main"]');
  if (!mainElement) {
    issues.push('Document should have a main landmark');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate landmark structure
 * @param {Document} doc - The document to validate
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(doc) {
  const issues = [];
  
  const requiredLandmarks = ['header', 'main', 'footer'];
  requiredLandmarks.forEach(landmark => {
    const element = doc.querySelector(landmark) || doc.querySelector(`[role="${landmark}"]`);
    if (!element) {
      issues.push(`Missing required landmark: ${landmark}`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Ensure unique landmarks in the document
 * @param {Document} doc - The document to process
 * @returns {Object} Processing result
 */
function ensureUniqueLandmarks(doc) {
  const results = { processed: 0, updated: 0 };
  const landmarkTags = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarkTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('role', tag);
          results.updated++;
        }
        results.processed++;
      });
    }
  });
  
  return results;
}

/**
 * Get SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const titleElement = document.getElementById(ariaLabelledBy);
    return titleElement ? titleElement.textContent : '';
  }
  
  return '';
}

/**
 * Set SVG accessibility attributes
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 * @returns {SVGElement} The updated SVG element
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return svg;
  
  if (!svg.querySelector('title')) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = accessibleName;
    svg.insertBefore(title, svg.firstChild);
  }
  
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  return svg;
}

/**
 * Validate link accessibility
 * @param {HTMLAnchorElement} link - The link to validate
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) {
    return { valid: false, issues: ['Link not found'] };
  }
  
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasTitle = link.hasAttribute('title');
  
  if (!hasText && !hasAriaLabel && !hasTitle) {
    issues.push('Link must have text content, aria-label, or title');
  }
  
  const href = link.getAttribute('href');
  if (!href || href === '#') {
    issues.push('Link should have a valid href attribute');
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Handle fake links (elements with click handlers but no href)
 * @param {Document} doc - The document to process
 * @returns {Object} Processing result
 */
function handleFakeLinks(doc) {
  const results = { found: 0, processed: 0 };
  
  const clickableElements = doc.querySelectorAll('[onclick], [role="button"]');
  
  clickableElements.forEach(element => {
    if (element.tagName !== 'A' && element.tagName !== 'BUTTON') {
      results.found++;
      
      if (!element.getAttribute('tabindex') && !element.hasAttribute('role')) {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        results.processed++;
      }
    }
  });
  
  return results;
}

// Export functions for testing
module.exports = {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
};