// TODO: Add back any required exports that might have been removed.
// Existing code starts here
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
      return [];
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
        if (elementsById[landmark.id]) {
          elementsById[landmark.id + '_duplicate'] = true;
        } else {
          elementsById[landmark.id] = true;
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// New function to check landmark structure
function landmarkStructureCheck(landmark) {
  if (!landmark) return false;
  const validRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  return validRoles.includes(landmark.role);
}

// New function to set language attribute
function setLanguageAttribute(lang) {
  if (lang && typeof lang === 'string') {
    document.documentElement.lang = lang;
    return true;
  }
  return false;
}

// New function to add landmark roles
function addLandmarkRoles(container) {
  if (!container) return;
  const landmarks = container.querySelectorAll('[role="landmark"], section, nav, aside, main, footer, header');
  landmarks.forEach(el => {
    if (!el.getAttribute('role')) {
      el.setAttribute('role', 'region');
    }
  });
}

// New function to fix fake links
function fixFakeLinks(container) {
  if (!container) return;
  const links = container.querySelectorAll('a[href="#"], a:not([href])');
  links.forEach(link => {
    if (!link.href || link.href === '#') {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}

// New function to check if in secure context
function isSecureContext() {
  return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

// New function to ensure focusable elements
function ensureFocusableElements(container) {
  if (!container) return;
  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const elements = container.querySelectorAll(focusableSelectors);
  return Array.from(elements);
}

// New function to validate SVG accessibility
function validateSvgAccessibility(svg) {
  if (!svg) return false;
  const accessibleName = getSvgAccessibleName(svg);
  return accessibleName !== '';
}

// New function to process unique elements
function processUniqueElements(elements) {
  if (!elements || !Array.isArray(elements)) return [];
  const seen = new Set();
  return elements.filter(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// New function to render dependency graph
function renderDependencyGraph(container) {
  if (!container) return;
  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', 'Dependency graph');
  container.appendChild(graphContainer);
}

// New function to render index view
function renderIndexView(container) {
  if (!container) return;
  const indexContainer = document.createElement('div');
  indexContainer.setAttribute('role', 'navigation');
  indexContainer.setAttribute('aria-label', 'Index');
  container.appendChild(indexContainer);
}

// New function to calculate sum
function calculateSum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// New function to add proper landmark regions
function addProperLandmarkRegions(container) {
  if (!container) return;
  const validRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const elements = container.querySelectorAll('[role]');
  elements.forEach(el => {
    const role = el.getAttribute('role');
    if (validRoles.includes(role)) {
      if (!el.id) {
        el.id = role + '_landmark';
      }
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', role);
      }
    }
  });
}

// New function to count dependencies
function countDependencies(module) {
  if (!module || !module.dependencies) return 0;
  return module.dependencies.length;
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

// New function to get language attribute for HTML element
function getLangAttribute() {
  // Default to English if not specified
  return document.documentElement.lang || 'en';
}

// New function to validate table accessibility
function validateTableAccessibility(table) {
  if (!table) return false;

  // Check if table has a caption
  const hasCaption = table.querySelector('caption') !== null;

  // Check if table has proper headers
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;

  // Check if table cells have proper scope attributes
  let hasScopeAttributes = true;
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      hasScopeAttributes = false;
    }
  });

  return hasCaption && hasHeaders && hasScopeAttributes;
}

// New function to validate table structure
function validateTableStructure(table) {
  if (!table) return false;

  // Check if table has proper row and column structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) return false;

  // Check if all rows have the same number of cells
  const cellCount = rows[0].cells.length;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].cells.length !== cellCount) {
      return false;
    }
  }

  return true;
}

// New function to validate landmark structure
function validateLandmarkStructure(landmark) {
  if (!landmark) return false;

  // Check if landmark has proper role
  const validRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  if (!validRoles.includes(landmark.role)) {
    return false;
  }

  // Check if landmark has proper label
  if (!landmark.label || typeof landmark.label !== 'string' || landmark.label.trim() === '') {
    return false;
  }

  return true;
}

// New function to get accessible name for SVG
function getSvgAccessibleName(svg) {
  if (!svg) return '';

  // Check for title element
  const title = svg.querySelector('title');
  if (title && title.textContent.trim() !== '') {
    return title.textContent.trim();
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel !== '') {
    return ariaLabel;
  }

  // Check for aria-labelledby attribute
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledbyId = ariaLabelledby.trim();
    const labelledbyElement = document.getElementById(labelledbyId);
    if (labelledbyElement && labelledbyElement.textContent.trim() !== '') {