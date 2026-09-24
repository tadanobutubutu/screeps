// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// main.js - Main application entry point

// TODO: This is the existing code that needs to be preserved
// Main module

// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraph');
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

const { class1, function1, Object1 } = require('./legacy');

// Accessibility store with comprehensive accessibility improvements
const a11yStore = {
  liveRegion: null,
  // ... existing methods ...

  /**
   * Check if the user prefers reduced motion
   * @returns {boolean} True if the user prefers reduced motion
   */
  preferReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  preferHighContrast() {
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

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(element => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }

        if (landmarks.length > 1) {
          if (!landmark.getAttribute('aria-label')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  fixSvgAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      }

      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', titleElement.id);

      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[role="link"]');
    fakeLinks.forEach(link => {
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-disabled', 'true');
    });
  },

  /**
   * Ensure all interactive elements have proper ARIA roles
   */
  ensureInteractiveRoles() {
    const interactiveElements = document.querySelectorAll('[onclick], [onkeydown], [onmouseup], [onmousedown], [onfocus], [onblur]');
    interactiveElements.forEach(element => {
      if (!element.getAttribute('role')) {
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
      if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('role')) {
        img.setAttribute('alt', '');
      }
    });
  },

  // ... remaining a11yStore methods ...

  /**
   * New function to ensure the element has an id, add aria-label, render dependency graphs
   * @param {Element} element - The element to be processed
   */
  enhanceAccessibilityOfElement(element) {
    if (!element.id) {
      const idSuffix = Math.floor(Math.random() * 10000);
      element.setAttribute('id', `enhanced-element-${idSuffix}`);
    }

    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', 'Enhanced element');
    }

    // Render dependency graph if applicable (dependency graph rendering logic not shown)
    // This is a placeholder for the actual rendering logic
    // dependencyGraphContent.renderForElement(element);
  }
};

/**
 * Validates the accessibility report by running all accessibility checks
 * and ensuring the a11yStore methods are properly configured.
 */
function validateAccessibilityReport() {
  console.log('Validating accessibility report...');
  
  // Check if a11yStore exists and has required methods
  if (!a11yStore) {
    throw new Error('a11yStore is not initialized');
  }
  
  const requiredMethods = [
    'preferReducedMotion',
    'preferHighContrast',
    'updateLiveRegion',
    'checkLandmarkElements',
    'addSVGAccessibilityProps',
    'fixFakeLinks',
    'ensureInteractiveRoles',
    'addFormControlLabels',
    'ensureImageAccessibility'
  ];
  
  for (const methodName of requiredMethods) {
    if (!a11yStore[methodName]) {
      throw new Error(`Missing accessibility method: ${methodName}`);
    }
  }
  
  // Run each accessibility check
  try {
    a11yStore.preferReducedMotion();
    a11yStore.preferHighContrast();
    a11yStore.updateLiveRegion('Test message');
    a11yStore.checkLandmarkElements();
    a11yStore.addSVGAccessibilityProps();
    a11yStore.fixFakeLinks();
    a11yStore.ensureInteractiveRoles();
    a11yStore.addFormControlLabels();
    a11yStore.ensureImageAccessibility();
    
    console.log('Accessibility report validation passed successfully.');
  } catch (error) {
    console.error('Accessibility validation failed:', error.message);
    process.exit(1);
  }
}

// New functions
function ensureInteractiveElementsAccessible() {
  // Check for interactive elements without proper accessibility
  const interactiveElements = document.querySelectorAll('[onclick], [onkeydown], [onkeyup], [onkeypress]');
  
  interactiveElements.forEach((element) => {
    // Ensure elements are keyboard accessible
    if (!element.hasAttribute('tabindex') && !element.hasAttribute('href')) {
      element.setAttribute('tabindex', '0');
    }
    
    // Add role if not present
    if (!element.getAttribute('role')) {
      if (element.tagName === 'A') {
        // Links should have proper href or role="button"
        if (!element.getAttribute('href') || element.getAttribute('href') === '#') {
          element.setAttribute('role', 'button');
        }
      } else {
        element.setAttribute('role', 'button');
      }
    }
    
    // Ensure visible focus indicator
    if (!element.hasAttribute('data-a11y-focus')) {
      element.setAttribute('data-a11y-focus', 'true');
    }
  });
  
  return true;
}

