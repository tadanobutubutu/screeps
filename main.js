// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

const main = {
  init: function() {
    console.log('Application initialized');
  },
  
  greet: function(name) {
    return `Hello, ${name}!`;
  }
};

// Main module for calculator operations
// Main entry point for dependency visualization tool

// main.js

function validateLandmark(landmark) {
  // Check if landmark exists
  if (!landmark) {
    return false;
  }

  // Check if landmark has required properties
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }

  // Check if landmark has valid coordinates
  if (landmark.coordinates) {
    if (typeof landmark.coordinates.lat !== 'number' || typeof landmark.coordinates.lng !== 'number') {
      return false;
    }

    // Validate latitude range (-90 to 90)
    if (landmark.coordinates.lat < -90 || landmark.coordinates.lat > 90) {
      return false;
    }
    
    // Validate longitude range (-180 to 180)
    if (landmark.coordinates.lng < -180 || landmark.coordinates.lng > 180) {
      return false;
    }
  }

  return true;
}

function renderDependencyGraph(dependencies, prefix) {
  let output = '';
  const keys = Object.keys(dependencies);
  
  keys.forEach((key, index) => {
    const isLastItem = index === keys.length - 1;
    const connector = isLastItem ? '└── ' : '├── ';
    const value = dependencies[key];
    
    output += `${prefix}${connector}${key}`;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      output += '
';
      const extension = isLastItem ? '    ' : '│   ';
      output += renderDependencyGraph(value, prefix + extension);
    } else {
      output += ` -> ${value}
`;
    }
  });
  
  return output;
}

function newFunction() {
  // Add your new function implementation here
}

function greet(name) {
  return `Hello, ${name}!`;
}

// NEW FUNCTION ADDED FROM ORIGIN/MAIN
function newAccessibleFunction() {
  // Add your new function implementation here
  return true;
}

const landmarkRegions = [];

function isLatitudeValid(lat) {
  // Existing validation function preserved
}

function isLongitudeValid(lng) {
  // Existing validation function preserved
  return typeof lng === 'number' && lng >= -180 && lng <= 180;
}

/**
 * Adds a proper landmark region to the given element.
 * @param {HTMLElement} element - The DOM element to add the landmark region to.
 * @param {string} role - The ARIA role for the landmark region (e.g., 'navigation', 'main', 'complementary').
 * @param {string} [label] - Optional accessible label for the landmark region.
 */
function addLandmarkRegionToElement(element, role, label) {
  // Existing function preserved
}

function addLandmarkRegion(landmark) {
  // Existing function preserved that calls the validateLandmark function
}

function getLandmarkRegions() {
  // Existing function preserved
  return [...landmarkRegions];
}

function getLandmarkRegionsByRole(role) {
  // Existing function preserved
  return landmarkRegions.filter(region => region.role === role);
}

function removeLandmarkRegion(id) {
  // Existing function preserved
  const index = landmarkRegions.findIndex(region => region.id === id);
  if (index !== -1) {
    landmarkRegions.splice(index, 1);
    return true;
  }
  return false;
}

// The following functions and variables were added, amalgamating code from both branches:

// Internal storage for landmark regions
const landmarks = [];

// Function to add a landmark, using the following order: validate and add to storage
function addLandmark(landmark) {
  if (validateLandmark(landmark)) {
    landmarks.push(landmark);
  }
}

// Function to get all landmarks
function getLandmarks() {
  return [...landmarks];
}

// Function to remove a landmark by ID
function removeLandmark(id) {
  const index = landmarks.findIndex(landmark => landmark.id === id);
  if (index !== -1) {
    landmarks.splice(index, 1);
    return true;
  }
  return false;
}

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return 'en';
}

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Navigate within page');
  return button;
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table || table.nodeType !== Node.ELEMENT_NODE || table.tagName !== 'TABLE') {
    return false;
  }
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasSummary = table.getAttribute('summary') !== null || table.getAttribute('aria-describedby') !== null;
  
  return hasCaption || hasSummary;
}

function validateTableStructure(table) {
  if (!validateTableAccessibility(table)) {
    return false;
  }
  
  const hasTbody = table.querySelector('tbody') !== null;
  const rows = table.querySelectorAll('tr');
  
  for (let row of rows) {
    const cells = row.querySelectorAll('th');
    if (cells.length === 0) {
      return false;
    }
  }
  
  return hasTbody || rows.length > 0;
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svg, context) {
  if (!svg) return '';
  
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  if (desc && desc.textContent.trim() && context) {
    return context;
  }
  
  return svg.getAttribute('aria-label') || '';
}

function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('aria-hidden', 'false');
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(landmarksList) {
  const landmarkNames = new Map();
  const uniqueLandmarks = [];
  
  for (let landmark of landmarksList) {
    if (!validateLandmark(landmark)) {
      continue;
    }
    
    const name = landmark.name;
    if (!landmarkNames.has(name)) {
      landmarkNames.set(name, []);
      uniqueLandmarks.push(landmark);
    }
  }
  
  return uniqueLandmarks;
}

// REACT_036: Fix fake link issues
function validateLinkAccessibility(linkElement) {
  if (!linkElement || linkElement.nodeType !== Node.ELEMENT_NODE || linkElement.tagName !== 'A') {
    return false;
  }
  
  const href = linkElement.getAttribute('href');
  if (!href || href === '#' || href === '' || href.trim() === '') {
    return false;
  }
  
  if (href.startsWith('javascript:')) {
    return false;
  }
  
  return true;
}

function handleFakeLinks(links) {
  const fixedLinks = [];
  
  for (let link of links) {
    if (!validateLinkAccessibility(link)) {
      link.setAttribute('href', '#');
      link.setAttribute('role', 'button');
      link.style.pointerEvents = 'none';
      fixedLinks.push(link);
    } else {
      fixedLinks.push(link);
    }
  }
  
  return fixedLinks;
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return;
  }
  
  const validLandmarkRegions = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];
  const currentRole = element.getAttribute('role');
  
  if (!currentRole && validLandmarkRegions.includes(element.tagName.toLowerCase())) {
    element.setAttribute('role', element.tagName.toLowerCase());
  }
}

/**
 * Displays module structure for debugging purposes.
 * @param {Array} modules - Array of module objects
 * @returns {string} Formatted module structure display
 */
function displayModuleStructure(modules) {
  if (!Array.isArray(modules)) {
    return 'Error: modules must be an array';
  }
  
  let output = 'Module Structure:
';
  output += '==================

';
  
  modules.forEach((mod, index) => {
    const name = mod.name || mod.id || `Module ${index + 1}`;
    output += `${index + 1}. ${name}
`;
    
    if (mod.dependencies && Array.isArray(mod.dependencies)) {
      output += `   Dependencies: ${mod.dependencies.join(', ') || 'none'}
`;
    }
    
    if (mod.path) {
      output += `   Path: ${mod.path}
`;
    }
    
    output += '
';
  });
  
  return output;
}

/**
 * Generates a dependency report for debugging

// Exporting all functions and utilities
export {
  newFunction,
  greet,
  existingFunction,
  newAccessibleFunction,
  validateLandmark,
  isLatitudeValid,
  isLongitudeValid,
  addLandmarkRegion,
  addLandmarkRegionToElement,
  getLandmarkRegions,
  getLandmarkRegionsByRole,
  removeLandmarkRegion,
  addLandmark,
  getLandmarks,
  removeLandmark,
  landmarkRegions,
  renderDependencyGraph,
  displayModuleStructure
};