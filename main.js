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
        if (elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// New function to add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

// New function to fix table structure issues
function fixTableStructure(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  // Ensure table has proper structure
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length === 0) {
      row.remove();
    }
  });

  // Add proper headers if missing
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const cells = firstRow.querySelectorAll('td');
      cells.forEach(cell => {
        cell.outerHTML = `<th>${cell.textContent}</th>`;
      });
    }
  }
}

// New function to validate table accessibility
function validateTableAccessibility(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return { valid: false, errors: ['Table not found'] };

  const errors = [];
  const rows = table.querySelectorAll('tr');

  // Check for proper headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('Table missing header cells');
  }

  // Check row consistency
  const columnCount = headers.length;
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length !== columnCount) {
      errors.push('Inconsistent number of columns in table rows');
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// New function to validate table structure
function validateTableStructure(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return { valid: false, errors: ['Table not found'] };

  const errors = [];
  const rows = table.querySelectorAll('tr');

  // Check for empty rows
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length === 0) {
      errors.push('Empty table row found');
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// New function to add landmark roles
function addLandmarkRoles() {
  const landmarkRoles = {
    'main': 'main',
    'navigation': 'navigation',
    'search': 'search',
    'contentinfo': 'contentinfo',
    'complementary': 'complementary',
    'form': 'form',
    'region': 'region'
  };

  Object.entries(landmarkRoles).forEach(([id, role]) => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute('role', role);
    }
  });
}

// New function to validate landmark structure
function validateLandmarkStructure() {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const errors = [];

  landmarks.forEach(landmarkId => {
    const element = document.getElementById(landmarkId);
    if (!element) {
      errors.push(`Missing landmark element: ${landmarkId}`);
    } else if (!element.getAttribute('role')) {
      errors.push(`Landmark element ${landmarkId} missing role attribute`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// New function to add accessible names to SVGs
function addSvgAccessibleName(svgId, name) {
  const svg = document.getElementById(svgId);
  if (svg) {
    svg.setAttribute('aria-label', name);
    svg.setAttribute('role', 'img');
  }
}

// New function to get SVG accessible name
function getSvgAccessibleName(svgId) {
  const svg = document.getElementById(svgId);
  if (svg) {
    return svg.getAttribute('aria-label') || '';
  }
  return '';
}

// New function to fix fake link issues
function fixFakeLinkIssue(linkId) {
  const link = document.getElementById(linkId);
  if (link && !link.getAttribute('href')) {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  }
}

// New function to create in-page button
function createInPageButton(id, text, onClick) {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

// New function to address insight issues
function addressInsightIssues() {
  // Add lang attribute
  addLangAttribute();

  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    fixTableStructure(table.id);
  });

  // Add landmark roles
  addLandmarkRoles();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    addSvgAccessibleName(svg.id, `SVG ${index + 1}`);
  });

  // Fix fake links
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    fixFakeLinkIssue(link.id);
  });
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
  addLangAttribute,
  fixTableStructure,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  addSvgAccessibleName,
  getSvgAccessibleName,
  fixFakeLinkIssue,
  createInPageButton
};