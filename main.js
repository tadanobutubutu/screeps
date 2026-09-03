// main.js - Main application entry point

// Main module

// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

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
} = require('./mathHelpers');

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

const { class1, function1, Object1 } = require('./path/to/module');

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
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`);
        }

        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  addSVGAccessibilityProps() {
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

      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href]:not(a)');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
    });
  },

  /**
   * Ensure all interactive elements have proper ARIA roles
   */
  ensureInteractiveRoles() {
    const interactiveElements = document.querySelectorAll('[onclick], [onkeydown], [onmouseup], [onmousedown], [onfocus], [onblur]');
    interactiveElements.forEach((element) => {
      if (!element.hasAttribute('role')) {
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
      const label = document.createElement('label');
      label.setAttribute('for', control.id);
      label.textContent = control.placeholder || 'Form control';
      control.parentNode.insertBefore(label, control);
    });
  },

  /**
   * Ensure all images have alt text or ARIA attributes
   */
  ensureImageAccessibility() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.hasAttribute('alt') && !img.hasAttribute('aria-hidden') && !img.hasAttribute('role')) {
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
  a11yStore.ensureImageAccessibility();
}

/**
 * Wrap the primary content of the page in a <main> element.
 *
 * If a <main> element already exists in the DOM, this function returns it
 * without modification. Otherwise, it identifies the primary content using
 * a layered strategy:
 *   1. The first element with role="main".
 *   2. The element with id="primary".
 *   3. The element with id="main".
 *   4. The element with id="content".
 *   5. The first <article> on the page.
 *   6. The largest content block (by element count) among direct children of <body>.
 *
 * Once the primary content is identified, it is wrapped in a new <main>
 * element (created with appropriate ARIA attributes and moved into place),
 * or replaced with an existing <main> wrapper while preserving its children.
 *
 * @returns {HTMLElement|null} The resulting <main> element, or null if no
 *   primary content could be determined.
 */
function wrapPrimaryContentInMain() {
  let mainElement = document.querySelector('main');

  if (mainElement) {
    return mainElement;
  }

  // Try to find an element with role="main"
  let primaryContent = document.querySelector('[role="main"]');

  // Try to find an element with id="primary"
  if (!primaryContent) {
    primaryContent = document.getElementById('primary');
  }

  // Try to find an element with id="main"
  if (!primaryContent) {
    primaryContent = document.getElementById('main');
  }

  // Try to find an element with id="content"
  if (!primaryContent) {
    primaryContent = document.getElementById('content');
  }

  // Fallback: use the first <article> on the page
  if (!primaryContent) {
    primaryContent = document.querySelector('article');
  }

  // Final fallback: find the largest content block by element count
  if (!primaryContent) {
    const bodyChildren = Array.from(document.body.children);
    let maxCount = 0;
    bodyChildren.forEach((child) => {
      const count = child.querySelectorAll('*').length;
      if (count > maxCount) {
        maxCount = count;
        primaryContent = child;
      }
    });
  }

  if (!primaryContent) {
    return null;
  }

  mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  mainElement.setAttribute('id', 'main-content');
  primaryContent.parentNode.insertBefore(mainElement, primaryContent);
  mainElement.appendChild(primaryContent);

  return mainElement;
}

// ... rest of the code ...