/**
 * Create an accessible web resource button (e.g., GitHub, Stack Overflow).
 * Returns an HTMLButtonElement that is keyboard-accessible, has an appropriate
 * ARIA role, and announces its purpose via aria-label.
 *
 * @param {Object} options - Configuration options for the button.
 * @param {string} options.url - The URL the button should navigate to when activated.
 * @param {string} options.label - A descriptive label for the resource (used for aria-label and visible text).
 * @param {string} [options.icon] - Optional inline SVG markup or HTML for an icon to display inside the button.
 * @param {string} [options.id] - Optional id to assign to the button element.
 * @param {Object} [options.attributes] - Optional additional HTML attributes to set on the button (key/value pairs).
 * @returns {HTMLButtonElement} A button element with proper accessibility attributes.
 */
function createWebResourceButton({ url, label, icon, id, attributes } = {}) {
  if (!url || typeof url !== 'string') {
    throw new Error('createWebResourceButton: a valid "url" string is required.');
  }
  if (!label || typeof label !== 'string') {
    throw new Error('createWebResourceButton: a valid "label" string is required.');
  }

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('role', 'link');
  button.setAttribute('tabindex', '0');
  button.setAttribute('aria-label', label);
  button.setAttribute('data-url', url);
  button.classList.add('web-resource-button');

  if (id) {
    button.id = id;
  }

  if (icon) {
    const iconWrapper = document.createElement('span');
    iconWrapper.classList.add('web-resource-button-icon');
    iconWrapper.setAttribute('aria-hidden', 'true');
    iconWrapper.innerHTML = icon;
    button.appendChild(iconWrapper);
  }

  const textNode = document.createElement('span');
  textNode.classList.add('web-resource-button-label');
  textNode.textContent = label;
  button.appendChild(textNode);

  if (attributes && typeof attributes === 'object') {
    Object.keys(attributes).forEach((key) => {
      button.setAttribute(key, attributes[key]);
    });
  }

  button.addEventListener('click', () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  });

  return button;
}

// Function to call the accessibility report validation
function validateAccessibility() {
  a11yStore.validateAccessibilityReport();
}

function generateAccessibilityReport() {
  const report = {
    reducedMotion: a11yStore.prefersReducedMotion(),
    highContrast: a11yStore.prefersHighContrast(),
    landmark: {
      missingId: 0,
      missingLabel: 0
    },
    svg: {
      missingTitle: 0,
      missingAriaLabelledby: 0,
      missingRoleImg: 0
    },
    fakeLinks: 0,
    interactiveRoles: 0,
    formControlLabels: 0,
    images: 0
  };

  // Check landmark elements
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkElements.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el, index) => {
      if (!el.id) {
        report.landmark.missingId++;
      }
      if (elements.length > 1) {
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
          report.landmark.missingLabel++;
        }
      }
    });
  });

  // Check SVG elements
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const titleElement = svg.querySelector('title');
    if (!titleElement) {
      report.svg.missingTitle++;
    }
    if (!svg.hasAttribute('aria-labelledby')) {
      report.svg.missingAriaLabelledby++;
    }
    if (!svg.hasAttribute('role') || svg.getAttribute('role') !== 'img') {
      report.svg.missingRoleImg++;
    }
  });

  // Check fake links
  const fakeLinks = document.querySelectorAll('[href]:not(a)');
  report.fakeLinks = fakeLinks.length;

  // Check interactive elements without role
  const interactiveElements = document.querySelectorAll('[onclick], [onkeydown], [onmouseup], [onmousedown], [onfocus], [onblur]');
  report.interactiveRoles = Array.from(interactiveElements).filter(el => !el.hasAttribute('role')).length;

  // Check form controls without id
  const formControls = document.querySelectorAll('input, select, textarea');
  report.formControlLabels = Array.from(formControls).filter(control => !control.id).length;

  // Check images without accessibility attributes
  const images = document.querySelectorAll('img');
  report.images = Array.from(images).filter(img => 
    !img.hasAttribute('alt') && 
    !img.hasAttribute('aria-hidden') && 
    !img.hasAttribute('role')
  ).length;

  return report;
}

function initializeAccessibility() {
  a11yStore.checkLandmarkElements();
  a11yStore.fixSvgAccessibility();
  a11yStore.fixFakeLinks();
  ensureInteractiveElementsAccessible();
}

// ... rest of the code ...

module.exports = {
  greetingFunction,
  getWelcomeMessage,
  config,
  a11yStore,
  initializeAccessibility,
  ensureInteractiveElementsAccessible,
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
};