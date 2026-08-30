// TODO: Address accessibility issues from insight report

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
    document.querySelector('main');

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

    const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  function ensureLandmarkAttributes() {
    const landmarks = [...new Set([
      { ariaRole: 'navigation', selector: 'nav' },
      { ariaRole: 'main', selector: 'main' },
      { ariaRole: 'complementary', selector: 'aside' },
      { ariaRole: 'banner', selector: 'header' },
      { ariaRole: 'contentinfo', selector: 'footer' }
    ].map(issue => issue.ariaRole))];

    // Check if all landmarks exist, re-add if necessary
    landmarks.forEach(uniqueLandmark => {
      const elements = document.querySelectorAll(`[role="${uniqueLandmark}"]`);
      if (elements.length < landmarks.length) {
        const uniqueLandmarkMap = {};

        landmarks.forEach(uniqueLandmark => {
          let element = elements.filter(el => el.getAttribute('role') === uniqueLandmark);
          if (!element[0]) {
            element = document.querySelector(uniqueLandmark);
            element.setAttribute('role', uniqueLandmark);
            if (!element.id) {
              const id = uniqueLandmark;
              element.setAttribute('id', id);
            }
            element = element[0] || element;
          }
          uniqueLandmarkMap[uniqueLandmark] = element[0];
        });
        uniqueLandmarks = uniqueLandmarkMap;
      }
    });
  }

  // Run accessibility improvements
  improveAccessibility();
  ensureLandmarkAttributes();
}

// TODO: This is the new function request
function newFunction() {
  // Implement the new function here
  console.log("New Function has been called!");
}

// Initialize the application
function initialize() {
  if (isInitialized) {
    logger.warn('Application already initialized');
    return;
  }
  
  addressAccessibilityIssues();
  isInitialized = true;
  logger.info('Application initialized successfully');
}

// Export functions and state
module.exports = {
  initialize,
  addressAccessibilityIssues,
  newFunction,
  getAppData: () => appData,
  isInitialized: () => isInitialized
};