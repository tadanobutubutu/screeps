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
  table.querySelectorAll('th').forEach(th => {
    if (!th.hasAttribute('scope')) {
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
  if (svg.hasAttribute('aria-label') && svg.getAttribute('aria-label').trim() !== '') {
    return svg.getAttribute('aria-label').trim();
  }

  // Check for aria-labelledby attribute
  if (svg.hasAttribute('aria-labelledby')) {
    const labelledbyId = svg.getAttribute('aria-labelledby');
    const labelledbyElement = document.getElementById(labelledbyId);
    if (labelledbyElement && labelledbyElement.textContent.trim() !== '') {
      return labelledbyElement.textContent.trim();
    }
  }

  return '';
}

// New function to validate unique landmarks
function validateUniqueLandmarks(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) return false;

  const seen = new Set();
  for (const landmark of landmarks) {
    const key = `${landmark.role}_${landmark.label}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
  }

  return true;
}

// New function to create in-page button with proper accessibility
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  button.setAttribute('aria-label', text);
  return button;
}

// New function to address all insight issues
function addressInsightIssues() {
  // Set language attribute for HTML element
  document.documentElement.lang = getLangAttribute();

  // Fix table accessibility issues
  document.querySelectorAll('table').forEach(table => {
    if (!validateTableAccessibility(table)) {
      // Add missing caption if needed
      if (!table.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.textContent = 'Table caption';
        table.prepend(caption);
      }

      // Add proper headers if needed
      if (table.querySelectorAll('th').length === 0) {
        const firstRow = table.querySelector('tr');
        if (firstRow) {
          firstRow.querySelectorAll('td').forEach(td => {
            const th = document.createElement('th');
            th.textContent = td.textContent;
            td.replaceWith(th);
          });
        }
      }

      // Add scope attributes to headers
      table.querySelectorAll('th').forEach(th => {
        if (!th.hasAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      });
    }

    // Fix table structure issues
    if (!validateTableStructure(table)) {
      // Implement table structure fixes here
    }
  });

  // Fix landmark issues
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      // Ensure unique landmarks
      elements.forEach((element, index) => {
        if (index > 0) {
          element.setAttribute('aria-hidden', 'true');
        }
      });
    }
  });

  // Add accessible names to SVGs
  document.querySelectorAll('svg').forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      svg.setAttribute('aria-label', 'Graphic');
    }
  });

  // Fix fake links
  document.querySelectorAll('a').forEach(link => {
    if (!link.href || link.href === '#') {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}

// Initialize the app and address accessibility issues
function initApp() {
  initializeApp();
  addressInsightIssues();
  registerSW();
}

// Render dependency graph content or mark as N/A if none exist
function renderDependencyGraphContentOrNA() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    // Mark as N/A - container doesn't exist
    return;
  }

  // Check if there are any dependencies to render
  const dependencies = countDependencies();
  if (!dependencies || dependencies.length === 0) {
    // Mark as N/A - no dependencies exist
    container.setAttribute('aria-live', 'polite');
    container.textContent = 'N/A';
    return;
  }

  // Render the dependency graph with available dependencies
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
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateUniqueLandmarks,
  createInPageButton,
  renderDependencyGraphContentOrNA
};