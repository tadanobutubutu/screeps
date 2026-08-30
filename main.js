// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

const config = {
  debug: process.env.NODE_ENV !== 'production',
  apiEndpoint: process.env.API_ENDPOINT || '/api',
  maxRetries: 3,
  timeout: 10000
};

const logger = require('./utils/logger');

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
    document.querySelector('[role="application"]');

  if (dependencyGraph) {
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'tree');
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
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

    const focusable = document.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex="0"], [contenteditable="true"]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  function manageLandmarks() {
    const landmarks = [...new Set([
      'banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'
    ].filter(issue => issue.ariaRole))];

    // Check if all landmarks exist, re-add if necessary
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      if (elements.length < landmarks.length) {
        const uniqueLandmarkMap = {};

        elements.forEach(element => {
          const uniqueLandmark = element.getAttribute('role');
          if (!uniqueLandmarkMap[uniqueLandmark]) {
            uniqueLandmarkMap[uniqueLandmark] = true;
          }
        });

        // REACT_025: Add other accessibility changes as per the insight report
        Object.keys(uniqueLandmarkMap).forEach(uniqueLandmark => {
          let element = elements.filter(el => el.getAttribute('role') === uniqueLandmark);
          if (!element[0]) {
            element = document.createElement('div');
            element.setAttribute('role', uniqueLandmark);
            if (uniqueLandmark === 'main') {
              const id = uniqueLandmark;
              element.setAttribute('id', id);
            }
            document.body.appendChild(element);
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

// Export public functions
module.exports = {
  init,
  addressAccessibilityIssues,
  config,
  appData
};