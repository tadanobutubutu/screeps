const fs = require('fs');
const path = require('path');

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

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

  // TODO: Implement a function to count dependencies
  // This is a placeholder for the actual implementation
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

// Main game loop for Screeps
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      updateThScopeAttribute(filePath);
    });
}

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.setAttribute('lang', 'en');
}

// Import accessibility helper functions
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
document.documentElement.setAttribute('lang', 'en');
document.body.appendChild(mainElement);

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

// Game-related functions and exports
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

module.exports = {
  run,
  main,
  SomeClass,
  someUtility,
  config,
  countDependencies,
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
  prefersHighContrast
};