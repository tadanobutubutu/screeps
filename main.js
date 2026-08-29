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

function addressAccessibilityIssues() {
  const dependencyGraph = document.querySelector('.依赖图 visualization, [data-dependency-graph]')
    || document.querySelector('.依赖图')
    || document.querySelector('[data-testid="dependency-graph"]')
    || document.querySelector('div[data-testid=dependency-graph]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  improveAccessibility();
}

function improveAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', button.textContent || 'Button');
    }
  });

  const focusable = document.querySelectorAll('[role="link"]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });

  // Handle landmarks from insightReport if available
  if (typeof insightReport !== 'undefined' && insightReport.issues) {
    const landmarks = [...new Set(insightReport.issues.flatMap(issue => issue.ariaRole))];

    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      if (elements.length === 0) {
        const element = document.createElement('div');
        element.setAttribute('role', landmark);
        if (!document.querySelector(`#${landmark}`)) {
          element.setAttribute('id', landmark);
        }
        document.body.appendChild(element);
      }
    });
  }

  // Handle custom element landmarks
  const customLandmarks = document.querySelectorAll('[CustomElementId], [my-custom-element]');
  const uniqueLandmarkMap = { ...uniqueLandmarks };

  customLandmarks.forEach(landmark => {
    const id = landmark.id || landmark.getAttribute('CustomElementId');
    if (id) {
      uniqueLandmarkMap[id] = landmark;
    }
  });

  uniqueLandmarks = uniqueLandmarkMap;
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
  calculateDistance,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  addressAccessibilityIssues,
  improveAccessibility,
  renderDependencyGraph,
  displayModuleStructure,
  newFunction
};