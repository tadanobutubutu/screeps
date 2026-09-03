// main.js - Main application entry point

// Main module

// Dependency imports
const { dependencyGraphContent } = require('./dependencies');
const { indexContent } = require('./templates');

const main = require('./utilities');

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
} = main;

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

const config = {
  port: 3000,
  debug: false
};

function getWelcomeMessage() {
  return greetingFunction() + " This is a new function that returns a welcome message.";
}

const { class1, function1, Object1 } = require('./components');

const a11yStore = {
  // ... existing methods ...

  /**
   * Check if the user prefers reduced motion
   * @returns {boolean} True if the user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.className = 'sr-only';
      document.body.appendChild(this.liveRegion);
    }
    this.announce(message, priority);
  },

  announce(message, priority = 'polite') {
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }

        if (landmarks.length > 1) {
          if (landmark.id === `${element}-${index}`) {
            landmark.id = `${element} ${index + 1}`;
          }
        }
      });
    });
  },

  checkSvgAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }

      const descElement = svg.querySelector('desc') || svg.querySelector('aria-describedby');

      if (!descElement && !svg.getAttribute('aria-label')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href="#"], [href=""], a[href*="javascript"]');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-disabled', 'true');
    });
  },

  /**
   * Ensure all interactive elements have proper ARIA roles
   */
  ensureInteractiveRoles() {
    const interactiveElements = document.querySelectorAll('[onclick], [onkeydown], [onmouseup], [onmousedown], [onfocus], [onblur]');
    interactiveElements.forEach((element) => {
      if (!element.getAttribute('role') && !element.tagName.match(/^(button|a|input|select|textarea)$/i)) {
        element.setAttribute('role', 'button');
      }
    });
  },

  /**
   * Add ARIA labels to form controls if missing
   */
  addFormControlLabels() {
    const formControls = document.querySelectorAll('input, select, textarea');
    formControls.forEach((control, index) => {
      if (!control.id) {
        control.id = `form-control-${index}`;
      }
      const label = document.querySelector(`label[for="${control.id}"]`);
      label.setAttribute('for', control.id);
      label.textContent = control.placeholder || 'Form control';
      control.parentNode.insertBefore(label, control);
    });
  },

  /**
   * Ensure all images have alt text or ARIA attributes
   */
  ensureImageAltText() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('role')) {
        img.setAttribute('alt', '');
      }
    });
  },

  // ... remaining a11yStore methods ...
};

// New functions
function ensureInteractiveElementsAccessible() {
  a11yStore.ensureInteractiveRoles();
  a11yStore.addFormControlLabels();
  a11yStore.ensureImageAltText();
  a11yStore.fixFakeLinks();
}

// Export all functions and utilities
module.exports = {
  // Math operations
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
  
  // Rendering functions
  greetingFunction,
  getWelcomeMessage,
  
  // Configuration
  config,
  
  // Accessibility store
  a11yStore,
  
  // New accessibility function
  ensureInteractiveElementsAccessible,
  
  // Class and components
  class1,
  function1,
  Object1,
  
  // Main utilities reference
  main
};

// Make functions accessible in main.js scope
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
  greetingFunction,
  getWelcomeMessage,
  ensureInteractiveElementsAccessible,
  a11yStore,
  config,
  class1,
  function1,
  Object1,
  main
};