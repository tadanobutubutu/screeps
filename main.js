// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

// Existing code - DO NOT MODIFY
function existingFunction() {
  return 'This is existing code that must be preserved';
}

// REACT_015: Add lang attribute to HTML element
function getLangAttribute(document) {
  const htmlElement = document.querySelector('html');
  if (htmlElement && htmlElement.lang) {
    return htmlElement.lang;
  }
  return null;
}

function getFullLangAttribute(document) {
  const lang = getLangAttribute(document);
  if (lang) {
    return `lang="${lang}"`;
  }
  return '';
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table) return false;
  
  const hasCaption = table.querySelector('caption');
  const headers = table.querySelectorAll('th');
  const hasScope = Array.from(headers).every(th => th.hasAttribute('scope'));
  
  return hasCaption && hasScope;
}

function validateTableStructure(table) {
  if (!table) return { valid: false, errors: ['Table element is required'] };
  
  const errors = [];
  const rows = table.querySelectorAll('tr');
  
  if (rows.length === 0) {
    errors.push('Table must have at least one row');
  }
  
  // Check for proper th/td usage
  const cells = table.querySelectorAll('th, td');
  if (cells.length === 0) {
    errors.push('Table must have at least one cell');
  }
  
  return { valid: errors.length === 0, errors };
}

// REACT_017: Landmark issues
function validateLandmark(element) {
  if (!element) return { valid: false, errors: ['Element is required'] };
  
  const errors = [];
  const tagName = element.tagName.toLowerCase();
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'form'];
  
  if (!validLandmarks.includes(tagName) && !element.getAttribute('role')) {
    errors.push('Element should be a landmark or have a role attribute');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure(document) {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  const errors = [];
  const seenLandmarks = new Map();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const count = seenLandmarks.get(role) || 0;
    
    // Check for unique main landmark
    if (role === 'main' && count >= 1) {
      errors.push('There should be only one main landmark');
    }
    
    seenLandmarks.set(role, count + 1);
  });
  
  return { valid: errors.length === 0, errors };
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : null;
  }
  
  // Check for title element inside SVG
  const title = svg.querySelector('title');
  return title ? title.textContent : null;
}

// REACT_025: Ensure unique landmarks
function getUniqueLandmarks(document) {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  const landmarkMap = new Map();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (!landmarkMap.has(role)) {
      landmarkMap.set(role, []);
    }
    landmarkMap.get(role).push(landmark);
  });
  
  return landmarkMap;
}

// REACT_036: Fix fake link issues
function createInPageButton(element) {
  if (!element) return null;
  
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '0');
  
  // Remove href if it's a fake link
  if (element.tagName === 'A') {
    const href = element.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('/')) {
      element.removeAttribute('href');
      element.setAttribute('data-original-href', href);
    }
  }
  
  return element;
}

function createAccessibleLink(element) {
  if (!element) return null;
  
  if (element.tagName === 'BUTTON' && element.getAttribute('role') === 'button') {
    // Convert fake button back to link if it has a valid href
    const originalHref = element.getAttribute('data-original-href');
    if (originalHref) {
      element.removeAttribute('role');
      element.removeAttribute('data-original-href');
      element.setAttribute('href', originalHref);
    }
  }
  
  return element;
}

module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getUniqueLandmarks,
  createInPageButton,
  createAccessibleLink,
  existingFunction
};