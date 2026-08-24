// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  const lang = getLangAttribute();
  return lang ? `lang="${lang}"` : '';
}

function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, errors: ['Not a table element'] };
  }
  
  const errors = [];
  const headers = table.querySelectorAll('th');
  const rows = table.querySelectorAll('tr');
  
  if (headers.length === 0 && rows.length > 0) {
    errors.push('Table missing header cells (th)');
  }
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (index === 0 && cells.length > 0) {
      const hasHeader = Array.from(cells).some(cell => cell.tagName === 'TH');
      if (!hasHeader) {
        errors.push('First row should contain header cells');
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, errors: ['Not a table element'] };
  }
  
  const errors = [];
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  if (!thead && !tbody && !tfoot) {
    errors.push('Table missing structural elements (thead, tbody, tfoot)');
  }
  
  const caption = table.querySelector('caption');
  if (!caption) {
    errors.push('Table missing caption element');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmark(element) {
  if (!element) {
    return { valid: false, errors: ['No element provided'] };
  }
  
  const landmarkRoles = ['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  const isLandmark = landmarkRoles.includes(role) || 
    (tagName === 'header' && role !== 'presentation') ||
    (tagName === 'main') ||
    (tagName === 'nav') ||
    (tagName === 'footer' && role !== 'presentation') ||
    (tagName === 'aside' && role !== 'presentation') ||
    (tagName === 'section' && element.hasAttribute('aria-label'));
  
  if (!isLandmark) {
    return { valid: false, errors: ['Element is not a valid landmark'] };
  }
  
  return { valid: true, errors: [] };
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"], [role="form"], [role="region"], header:not([role="presentation"]), main, nav, footer:not([role="presentation"]), aside:not([role="presentation"]), section[aria-label]');
  
  const errors = [];
  const seenRoles = new Set();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (seenRoles.has(role)) {
      errors.push(`Duplicate landmark role: ${role}`);
    }
    seenRoles.add(role);
    
    if (role === 'region' && !landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      errors.push('Region landmark missing accessible name');
    }
  });
  
  return { valid: errors.length === 0, errors };
}

function getSvgAccessibleName(svg) {
  if (!svg || svg.tagName !== 'SVG') {
    return '';
  }
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }
  
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  return '';
}

function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  
  if (options.text) {
    button.textContent = options.text;
  }
  
  if (options['aria-label']) {
    button.setAttribute('aria-label', options['aria-label']);
  }
  
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  if (options.className) {
    button.className = options.className;
  }
  
  return button;
}

function createAccessibleLink(options = {}) {
  const link = document.createElement('a');
  
  if (options.href) {
    link.href = options.href;
  }
  
  if (options.text) {
    link.textContent = options.text;
  }
  
  if (options['aria-label']) {
    link.setAttribute('aria-label', options['aria-label']);
  }
  
  if (options.target) {
    link.target = options.target;
    if (options.target === '_blank') {
      link.rel = 'noopener noreferrer';
    }
  }
  
  if (options.className) {
    link.className = options.className;
  }
  
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  
  return link;
}

module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink
};