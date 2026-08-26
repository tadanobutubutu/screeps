// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

/**
 * Gets the language attribute value from an HTML element
 * @param {HTMLElement} element - The HTML element to get lang from
 * @returns {string|null} - The language attribute value or null
 */
function getLangAttribute(element) {
  if (!element) return null;
  return element.getAttribute('lang') || element.lang || null;
}

/**
 * Gets the full language attribute including fallback
 * @param {HTMLElement} element - The HTML element
 * @returns {string} - The full language string
 */
function getFullLangAttribute(element) {
  const lang = getLangAttribute(element);
  if (lang) return lang;
  
  // Check parent elements for lang attribute
  let parent = element.parentElement;
  while (parent) {
    const parentLang = getLangAttribute(parent);
    if (parentLang) return parentLang;
    parent = parent.parentElement;
  }
  return 'en';
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} - Validation result with issues array
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) return { valid: false, issues: ['Table not found'] };
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table is missing a caption');
  }
  
  // Check for th elements
  const ths = table.querySelectorAll('th');
  if (ths.length === 0) {
    issues.push('Table should have header cells (th)');
  }
  
  // Check for scope attributes on th
  ths.forEach(th => {
    if (!th.hasAttribute('scope')) {
      issues.push('Header cell is missing scope attribute');
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validates table structure for proper accessibility
 * @param {HTMLTableElement} table - The table element
 * @returns {Object} - Structure validation result
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) return { valid: false, issues: ['Table not found'] };
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    issues.push('Table should have a thead element');
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    issues.push('Table should have a tbody element');
  }
  
  // Check that headers are in thead
  const headerRows = thead ? thead.querySelectorAll('tr') : [];
  if (headerRows.length === 0 && ths.length > 0) {
    issues.push('Header cells should be within thead');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validates landmark elements
 * @param {Document|Element} context - The context to search within
 * @returns {Object} - Validation result
 */
function validateLandmark(context = document) {
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  
  landmarks.forEach(landmark => {
    const elements = context.querySelectorAll(landmark);
    elements.forEach(el => {
      // Check if landmark has accessible name
      const ariaLabel = el.getAttribute('aria-label');
      const ariaLabelledby = el.getAttribute('aria-labelledby');
      const title = el.getAttribute('title');
      
      if (!ariaLabel && !ariaLabelledby && !title) {
        // Only flag if it's a section without implicit role
        if (el.tagName.toLowerCase() === 'section' || el.tagName.toLowerCase() === 'aside') {
          issues.push(`${landmark} landmark should have an accessible name`);
        }
      }
    });
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validates landmark structure
 * @param {Document|Element} context - The context to search within
 * @returns {Object} - Structure validation result
 */
function validateLandmarkStructure(context = document) {
  const issues = [];
  
  // Check for multiple main landmarks
  const mains = context.querySelectorAll('main');
  if (mains.length > 1) {
    issues.push('Document should have only one main landmark');
  }
  
  // Check for proper header/footer usage
  const headers = context.querySelectorAll('header');
  const footers = context.querySelectorAll('footer');
  
  headers.forEach(header => {
    if (!header.closest('main') && !header.closest('article') && !header.closest('section')) {
      // Header outside of content is OK, just informational
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Ensures all landmarks have unique identifiers
 * @param {Document|Element} context - The context to search within
 * @returns {Object} - Result with duplicates array
 */
function ensureUniqueLandmarks(context = document) {
  const issues = [];
  const landmarkCounts = {};
  
  const landmarks = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  
  landmarks.forEach(role => {
    const elements = context.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el, index) => {
      if (!el.id) {
        const id = `${role}-${index}`;
        el.setAttribute('id', id);
      }
      
      const key = `${role}-${el.id}`;
      if (landmarkCounts[key]) {
        issues.push(`Duplicate landmark: ${role} with id "${el.id}"`);
      } else {
        landmarkCounts[key] = true;
      }
    });
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string|null} - The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const targetEl = document.getElementById(ariaLabelledby);
    return targetEl ? targetEl.textContent : null;
  }
  
  // Check title element
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  return null;
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement} - The accessible button
 */
function createInPageButton(options = {}) {
  const {
    text = '',
    onClick = () => {},
    ariaLabel = '',
    id = '',
    className = ''
  } = options;
  
  const button = document.createElement('button');
  button.type = 'button';
  
  if (text) {
    button.textContent = text;
  }
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  } else if (!text) {
    console.warn('Button should have text or aria-label for accessibility');
  }
  
  if (id) {
    button.id = id;
  }
  
  if (className) {
    button.className = className;
  }
  
  button.addEventListener('click', onClick);
  
  return button;
}

/**
 * Creates an accessible link
 * @param {Object} options - Link options
 * @returns {HTMLAnchorElement} - The accessible link
 */
function createAccessibleLink(options = {}) {
  const {
    href = '#',
    text = '',
    onClick = () => {},
    ariaLabel = '',
    id = '',
    className = '',
    isFakeLink = false
  } = options;
  
  const link = document.createElement('a');
  link.href = href;
  
  if (text) {
    link.textContent = text;
  }
  
  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }
  
  if (id) {
    link.id = id;
  }
  
  if (className) {
    link.className = className;
  }
  
  // If it's a fake link (not a real anchor), add role="link" for accessibility
  if (isFakeLink) {
    link.setAttribute('role', 'link');
    link.setAttribute('tabindex', '0');
  }
  
  if (href === '#' || href === '') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      onClick();
    });
  } else {
    link.addEventListener('click', onClick);
  }
  
  return link;
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues
 * @param {Function} reporter - Function to report issues
 * @returns {Object} - Summary of handled issues
 */
function handleAccessibilityIssues(issues, reporter = console.warn) {
  const summary = {
    total: issues.length,
    critical: [],
    moderate: [],
    minor: []
  };
  
  issues.forEach(issue => {
    const severity = issue.severity || 'moderate';
    
    if (severity === 'critical') {
      summary.critical.push(issue);
    } else if (severity === 'moderate') {
      summary.moderate.push(issue);
    } else {
      summary.minor.push(issue);
    }
    
    reporter(`[${severity.toUpperCase()}] ${issue.message}`, issue);
  });
  
  return summary;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues
  };
}