// TODO: This is the existing code that needs to be preserved; add new functions to ensure elements have an id, add aria-label, and render dependency graphs

const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

let uniqueLandmarks = {};

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Function for calculating distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Function for checking landmark elements
function checkLandmarkElements(landmarks) {
  if (!Array.isArray(landmarks)) {
    return false;
  }
  
  if (landmarks.length === 0) {
    return false;
  }
  
  return landmarks.every(landmark => {
    if (!landmark) return false;
    return landmark.id || landmark.name;
  });
}

// Function for ensuring unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name;
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// Address accessibility issues
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('[data-dependency-graph]') ||
    document.querySelector('.dependency-graph') ||
    document.getElementById('dependency-graph') ||
    document.querySelector('[role="region"]');
  
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  function improveAccessibility() {
    const buttons = dependencyGraph ? dependencyGraph.querySelectorAll('button') : document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent || 'Button');
      }
    });

    const focusable = dependencyGraph ? dependencyGraph.querySelectorAll('a, button, input, select, textarea, [tabindex]') : document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  const landmarks = [...document.querySelectorAll('[data-issue]')].filter(issue => issue.ariaRole);

  // Check if all landmarks exist, re-add if necessary
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark.ariaRole}"]`);
    if (elements.length < landmarks.length) {
      const uniqueLandmarkMap = {};

      Object.keys(landmark).forEach(uniqueLandmark => {
        let element = elements.filter(el => el.getAttribute('role') === uniqueLandmark);
        if (!element[0]) {
          element = document.querySelectorAll(`[name="${uniqueLandmark}"]`);
          element[0].setAttribute('role', uniqueLandmark);
          if (!element[0].getAttribute('id')) {
            const id = uniqueLandmark;
            element[0].setAttribute('id', id);
          }
        }
        uniqueLandmarkMap[uniqueLandmark] = element[0];
      });
      uniqueLandmarks = uniqueLandmarkMap;
    }
  });

  return improveAccessibility();
}

// Function to ensure elements have unique IDs
function ensureElementHasId(element, prefix = 'element') {
  if (!element) return null;
  
  let id = element.getAttribute('id');
  if (!id) {
    id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    element.setAttribute('id', id);
  }
  return id;
}

// Function to add aria-label to elements that need it
function addAriaLabel(element, label) {
  if (!element) return false;
  
  const existingLabel = element.getAttribute('aria-label');
  if (!existingLabel) {
    element.setAttribute('aria-label', label);
    return true;
  }
  return false;
}

// New function to render dependency graphs
function renderDependencyGraph(moduleName) {
  // Placeholder for actual implementation
  console.log(`Rendering dependency graph for module: ${moduleName}`);
  // Assume some logic here to actually render the graph
}

// New function to display module structure
function displayModuleStructure(moduleName) {
  // Placeholder for actual implementation
  console.log(`Displaying module structure for module: ${moduleName}`);
  // Assume some logic here to actually display the structure
}

// TODO: This is the new function request
function newFunction() {
  // Implement the new function here
  console.log("New Function has been called!");
}

// Export functions for testing
module.exports = {
  toRad,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  renderDependencyGraph,
  displayModuleStructure,
  newFunction
};