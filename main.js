import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// Implemented validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Check if landmark is an array - validate array elements
  const itemsToValidate = Array.isArray(landmark) ? landmark : [landmark];
  
  for (const item of itemsToValidate) {
    // Validate name
    if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
      errors.push('Landmark must have a valid name');
    }

    // Validate latitude
    if (item.latitude === undefined || item.latitude === null) {
      errors.push('Landmark must have a latitude');
    } else if (typeof item.latitude !== 'number' || isNaN(item.latitude)) {
      errors.push('Landmark latitude must be a number');
    } else if (item.latitude < -90 || item.latitude > 90) {
      errors.push('Landmark latitude must be between -90 and 90');
    }

    // Validate longitude
    if (item.longitude === undefined || item.longitude === null) {
      errors.push('Landmark must have a longitude');
    } else if (typeof item.longitude !== 'number' || isNaN(item.longitude)) {
      errors.push('Landmark longitude must be a number');
    } else if (item.longitude < -180 || item.longitude > 180) {
      errors.push('Landmark longitude must be between -180 and 180');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
  }
  const seen = new Set();
  const result = [];
  landmarksArray.forEach(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    if (seen.has(key)) {
        return;
    }
    seen.add(key);
    result.push(landmark);
  });
  return result;
}

/**
 * Get the language attribute for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

/**
 * Set the language attribute for the HTML element
 * @param {string} lang - The language code to set
 */
function setLanguageAttribute(lang) {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('lang', lang);
}

/**
 * Wrap primary content in a main element with proper landmark
 * @param {string} contentId - The ID of the primary content container
 */
function wrapPrimaryContentInMain(contentId) {
  const content = document.getElementById(contentId);
  if (content && content.tagName !== 'MAIN') {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    mainElement.setAttribute('role', 'main');
    while (content.firstChild) {
      mainElement.appendChild(content.firstChild);
    }
    content.appendChild(mainElement);
  }
}

/**
 * Validate table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} Validation result with valid status and errors
 */
function validateTableAccessibility(table) {
  const errors = [];
  
  if (!table) {
    errors.push('Table element is required');
    return { valid: false, errors };
  }
  
  if (table.tagName !== 'TABLE') {
    errors.push('Element must be a table');
    return { valid: false, errors };
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    errors.push('Table should have a caption for accessibility');
  }
  
  // Check for th elements
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('Table should have header cells (th) for accessibility');
  }
  
  // Check for proper scope attributes on headers
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      errors.push('Header cells should have a scope attribute');
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} Validation result with valid status and errors
 */
function validateTableStructure(table) {
  const errors = [];
  
  if (!table) {
    errors.push('Table element is required');
    return { valid: false, errors };
  }
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    errors.push('Table should have a thead section');
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    errors.push('Table should have a tbody section');
  }
  
  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    errors.push('Table must have at least one row');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate landmark structure
 * @param {HTMLElement} element - The element to validate
 * @returns {Object} Validation result with valid status and errors
 */
