// main.js - Main application entry point

// Main module

// Dependency imports
const { dependencyGraphContent } = require('./dependency-graph');
const { indexContent } = require('./index');

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

const { class1, function1, Object1 } = require('./legacy-modules');

// Accessibility store with comprehensive accessibility improvements
const a11yStore = {
  liveRegion: null,

  /**
   * Check if the user prefers reduced motion
   * @returns {boolean} True if the user prefers reduced motion
   */
  prefersReducedMotion() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    return prefersReduced.matches;
  },

  prefersHighContrast() {
    const prefersMore = window.matchMedia('(prefers-contrast: more)');
    return prefersMore.matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) {
      this.liveRegion = document.getElementById('live-region');
    }
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = '';
      // Use setTimeout to ensure screen readers announce the update
      setTimeout(() => {
        this.liveRegion.textContent = message;
      }, 100);
    }
  },

  announce(message, priority = 'polite') {
    this.updateLiveRegion(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }

        if (landmarks.length > 1 && !landmark.getAttribute('aria-label')) {
          landmark.setAttribute('aria-label', `${element} ${index + 1}`);
        }
      });
    });
  },

  ensureSvgAccessibility() {
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

      svg.setAttribute('aria-labelledby', titleElement.id);

      if (!svg.getAttribute('role') && !svg.getAttribute('aria-label')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[data-href], [href="#"], [href="javascript:void(0)"]');
    fakeLinks.forEach((link) => {
      if (link.tagName !== 'A') {
        link.setAttribute('role', 'link');
        link.setAttribute('tabindex', '0');
        link.setAttribute('aria-disabled', 'false');
      }
    });
  },

  /**
   * Ensure all interactive elements have proper ARIA roles
   */
  ensureInteractiveRoles() {
    const interactiveSelectors = '[onclick], [onkeydown], [onmouseup], [onmousedown], [onfocus], [onblur]';
    const interactiveElements = document.querySelectorAll(interactiveSelectors);
    interactiveElements.forEach((element) => {
      const tagName = element.tagName.toLowerCase();
      if (tagName !== 'button' && tagName !== 'a' && !element.getAttribute('role')) {
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
      let label = document.querySelector(`label[for="${control.id}"]`);
      if (!label) {
        label = document.createElement('label');
        label.setAttribute('for', control.id);
        label.textContent = control.placeholder || 'Form control';
        control.parentNode.insertBefore(label, control);
      }
    });
  },

  /**
   * Ensure all images have alt text or ARIA attributes
   */
  ensureImageAccessibility() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt && !img.getAttribute('aria-hidden') && !img.getAttribute('aria-label')) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });
  },

  /**
   * Initialize all accessibility improvements
   */
  init() {
    this.checkLandmarkElements();
    this.ensureSvgAccessibility();
    this.fixFakeLinks();
    this.ensureInteractiveRoles();
    this.addFormControlLabels();
    this.ensureImageAccessibility();
  }
};

// New functions to ensure interactive elements are accessible
function ensureInteractiveElementsAccessible() {
  // Ensure all clickable elements are keyboard accessible
  const clickableElements = document.querySelectorAll('[onclick]');
  clickableElements.forEach((element) => {
    if (!element.hasAttribute('tabindex') && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
      element.setAttribute('tabindex', '0');
    }
    
    // Add keyboard event handling if missing
    if (!element.hasAttribute('onkeydown')) {
      const onclickAttr = element.getAttribute('onclick');
      element.setAttribute('onkeydown', `if(event.key==='Enter'||event.key===' '){${onclickAttr}}`);
    }
  });

  // Ensure all focus indicators are visible
  const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  focusableElements.forEach((element) => {
    const style = window.getComputedStyle(element);
    if (style.outline === 'none' || style.outlineWidth === '0px') {
      element.classList.add('keyboard-focus');
    }
  });

  // Add skip link for keyboard navigation
  if (!document.querySelector('#skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.top = 'auto';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.overflow = 'hidden';
    skipLink.addEventListener('focus', (e) => {
      e.target.style.position = 'static';
      e.target.style.width = 'auto';
      e.target.style.height = 'auto';
      e.target.style.outline = '2px solid #0066cc';
    });
    skipLink.addEventListener('blur', (e) => {
      e.target.style.position = 'absolute';
      e.target.style.left = '-9999px';
      e.target.style.width = '1px';
      e.target.style.height = '1px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

// Export all functionality
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
  
  // Functions
  greetingFunction,
  getWelcomeMessage,
  ensureInteractiveElementsAccessible,
  
  // Configuration
  config,
  
  // Accessibility store
  a11yStore,
  
  // Legacy exports
  class1,
  function1,
  Object1
};

// Initialize accessibility when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (a11yStore) {
      a11yStore.init();
    }
    ensureInteractiveElementsAccessible();
  });
}