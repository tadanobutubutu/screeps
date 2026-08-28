const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  // Existing function implementation
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addProperLandmarkRegions();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks(); // Added for REACT_036
    this.countDependencies(); // Merged change from both branches
  },

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[data-interactive]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
        if (openModal) {
          openModal.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
      }
    });

    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        if (!focusIsInsideContainer) {
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });
  },

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmark = document.querySelector(`[role="${element}"]`);
      if (landmark && landmark.id === '') {
        landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
      }
    });
  },

  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.querySelector('title').textContent || 'Image description';
      const descriptionId = `svg-description-${Math.floor(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('p');
      descriptionElement.setAttribute('id', descriptionId);
      descriptionElement.textContent = titleText;
      descriptionElement.className = 'sr-only';
      document.body.appendChild(descriptionElement);
    });
  },

  preserveExistingCode() {
    // Existing code preservation logic
  },

  countDependencies(options = {}) {
    const {
      includeModules = true,
      includeDOM = true,
      includeAccessibility = true
    } = options;

    let count = 0;
    const details = {};

    if (includeModules) {
      // Count module dependencies (imports/exports)
      const moduleExports = ['a11yStore', 'mainElement', 'addressAccessibilityIssues'];
      details.modules = moduleExports.length;
      count += moduleExports.length;
    }

    if (includeDOM) {
      // Count DOM element dependencies
      const domElements = {
        liveRegion: this.liveRegion ? 1 : 0,
        skipLinks: document.querySelectorAll('.skip-link').length,
        landmarks: document.querySelectorAll('[role="main"], [role="nav"], [role="header"], [role="footer"], [role="aside"]').length,
        svgs: document.querySelectorAll('svg').length,
        interactiveElements: document.querySelectorAll('[data-interactive]').length,
        dropdowns: document.querySelectorAll('[data-dropdown]').length,
        modals: document.querySelectorAll('[role="dialog"][aria-modal="true"]').length,
        focusableElements: document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').length
      };
      details.dom = domElements;
      count += Object.values(domElements).reduce((sum, val) => sum + val, 0);
    }

    if (includeAccessibility) {
      // Count accessibility feature dependencies
      const a11yFeatures = {
        liveRegionInitialized: this.liveRegion ? 1 : 0,
        keyboardNavigation: 1,
        focusManagement: 1,
        skipLinks: document.querySelector('.skip-link') ? 1 : 0,
        landmarkElements: document.querySelectorAll('[role="main"], [role="nav"], [role="header"], [role="footer"], [role="aside"]').length,
        svgAccessibility: document.querySelectorAll('svg[role="img"]').length,
        langAttribute: document.documentElement.getAttribute('lang') ? 1 : 0,
        reducedMotionSupport: this.prefersReducedMotion() ? 1 : 0,
        highContrastSupport: this.prefersHighContrast() ? 1 : 0
      };
      details.accessibility = a11yFeatures;
      count += Object.values(a11yFeatures).reduce((sum, val) => sum + val, 0);
    }

    return {
      total: count,
      details,
      timestamp: new Date().toISOString()
    };
  }
};

// New function to handle adding landmark regions
function addLandmarkRegions() {
  // Implementation would iterate through LANDMARK_ELEMENTS and ensure they have proper IDs
  LANDMARK_ELEMENTS.forEach(landmark => {
    const element = document.querySelector(landmark);
    if (element) {
      if (!element.id) {
        element.id = `landmark-${landmark}-${Date.now()}`;
      }
    }
  });
}

// Run game logic here...

// Update scope attributes in all .html files in the views directory
const viewsDir = path.join(__dirname, 'views');
fs.readdirSync(viewsDir)
  .filter(file => file.endsWith('.html'))
  .forEach(file => {
    const filePath = path.join(viewsDir, file);
    updateThScopeAttribute(filePath);
  });

// Used for addressing React accessibility issues
function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    // Handle each issue type
    switch (issue.type) {
      case 'missing-lang':
        if (!document.documentElement.lang) {
          document.documentElement.lang = 'en';
        }
        break;
      case 'missing-skip-link':
        if (!document.querySelector('.skip-link')) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          document.body.prepend(skipLink);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        document.querySelectorAll('input, select, textarea').forEach(el => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
      // Add more cases as needed
    }
  });
}

// Wrap the entire document content inside a <main> element
const mainElement = document.createElement('main');
document.documentElement.setAttribute('lang', 'en');
document.body.appendChild(mainElement);

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      updateThScopeAttribute(filePath);
    });

  // Additional logic to add landmark regions
  addLandmarkRegions();
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Standalone function to count dependencies
function countDependencies(options) {
  return a11yStore.countDependencies(options);
}

// Standalone wrapper functions for a11yStore methods
function updateLiveRegion(message, priority = 'polite') {
  return a11yStore.updateLiveRegion(message, priority);
}

function checkLandmarkElements() {
  return a11yStore.checkLandmarkElements();
}

function addSVGAccessibilityProps() {
  return a11yStore.addSVGAccessibilityProps();
}

function preserveExistingCode() {
  return a11yStore.preserveExistingCode();
}

function prefersReducedMotion() {
  return a11yStore.prefersReducedMotion();
}

function prefersHighContrast() {
  return a11yStore.prefersHighContrast();
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

// Game-related functions
function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};

export function calculateProduct(a, b) {
  return a * b;
}

/**
 * Check if a value is a number
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a number, false otherwise
 */
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export const logger = {
  info(message) {
    console.log(`[INFO] ${message}`);
  }
};

module.exports = {
  run,
  main,
  SomeClass,
  someUtility,
  config,
  countDependencies: a11yStore.countDependencies,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  a11yStore,
  mainElement,
  updateLiveRegion,
  checkLandmarkElements,
  addSVGAccessibilityProps,
  preserveExistingCode,
  prefersReducedMotion,
  prefersHighContrast,
  addLandmarkRegions,
  myFunction,
  initializeApp,
  calculateSum,
  calculateDifference,
  calculateProduct,
  isNumber,
  clamp,
  start() {
    console.log('Application started');
    return Promise.resolve();
  }
};