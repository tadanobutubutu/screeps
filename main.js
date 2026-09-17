const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = main;

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// Implement the new function as per the issue requirements
function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  if (typeof inputData === 'string') {
    let result = trimWhitespace ? inputData.trim() : inputData;
    result = uppercase ? result.toUpperCase() : result;
    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }
    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map(item => transformInputData(item, options));
  }

  if (typeof inputData === 'object' && inputData !== null) {
    const result = {};
    for (const [key, value] of Object.entries(inputData)) {
      let newKey = preserveKeys ? key : key.trim();
      newKey = uppercase ? newKey.toUpperCase() : newKey;
      result[newKey] = transformInputData(value, options);
    }
    return result;
  }

  return inputData;
}

// Additional utility functions for accessibility
function getLangAttribute(document) {
  // Implementation for REACT_015: Add lang attribute to HTML element
  if (!document || !document.documentElement) {
    return null;
  }
  
  const htmlElement = document.documentElement;
  const currentLang = htmlElement.getAttribute('lang');
  
  if (!currentLang) {
    // Default to 'en' if no lang attribute is present
    htmlElement.setAttribute('lang', 'en');
    return 'en';
  }
  
  return currentLang;
}

function personName(element) {
  // Implementation for accessibility issues for REACT_036: Fix 1 fake link issue
  if (!element) {
    return null;
  }
  
  // Check if element is an anchor with href
  if (element.tagName === 'A' && element.getAttribute('href')) {
    // This is a real link, return the accessible name
    return element.textContent.trim() || element.getAttribute('aria-label') || element.getAttribute('title') || 'Link';
  }
  
  // Check if element is a fake link (clickable element without href)
  if (element.tagName === 'BUTTON' || (element.tagName === 'A' && !element.getAttribute('href'))) {
    // For fake links, ensure proper accessible name
    return element.textContent.trim() || element.getAttribute('aria-label') || element.getAttribute('title') || 'Button';
  }
  
  return element.textContent?.trim() || null;
}

function getSvgAccessibleName(svgElement) {
  // Implementation for REACT_041: Add accessible names to 2 SVGs
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return null;
  }
  
  // Check for aria-label or aria-labelledby
  let accessibleName = svgElement.getAttribute('aria-label');
  
  if (!accessibleName) {
    const labelledBy = svgElement.getAttribute('aria-labelledby');
    if (labelledBy) {
      // In a real implementation, would look up the referenced element
      accessibleName = `Referenced by: ${labelledBy}`;
    }
  }
  
  // Check for title child element
  if (!accessibleName) {
    const titleElement = svgElement.querySelector('title');
    if (titleElement) {
      accessibleName = titleElement.textContent.trim();
    }
  }
  
  // If still no accessible name, add a default one for icons
  if (!accessibleName && svgElement.getAttribute('role') === 'img') {
    const id = svgElement.getAttribute('id') || 'svg-icon';
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `Icon: ${id}`;
    svgElement.insertBefore(title, svgElement.firstChild);
    accessibleName = title.textContent;
  }
  
  return accessibleName;
}

function validateTableAccessibility(tableElement) {
  // Implementation for REACT_027: Fix 26 table structure issues
  if (!tableElement) {
    return { valid: false, errors: ['Table element is required'] };
  }
  
  const errors = [];
  const headers = tableElement.querySelectorAll('th');
  const dataCells = tableElement.querySelectorAll('td');
  
  // Check if table has header cells
  if (headers.length === 0) {
    errors.push('Table should have header cells (th) for accessibility');
  }
  
  // Check if headers have scope attribute
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Header at index ${index} missing scope attribute`);
    }
  });
  
  // Check if data cells have headers attribute when in complex tables
  dataCells.forEach((td, index) => {
    if (!td.hasAttribute('headers') && headers.length > 0) {
      errors.push(`Data cell at index ${index} should have headers attribute for proper association`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    headerCount: headers.length,
    dataCellCount: dataCells.length
  };
}

// Function to validate a landmark element in the DOM
const validateLandmark = (landmarkElement) => {
  if (landmarkElement == null) {
    return { valid: false, message: 'Landmark element is missing or not provided' };
  }

  const tagName = landmarkElement.tagName;
  const validLandmarks = ['HEADER', 'NAV', 'MAIN', 'FOOTER', 'ARTICLE', 'SECTION', 'ASIDE'];
  const isValidLandmark = validLandmarks.includes(tagName);

  if (!isValidLandmark) {
    return { valid: false, message: `Invalid landmark element: ${tagName}` };
  }

  const hasAccessibleName = landmarkElement.hasAttribute('aria-label') ||
                            landmarkElement.hasAttribute('aria-labelledby') ||
                            landmarkElement.hasAttribute('title');

  if (!hasAccessibleName) {
    return { valid: false, message: 'Landmark element is missing an accessible name' };
  }

  return { valid: true, message: 'Landmark element is valid' };
};

module.exports = {
  renderHeader,
  renderFooter,
  main,
  addressAccessibilityIssues,
  validateLandmark
};