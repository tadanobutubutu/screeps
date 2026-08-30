// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};
let uniqueLandmarks = {};

function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('[data-dependency-graph]') ||
    document.querySelector('.dependency-graph') ||
    document.querySelector('#dependency-graph') ||
    document.querySelector('div[data-type="dependency-graph"]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    if (!dependencyGraph.getAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }

  // New accessibility functions
  function improveAccessibility() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent || 'Button');
      }
    });

    const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  function ensureUniqueLandmarks() {
    const landmarks = [...new Set(['navigation', 'main', 'complementary', 'banner', 'contentinfo'])];
    const landmarkRoles = ['navigation', 'main', 'complementary', 'banner', 'contentinfo', 'search', 'form'];

    // Check if all landmarks exist, re-add if necessary
    landmarks.forEach(uniqueLandmark => {
      const elements = document.querySelectorAll(`[role="${uniqueLandmark}"]`);
      if (elements.length < landmarks.length) {
        const uniqueLandmarkMap = {};

        landmarkRoles.forEach(uniqueLandmark => {
          let element = elements.filter(el => el.getAttribute('role') === uniqueLandmark);
          if (!element[0]) {
            element = document.createElement('div');
            element.setAttribute('role', uniqueLandmark);
            if (uniqueLandmark === 'main' || uniqueLandmark === 'navigation') {
              const id = uniqueLandmark;
              element.setAttribute('id', id);
            }
            document.body.appendChild(element);
          }
          uniqueLandmarkMap[uniqueLandmark] = element[0];
        });
        uniqueLandmarks = uniqueLandmarkMap;
      }
    });
  }
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

// Helper functions for calculations (commonly needed utilities)
function toRad(deg) {
  return deg * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  renderDependencyGraph,
  displayModuleStructure,
  newFunction,
  addressAccessibilityIssues
};