function validateLandmarkStructure(element) {
  const errors = [];
  
  if (!element) {
    errors.push('Element is required');
    return { valid: false, errors };
  }
  
  const validLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary', 'form', 'region'];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Check if element has a valid landmark role or is a landmark element
  if (role && !validLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  
  // Check if landmark has accessible name
  const hasName = element.getAttribute('aria-label') || 
                  element.getAttribute('aria-labelledby') || 
                  element.querySelector('h1, h2, h3, h4, h5, h6');
  
  if (!hasName) {
    errors.push('Landmark should have an accessible name');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Add and fix landmark issues
 * @param {HTMLElement} container - The container element to process
 * @returns {Array} List of issues that were fixed
 */
function addFixLandmarkIssues(container) {
  const fixedIssues = [];
  const validLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary', 'form', 'region'];
  
  if (!container) {
    return fixedIssues;
  }
  
  // Find all potential landmark elements
  const landmarkElements = container.querySelectorAll('[role], nav, main, header, footer, aside, form');
  
  landmarkElements.forEach(element => {
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();
    
    // Add role if missing and element is a landmark
    if (!role && ['nav', 'main', 'header', 'footer', 'aside'].includes(tagName)) {
      const defaultRole = tagName === 'header' ? 'banner' : tagName;
      if (validLandmarks.includes(defaultRole)) {
        element.setAttribute('role', defaultRole);
        fixedIssues.push(`Added role="${defaultRole}" to ${tagName} element`);
      }
    }
    
    // Ensure landmark has accessible name
    const hasName = element.getAttribute('aria-label') || 
                    element.getAttribute('aria-labelledby');
    
    if (!hasName && !element.querySelector('h1, h2, h3, h4, h5, h6')) {
      // Add aria-label if no accessible name exists
      if (role) {
        element.setAttribute('aria-label', role.charAt(0).toUpperCase() + role.slice(1) + ' region');
        fixedIssues.push(`Added aria-label to element with role="${role}"`);
      }
    }
  });
  
  return fixedIssues;
}

/**
 * Add proper landmark regions
 * @param {HTMLElement} container - The container element to process
 * @returns {Array} List of landmarks that were processed
 */
function addProperLandmarkRegions(container) {
  const processedLandmarks = [];
  const validLandmarks = {
    'main': 'main',
    'nav': 'navigation',
    'header': 'banner',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  };
  
  if (!container) {
    return processedLandmarks;
  }
  
  // Find all potential landmark elements
  Object.keys(validLandmarks).forEach(tagName => {
    const elements = container.querySelectorAll(tagName);
    elements.forEach(element => {
      const role = element.getAttribute('role');
      // Add role if missing
      if (!role) {
        const defaultRole = validLandmarks[tagName];
        element.setAttribute('role', defaultRole);
        processedLandmarks.push({ element, role: defaultRole });
      }
    });
  });
  
  return processedLandmarks;
}

/**
 * Validate SVG accessibility
 * @param {SVGElement} svg - The SVG element to validate
 * @returns {Object} Validation result with valid status and errors
 */
function validateSvgAccessibility(svg) {
  const errors = [];
  
  if (!svg) {
    errors.push('SVG element is required');
    return { valid: false, errors };
  }
  
  if (svg.tagName !== 'SVG') {
    errors.push('Element must be an SVG');
    return { valid: false, errors };
  }
  
  // Check for accessible name
  const hasName = svg.getAttribute('aria-label') || 
                  svg.getAttribute('aria-labelledby') ||
                  svg.querySelector('title');
  
  if (!hasName) {
    errors.push('SVG should have an accessible name');
  }
  
  // Check for focusable attribute
  const focusable = svg.getAttribute('focusable');
  if (focusable === 'false') {
    errors.push('SVG focusable should be true or removed');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Fix fake link issues
 * @param {HTMLElement} container - The container element to process
 * @returns {Array} List of issues that were fixed
 */
function fixFakeLinks(container) {
  const fixedIssues = [];
  
  if (!container) {
    return fixedIssues;
  }
  
  // Find all links
  const links = container.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check for fake links (javascript:, #, or empty href)
    if (href === 'javascript:;' || href === '#' || href === '') {
      // Check if link has proper role
      if (!link.getAttribute('role') && !link.getAttribute('aria-label')) {
        // Remove role if it's acting as a button but looks like a link
        if (link.getAttribute('href') === '#') {
          link.removeAttribute('href');
          link.setAttribute('role', 'button');
          fixedIssues.push('Fixed fake link by adding role="button"');
        }
      }
    }
  });
  
  return fixedIssues;
}

/**
 * Process unique elements to avoid duplicates
 * @param {Array} elements - Array of elements to process
 * @returns {Array} Array of unique elements
 */
function processUniqueElements(elements) {
  if (!elements || !Array.isArray(elements)) {
    return [];
  }
  
  const seen = new Set();
  return elements.filter(element => {
    const key = element.id || element.className || element.textContent;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Get SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || 
         svg.querySelector('title')?.textContent || 
         svg.id || 
         '';
}

/**
 * Ensure unique landmarks when there's an array structure
 * @param {Array} elements - Array of landmark elements
 * @returns {Array} Processed array with unique landmarks
 */
function ensureLandmarkUniqueness(elements) {
  const validLandmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  
  const elementsById = {};
  
  const result = [];
  
  if (Array.isArray(elements)) {
    elements.forEach(landmark => {
      if (landmark.id) {
        const originalId = landmark.id;
        if (elementsById[originalId]) {
          // Duplicate found, create new id
          let newId = originalId + '_duplicate';
          let counter = 1;
          while (elementsById[newId]) {
            newId = originalId + '_duplicate_' + counter;
            counter++;
          }
          landmark.id = newId;
          elementsById[newId] = true;
          result.push(landmark);
        } else {
          elementsById[originalId] = true;
          result.push(landmark);
        }
      } else {
        result.push(landmark);
      }
    });
  }
  
  return result;
}

/**
 * Check if context is secure
 * @returns {boolean} True if secure context
 */
function isSecureContext() {
  return window.isSecureContext || false;
}

/**
 * Initialize app with accessibility fixes
 * @param {HTMLElement} container - The container to process
 */
function initApp(container) {
  if (!container) {
    return;
  }
  
  // Fix landmark issues
  addFixLandmarkIssues(container);
  
  // Fix fake links
  fixFakeLinks(container);
  
  // Add proper landmark regions
  addProperLandmarkRegions(container);
}

/**
 * Check landmark structure
 * @param {HTMLElement} element - The element to check
 * @returns {Object} Validation result
 */
function landmarkStructureCheck(element) {
  return validateLandmarkStructure(element);
}

/**
 * Add landmark roles to elements
 * @param {HTMLElement} container - The container to process
 * @returns {Array} List of added roles
 */
function addLandmarkRoles(container) {
  return addFixLandmarkIssues(container);
}

/**
 * Render dependency graph
 * @param {HTMLElement} container - The container to render into
 */
function renderDependencyGraph(container) {
  if (!container) {
    return;
  }
  
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Dependency Graph');
  
  // Add visual representation
  const graphElement = document.createElement('div');
  graphElement.className = 'dependency-graph-content';
  container.appendChild(graphElement);
}

/**
 * Render index view
 * @param {HTMLElement} container - The container to render into
 */
function renderIndexView(container) {
  if (!container) {
    return;
  }
  
  // Render index content within the container
  const indexElement = document.createElement('div');
  indexElement.className = 'index-view';
  container.appendChild(indexElement);
}

/**
 * Address insight issues
 * @param {HTMLElement} container - The container to process
 */
function addressInsightIssues(container) {
  if (!container) {
    return;
  }
  
  addFixLandmarkIssues(container);
  fixFakeLinks(container);
  addProperLandmarkRegions(container);
}

/**
 * Calculate sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function calculateSum(a, b) {
  return a + b;
}

/**
 * Count dependencies in a module
 * @param {Object} module - The module object
 * @returns {number} Number of dependencies
 */
function countDependencies(module) {
  if (!module || !module.dependencies) {
    return 0;
  }
  return module.dependencies.length;
}

/**
 * Updated function: ensures landmarks uniqueness when there's an array structure
 * @param {Array} elements - Array of landmark elements
 * @returns {Array} Processed array with unique landmarks
 */
function ensureUniqueLandmarksFromArray(elements) {
  const seen = new Set();
  const result = [];
  
  if (!Array.isArray(elements)) {
    return result;
  }
  
  elements.forEach(element => {
    const key = element.name + '_' + (element.role || 'default');
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    result.push(element);
  });
  
  return result;
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }
  
  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Export functions for testing
export {
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  initApp,
  landmarks,
  appData,
  icons,
  validateLandmark,
  ensureFocusableElements,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  countDependencies,
  getLangAttribute,
  wrapPrimaryContentInMain,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  addFixLandmarkIssues,
  ensureUniqueLandmarksFromArray,
  addProperLandmarkRegions
};

// Initialize the app
if (typeof initializeApp === 'function') {
  try {
    registerSW();
  } catch (e) {
    console.warn('SW registration failed:', e);
  }
  
  // Run initialization
  const container = document.getElementById('root');
  if (container) {
    initApp(container);
  }
}

function ensureFocusableElements(container) {
  if (!container) {
    return [];
  }
  
  const focusableSelectors = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    'contenteditable',
    '[tabindex]:not([tabindex="-1"])'
  ];
  
  const focusableElements = [];
  focusableSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => focusableElements.push(el));
  });
  
  return focusableElements;
}