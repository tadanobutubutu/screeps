const http = require('http');
const path = require('path');

// Function to validate landmark elements
function validateLandmark(element, landmarkType) {
  if (!element) return false;

  const existingLandmark = element.getAttribute('role');
  if (!existingLandmark) {
    element.setAttribute('role', landmarkType);
  }

  return true;
}

function validateLandmarkStructure(container) {
  if (!container) return true;

  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  const landmarks = container.querySelectorAll('[role]');

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!allowedLandmarks.includes(role)) {
      landmark.removeAttribute('role');
    }
  });

  return true;
}

// Function to set ARIA role for dependency graph
function setARIARoleForDependencyGraph() {
  if (typeof document === 'undefined') {
    return;
  }
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'grid');
  }
}

// Function to render dependency graph with proper ARIA attributes
function renderDependencyGraph(graphData, container) {
  const graph = renderGraph(graphData, container);

  addAriaLabel(container, 'Dependency graph');
  graph.querySelectorAll('svg').forEach(addSvgAccessibleName);
  ensureUniqueLandmarks(graph);

  return graph;
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks(container) {
  if (!container) return;

  const landmarkCounts = {};
  const landmarks = container.querySelectorAll('[role]');

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
  });

  Object.keys(landmarkCounts).forEach(role => {
    if (landmarkCounts[role] > 1) {
      landmarks.forEach(landmark => {
        if (landmark.getAttribute('role') === role) {
          const label = landmark.getAttribute('aria-label') || `${role}-${landmarkCounts[role]}`;
          landmark.setAttribute('aria-label', label);
        }
      });
    }
  });

  return true;
}

// Import existing functions for creating InPageButton and generating accessibility report
const { createInPageButton, generateAccessibilityReport } = require('./accessibility-functions');

// Combine and export the updated functions for both browser and Node.js environments
if (typeof window !== 'undefined') {
  const functionsToExpose = [
    validateLandmark,
    validateLandmarkStructure,
    setARIARoleForDependencyGraph,
    renderDependencyGraph,
    createInPageButton,
    generateAccessibilityReport
  ];

  functionsToExpose.forEach(functionName => {
    window[functionName] = window[functionName] || eval(functionName);
  });
}

// Export functions for testing
module.exports = {
  renderDependencyGraph,
  createInPageButton,
  validateLandmark,
  validateLandmarkStructure,
  setARIARoleForDependencyGraph,
  generateAccessibilityReport
};