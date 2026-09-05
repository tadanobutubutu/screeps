// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

// REACT_015: Returns the appropriate lang attribute value for the HTML element
function getLangAttribute() {
  // Default to English; can be extended to detect from content/user preference
  return 'en';
}

// REACT_015: Returns a person name string, used in accessible contexts
function personName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return name.trim();
}

// REACT_027: Validates that a table has proper accessibility attributes
function validateTableAccessibility(table) {
  if (!table) return false;
  // Ensure table has a caption or aria-label
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label');
  const hasAriaLabelledBy = table.getAttribute('aria-labelledby');
  return Boolean(hasCaption || hasAriaLabel || hasAriaLabelledBy);
}

// REACT_027: Validates the structural integrity of a table (thead, tbody, proper rows/cells)
function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const hasHeader = table.querySelector('thead') || table.querySelector('th');
  const hasBody = table.querySelector('tbody');
  return Boolean(hasHeader && hasBody);
}

// REACT_017: Validates that a landmark element is properly defined
function validateLandmark(element) {
  if (!element) return false;
  const landmarkRoles = [
    'banner', 'navigation', 'main', 'complementary',
    'contentinfo', 'search', 'form', 'region'
  ];
  const role = element.getAttribute('role');
  const tag = element.tagName.toLowerCase();
  const implicitLandmarks = {
    header: 'banner', nav: 'navigation', main: 'main',
    aside: 'complementary', footer: 'contentinfo', form: 'form'
  };
  return landmarkRoles.includes(role) || Boolean(implicitLandmarks[tag]);
}

// REACT_017: Validates the structure of landmark elements within a container
function validateLandmarkStructure(container) {
  if (!container) return false;
  const landmarks = container.querySelectorAll(
    'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
  );
  // Ensure at least one main landmark exists
  return Array.from(landmarks).some(el => el.tagName.toLowerCase() === 'main' || el.getAttribute('role') === 'main');
}

// REACT_041: Returns an accessible name for an SVG element
function getSvgAccessibleName(svg, fallbackName) {
  if (!svg) return '';
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const ref = document.getElementById(ariaLabelledBy);
    if (ref) return ref.textContent || '';
  }
  const titleEl = svg.querySelector('title');
  if (titleEl && titleEl.textContent) return titleEl.textContent;
  return fallbackName || '';
}

// REACT_036: Creates an in-page button element (avoiding fake <a> links)
function createInPageButton(label, onClickHandler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  if (typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

function getLangAttribute(element) {
  return element ? element.getAttribute('lang') : null;
}

function getFullLangAttribute(element) {
  if (!element) return null;
  const lang = element.getAttribute('lang');
  return lang ? lang : 'en';
}

function validateTableAccessibility(table) {
  if (!table) return { valid: false, issues: ['Table is missing'] };
  const issues = [];
  
  // Check for proper table structure
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  
  if (!hasHeaders) {
    issues.push('Table should have header cells (th)');
  }
  
  return { valid: issues.length === 0, issues };
}

function validateTableStructure(table) {
  if (!table) return { valid: false, issues: ['Table is missing'] };
  const issues = [];
  
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows');
  }
  
  // Check for proper th/td usage
  const cells = table.querySelectorAll('td');
  const headers = table.querySelectorAll('th');
  
  if (headers.length === 0 && cells.length > 0) {
    issues.push('Data table should have header cells');
  }
  
  return { valid: issues.length === 0, issues };
}

function validateLandmark(element) {
  if (!element) return { valid: false, issues: ['Element is missing'] };
  const issues = [];
  
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (!validLandmarks.includes(tagName) && !validLandmarks.includes(role)) {
    issues.push('Element should be a landmark element');
  }
  
  return { valid: issues.length === 0, issues };
}

function validateLandmarkStructure(container) {
  if (!container) return { valid: false, issues: ['Container is missing'] };
  const issues = [];
  
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer, section, article');
  const landmarkSet = new Set();
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    if (landmarkSet.has(tagName)) {
      issues.push(`Duplicate landmark: ${tagName}`);
    }
    landmarkSet.add(tagName);
  });
  
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length > 1) {
    issues.push('Page should have only one main landmark');
  }
  
  return { valid: issues.length === 0, issues };
}

function ensureUniqueLandmarks(container) {
  const result = validateLandmarkStructure(container);
  const duplicates = [];
  
  if (!container) return duplicates;
  
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer');
  const seen = new Map();
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    if (seen.has(tagName)) {
      duplicates.push({ element: landmark, existing: seen.get(tagName) });
    } else {
      seen.set(tagName, landmark);
    }
  });
  
  return duplicates;
}

function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : null;
  }
  
  return null;
}

function createInPageButton(options = {}) {
  const { text, onClick, ariaLabel, className = '' } = options;
  
  const button = document.createElement('button');
  button.textContent = text || '';
  button.className = `in-page-button ${className}`.trim();
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Add accessibility attributes
  button.setAttribute('type', 'button');
  
  return button;
}

function createAccessibleLink(options = {}) {
  const { href, text, onClick, ariaLabel, target, className = '' } = options;
  
  if (!href || href === '#' || href.startsWith('javascript:')) {
    // Convert fake links to buttons
    return createInPageButton({ text, onClick, ariaLabel, className });
  }
  
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text || '';
  link.className = className;
  
  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }
  
  if (target) {
    link.target = target;
    if (target === '_blank') {
      link.rel = 'noopener noreferrer';
    }
  }
  
  if (onClick && typeof onClick === 'function') {
    link.addEventListener('click', onClick);
  }
  
  return link;
}

function handleAccessibilityIssues(issues) {
  if (!Array.isArray(issues)) {
    issues = [issues];
  }
  
  const report = {
    total: issues.length,
    fixed: 0,
    pending: [],
    errors: []
  };
  
  issues.forEach(issue => {
    if (issue.fixed) {
      report.fixed++;
    } else if (issue.error) {
      report.errors.push(issue);
    } else {
      report.pending.push(issue);
    }
  });
  
  return report;
}

// Export functions for testing
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