import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-swift';

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

// Added back required exports

function landmarkStructureCheck(landmark) {
  if (!landmark) {
    return false;
  }
  return landmark.name && landmark.latitude !== undefined && landmark.longitude !== undefined;
}

function setLanguageAttribute(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang);
  }
}

function addLandmarkRoles(element, role) {
  if (element && role) {
    element.setAttribute('role', role);
  }
  return element;
}

function fixFakeLinks(element) {
  if (element && element.tagName === 'A' && !element.hasAttribute('href')) {
    element.setAttribute('role', 'button');
  }
  return element;
}

function isSecureContext() {
  if (typeof window !== 'undefined' && window.isSecureContext !== undefined) {
    return window.isSecureContext;
  }
  return false;
}

function initApp() {
  initializeApp();
}

function ensureFocusableElements(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }
  return elements.filter(el => el && (el.tabIndex >= 0 || el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT'));
}

function renderDependencyGraphContent(graphData) {
  if (!graphData) {
    return '';
  }
  return JSON.stringify(graphData);
}

function validateSvgAccessibility(svgElement) {
  if (!svgElement) {
    return { valid: false, errors: ['SVG element is required'] };
  }
  const errors = [];
  if (!svgElement.getAttribute('role')) {
    errors.push('SVG must have a role attribute');
  }
  if (!svgElement.getAttribute('aria-label') && !svgElement.getAttribute('aria-labelledby')) {
    errors.push('SVG must have an accessible name');
  }
  return { valid: errors.length === 0, errors };
}

function processUniqueElements(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }
  const seen = new Set();
  return elements.filter(el => {
    const key = el.id || el.name || JSON.stringify(el);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function addressInsightIssues(insights) {
  if (!Array.isArray(insights)) {
    return [];
  }
  return insights.map(insight => ({
    ...insight,
    addressed: true
  }));
}

function renderDependencyGraph(graph) {
  if (!graph) {
    return null;
  }
  return { rendered: true, graph };
}

function renderIndexView(data) {
  if (!data) {
    return null;
  }
  return { rendered: true, data };
}

function calculateSum(a, b) {
  return a + b;
}

function addProperLandmarkRegions(element) {
  if (element && !element.getAttribute('role')) {
    element.setAttribute('role', 'region');
  }
  return element;
}

function countDependencies(graph) {
  if (!graph || !graph.nodes || !graph.edges) {
    return 0;
  }
  return graph.edges.length;
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
  countDependencies
};