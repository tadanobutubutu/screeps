// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

let uniqueLandmarks = {};

function toRad(deg) {
  return deg * (Math.PI / 180);
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
    return landmark.id || landmark.name || landmark.ariaLabel;
  });
}

// Function for ensuring unique landmarks
function ensureUniqueLandmarks(insightReport) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;

    const identifier = landmark.id || landmark.name || landmark.ariaLabel;

    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// Function for adding an id and aria-label to an element
function addIdAndAriaLabel(element, id, ariaLabel) {
  if (!element) return;

  element.id = id;
  element.setAttribute('aria-label', ariaLabel);
}

// Address accessibility issues
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('.dependency-graph, [data-dependency-graph]') ||
    document.querySelector('.dependencyGraph') ||
    document.querySelector('[data-testid="dependency-graph"]') ||
    document.querySelector('div[data-testid=dependency-graph]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  // New accessibility functions
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
  }

  function ensureUniqueLandmarks(insightReport) {
    const landmarks = [];

    insightReport.issues.forEach(issue => {
      if (!issue.ariaRole) return;
      landmarks.push(issue.ariaRole);
    });

    // Check if all landmarks exist, re-add if necessary
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      if (elements.length < landmarks.length) {
        const uniqueLandmarkMap = {};

        landmarks.forEach(uniqueLandmark => {
          let element = elements.filter(el => el.getAttribute('role') === uniqueLandmark);
          if (!element[0]) {
            element = document.createElement('div');
            addIdAndAriaLabel(element, uniqueLandmark, uniqueLandmark);
            if (!document.querySelector(`#${uniqueLandmark}`)) {
              document.body.appendChild(element);
            }
            uniqueLandmarkMap[uniqueLandmark] = element;
          }
        });
        uniqueLandmarks = uniqueLandmarkMap;
      }

      // Refresh landmarks for existing elements
      elements.forEach(el => {
        addIdAndAriaLabel(el, el.getAttribute('role'), el.getAttribute('role'));
      });
    });
  }
}

// New function to render dependency graphs
function renderDependencyGraph(moduleName, data) {
  // Placeholder for actual implementation
  console.log(`Rendering dependency graph for module: ${moduleName}`);
  // Assume some logic here to actually render the graph based on the data received
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
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  renderDependencyGraph,
  displayModuleStructure,
  newFunction,
  addIdAndAriaLabel
};