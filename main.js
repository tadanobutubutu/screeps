// TODO: Address accessibility issues from insight report

const config = {
  debug: process.env.NODE_ENV !== 'production',
  apiEndpoint: process.env.API_ENDPOINT || '/api',
  maxRetries: 3,
  timeout: 10000
};

const logger = require('./utils/logger');
const { someModule } = require('some-module');

// Application state
let isInitialized = false;
const appData = {};
let uniqueLandmarks = {};

function addressAccessibilityIssues() {
  // REACT_015: Add lang attribute to HTML element
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    const lang = htmlElement.getAttribute('xml:lang') || 'en';
    htmlElement.setAttribute('lang', lang);
  }

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
      if (!button.hasAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
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
            element = element[0] || element;
          }
        });
      }
    });

    // Additional accessibility improvements
    improveAccessibility();
  }

  // Initialize accessibility features
  manageLandmarks();
  improveAccessibility();

  // Ensure all images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  // Ensure form inputs have associated labels
  const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
  inputs.forEach(input => {
    const id = input.id;
    if (id && !document.querySelector(`label[for="${id}"]`)) {
      const parentLabel = input.closest('label');
      if (!parentLabel) {
        logger.warn(`Input ${id} missing associated label`);
      }
    }
  });

  // Ensure proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.substring(1));
    if (level > lastLevel + 1) {
      logger.warn(`Skipping heading level from h${lastLevel} to h${level}`);
    }
    lastLevel = level;
  });

  return true;
}

// Initialize application
function init() {
  if (isInitialized) {
    logger.warn('Application already initialized');
    return;
  }

  logger.info('Initializing application...');

  // Set up initial state
  isInitialized = true;
  appData.startTime = Date.now();

  // Address accessibility issues on initialization
  addressAccessibilityIssues();

  logger.info('Application initialized successfully');
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