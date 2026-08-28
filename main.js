// TODO: Add back any required exports that might have been?
// (This comment remains as-is)

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

// Accessibility: REACT_015 - Add lang attribute to HTML element
function getLangAttribute(doc = document) {
  const htmlElement = doc.documentElement || doc.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// Accessibility: REACT_036 - Create in-page button for accessibility
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.textContent = options.text || 'Skip to content';
  button.className = options.className || 'in-page-button';
  button.setAttribute('aria-label', options.ariaLabel || 'Skip to main content');
  return button;
}

// Accessibility: REACT_027 - Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  if (!table) return issues;
  
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td, th');
  
  if (headers.length === 0) {
    issues.push({ type: 'REACT_027', message: 'Table missing header cells' });
  }
  
  return issues;
}

// Accessibility: REACT_027 - Validate table structure
function validateTableStructure(table) {
  const issues = [];
  if (!table) return issues;
  
  const rows = table.querySelectorAll('tr');
  let firstRowCellCount = 0;
  
  if (rows.length > 0) {
    firstRowCellCount = rows[0].querySelectorAll('th, td').length;
  }
  
  rows.forEach((row, index) => {
    const cellCount = row.querySelectorAll('th, td').length;
    if (cellCount !== firstRowCellCount && firstRowCellCount > 0) {
      issues.push({ type: 'REACT_027', row: index, message: 'Table row has inconsistent cell count' });
    }
  });
  
  return issues;
}

// Accessibility: REACT_017 - Validate landmarks
function validateLandmark(element) {
  const issues = [];
  if (!element) return issues;
  
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  const landmark = element.getAttribute('role') || element.tagName.toLowerCase();
  
  if (!validLandmarks.includes(landmark)) {
    issues.push({ type: 'REACT_017', message: `Invalid landmark: ${landmark}` });
  }
  
  return issues;
}

// Accessibility: REACT_017 - Validate landmark structure
function validateLandmarkStructure(doc = document) {
  const issues = [];
  if (!doc) return issues;
  
  const mainLandmarks = doc.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length === 0) {
    issues.push({ type: 'REACT_017', message: 'Missing main landmark' });
  }
  if (mainLandmarks.length > 1) {
    issues.push({ type: 'REACT_017', message: 'Multiple main landmarks found' });
  }
  
  return issues;
}

// Accessibility: REACT_041 - Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const doc = svg.ownerDocument || document;
    const titleElement = doc.getElementById(ariaLabelledBy);
    return titleElement ? titleElement.textContent : null;
  }
  
  return null;
}

// Accessibility: REACT_041 - Set SVG attributes for accessibility
function setSvgAttributes(svg, options = {}) {
  if (!svg) return svg;
  
  if (options.title && !svg.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = options.title;
    svg.insertBefore(title, svg.firstChild);
  }
  
  if (options.id) {
    svg.setAttribute('id', options.id);
  }
  
  if (options.ariaLabel && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.ariaLabelledBy && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('aria-labelledby', options.ariaLabelledBy);
  }
  
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', options.role || 'img');
  }
  
  return svg;
}

// Accessibility: REACT_025 - Ensure unique landmarks
function ensureUniqueLandmarks(doc = document) {
  const issues = [];
  if (!doc) return issues;
  
  const landmarkSelectors = '[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"]';
  const landmarks = doc.querySelectorAll(landmarkSelectors);
  
  const countByRole = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    countByRole[role] = (countByRole[role] || 0) + 1;
  });
  
  const uniqueLandmarks = ['banner', 'navigation', 'main', 'contentinfo'];
  uniqueLandmarks.forEach(role => {
    if (countByRole[role] && countByRole[role] > 1) {
      issues.push({ type: 'REACT_025', role, message: `Multiple ${role} landmarks found` });
    }
  });
  
  return issues;
}

// Accessibility: REACT_036 - Validate link accessibility
function validateLinkAccessibility(link) {
  const issues = [];
  if (!link) return issues;
  
  const href = link.getAttribute('href');
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  
  if (!href || href === '#' || href === '') {
    issues.push({ type: 'REACT_036', message: 'Link missing or empty href' });
  }
  
  if (!text && !ariaLabel) {
    issues.push({ type: 'REACT_036', message: 'Link missing accessible name' });
  }
  
  return issues;
}

// Accessibility: REACT_036 - Handle fake links
function handleFakeLinks(container) {
  const issues = [];
  if (!container) return issues;
  
  const fakeLinks = container.querySelectorAll('a[href="#"], a[href=""], span[role="button"], div[role="button"]');
  
  fakeLinks.forEach(element => {
    if (element.tagName === 'A') {
      issues.push({ type: 'REACT_036', element: 'a', message: 'Fake link with empty or # href found' });
    } else {
      issues.push({ type: 'REACT_036', element: element.tagName, message: 'Non-link element with button role found' });
    }
  });
  
  return issues;
}

// Accessibility: REACT_037 - Add proper landmark regions
function addProperLandmarkRegions(doc = document) {
  const regions = [];
  if (!doc) return regions;
  
  const body = doc.body;
  if (!body) return regions;
  
  const existingMain = doc.querySelector('main, [role="main"]');
  if (!existingMain) {
    const main = doc.createElement('main');
    main.setAttribute('role', 'main');
    body.appendChild(main);
    regions.push({ type: 'REACT_037', action: 'added', element: 'main' });
  }
  
  const existingNav = doc.querySelector('nav, [role="navigation"]');
  if (!existingNav) {
    const nav = doc.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');
    body.insertBefore(nav, body.firstChild);
    regions.push({ type: 'REACT_037', action: 'added', element: 'navigation' });
  }
  
  return regions;
}

module.exports = {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions
};

module.exports.default = {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions
};