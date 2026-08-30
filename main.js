// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};
let uniqueLandmarks = {};

function addressAccessibilityIssues(insightReport) {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('[data-dependency-graph]') ||
    document.querySelector('.dependency-graph') ||
    document.querySelector('#dependency-graph') ||
    document.querySelector('div.dependency-graph');
  
  if (dependencyGraph) {
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'tree');
    }
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

    const focusable = document.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable="true"]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  function processLandmarks(insightReport) {
    const landmarks = [...new Set(insightReport
      .filter(issue => issue.ariaRole)
      .map(issue => issue.ariaRole))];

    // Check if all landmarks exist, re-add if necessary
    landmarks.forEach(uniqueLandmark => {
      let elements = document.querySelectorAll(`[role="${uniqueLandmark}"]`);
      
      if (elements.length === 0) {
        const element = document.createElement('div');
        element.setAttribute('role', uniqueLandmark);
        
        const id = uniqueLandmark.toLowerCase().replace(/\s+/g, '-');
        element.setAttribute('id', id);
        
        document.body.appendChild(element);
      }
      
      uniqueLandmarks[uniqueLandmark] = elements[0];
    });
  }

  // Execute accessibility improvements
  improveAccessibility();
  
  if (insightReport && insightReport.length > 0) {
    processLandmarks(insightReport);
  }
}

// TODO: This is the new function request
function newFunction() {
  // Implement the new function here
  console.log("New Function has been called!");
}

// Continue with existing exports, functions, or any other code that follows
module.exports = {
  addressAccessibilityIssues,
  newFunction,
  isInitialized,
  appData,
  uniqueLandmarks
};