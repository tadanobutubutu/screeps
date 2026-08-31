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

  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
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
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// ... (previous and updated code remains as it is)

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (!elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

/**
 * Get the language attribute for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
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
 * Get SVG accessible name
 *