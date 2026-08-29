const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

let uniqueLandmarks = {};

function toRad(deg) {
  return deg * (Math.PI / 180);
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Set();
  return landmarks.filter(landmark => {
    const key = landmark.id || landmark.name;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

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

  return null;
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

  const uniqueLandmarks = [];
  const landmarks = document.querySelectorAll('[CustomElementId], [my-custom-element]');
  landmarks.forEach(landmark => {
    if (uniqueLandmarks.includes(landmark)) return;
    uniqueLandmarks.push(landmark);
    uniqueLandmarksMap[landmark.id || landmark.getAttribute('CustomElementId')] = landmark;
  });
  this.uniqueLandmarks = uniqueLandmarksMap;
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
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  addressAccessibilityIssues,
  improveAccessibility,
  renderDependencyGraph,
  displayModuleStructure,
  newFunction
};