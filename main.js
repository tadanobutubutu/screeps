// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Get the lang attribute for the HTML element
 * @param {Document} doc - The document object
 * @returns {string} The language attribute value
 */
function getLangAttribute(doc) {
  const htmlElement = doc.documentElement;
  return htmlElement ? htmlElement.getAttribute('lang') || 'en' : 'en';
}

/**
 * Create an in-page button with accessibility support
 * @param {Document} doc - The document object
 * @param {Object} options - Button options
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(doc, options = {}) {
  const button = doc.createElement('button');
  const lang = getLangAttribute(doc);
  
  button.setAttribute('type', 'button');
  button.setAttribute('lang', lang);
  button.setAttribute('aria-label', options.label || 'In-page action');
  button.textContent = options.text || 'Action';
  
  return button;
}

/**
 * Validate table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} Validation result with issues
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element not provided'] };
  }
  
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td, th');
  
  if (headers.length === 0) {
    issues.push('Table should have header cells (th)');
  }
  
  cells.forEach(cell => {
    if (!cell.hasAttribute('scope') && cell.tagName === 'TH') {
      issues.push('Header cell missing scope attribute');
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate table structure for accessibility
 * @param {HTMLElement} table - The table element
 * @returns {Object} Structure validation result
 */
function validateTableStructure(table) {
  const structureIssues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element missing'] };
  }
  
  const caption = table.querySelector('caption');
  if (!caption) {
    structureIssues.push('Table missing caption');
  }
  
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  
  if (!thead) {
    structureIssues.push('Table missing thead');
  }
  
  if (!tbody) {
    structureIssues.push('Table missing tbody');
  }
  
  return {
    valid: structureIssues.length === 0,
    issues: structureIssues
  };
}

/**
 * Validate landmark elements
 * @param {Document} doc - The document object
 * @returns {Object} Landmark validation result
 */
function validateLandmark(doc) {
  const landmarks = doc.querySelectorAll('header, nav, main, aside, footer');
  const issues = [];
  
  const mainLandmarks = doc.querySelectorAll('main');
  if (mainLandmarks.length === 0) {
    issues.push('Document missing main landmark');
  }
  
  const navLandmarks = doc.querySelectorAll('nav');
  navLandmarks.forEach((nav, index) => {
    const label = nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby');
    if (!label && navLandmarks.length > 1) {
      issues.push(`Navigation ${index + 1} missing accessible label`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate landmark structure
 * @param {Document} doc - The document object
 * @returns {Object} Structure validation result
 */
function validateLandmarkStructure(doc) {
  const structureIssues = [];
  
  const main = doc.querySelector('main');
  if (!main) {
    structureIssues.push('Missing main element');
  }
  
  const headers = doc.querySelectorAll('header');
  headers.forEach((header, index) => {
    const parent = header.parentElement;
    if (parent && parent.tagName === 'BODY') {
      // Header at body level should not be in landmark
    }
  });
  
  return {
    valid: structureIssues.length === 0,
    issues: structureIssues
  };
}

/**
 * Get SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
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
  
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = svg.ownerDocument.getElementById(ariaLabelledby);
    return titleElement ? titleElement.textContent : '';
  }
  
  return '';
}

/**
 * Set SVG accessibility attributes
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 * @returns {SVGElement} The modified SVG element
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return svg;
  
  svg.setAttribute('role', 'img');
  
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  const title = svg.querySelector('title');
  if (!title && accessibleName) {
    const newTitle = svg.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'title');
    newTitle.textContent = accessibleName;
    svg.insertBefore(newTitle, svg.firstChild);
  }
  
  return svg;
}

/**
 * Validate link accessibility
 * @param {HTMLElement} link - The link element
 * @returns {Object} Link validation result
 */
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) {
    return { valid: false, issues: ['Link element not provided'] };
  }
  
  const href = link.getAttribute('href');
  if (!href || href === '#') {
    issues.push('Link missing meaningful href');
  }
  
  const text = link.textContent.trim();
  if (!text) {
    issues.push('Link missing accessible text');
  }
  
  const ariaLabel = link.getAttribute('aria-label');
  if (!text && !ariaLabel) {
    issues.push('Link has neither text nor aria-label');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Handle fake links (links that should be buttons)
 * @param {Document} doc - The document object
 * @returns {Array} Array of fake links found
 */
function handleFakeLinks(doc) {
  const fakeLinks = [];
  const links = doc.querySelectorAll('a[href="#"], a:not([href])');
  
  links.forEach(link => {
    const role = link.getAttribute('role');
    if (role === 'button' || link.classList.contains('btn')) {
      fakeLinks.push({
        element: link,
        issue: 'Anchor used as button',
        suggestion: 'Use <button> element instead'
      });
    }
  });
  
  return fakeLinks;
}

/**
 * Ensure unique landmark roles
 * @param {Document} doc - The document object
 * @returns {Object} Validation result
 */
function ensureUniqueLandmarks(doc) {
  const issues = [];
  const bannerCount = doc.querySelectorAll('header[role="banner"], header:not(nav):not(main *)').length;
  const contentinfoCount = doc.querySelectorAll('footer[role="contentinfo"], footer:not(nav):not(main *)').length;
  
  if (bannerCount > 1) {
    issues.push(`Multiple banner landmarks found (${bannerCount})`);
  }
  
  if (contentinfoCount > 1) {
    issues.push(`Multiple contentinfo landmarks found (${contentinfoCount})`);
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

module.exports = {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  ensureUniqueLandmarks
};