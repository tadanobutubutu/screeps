// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// main.js - Main application entry point

// TODO: This is the existing code that needs to be preserved
// Main module

// Dependency imports
const { dependencyGraphContent } = require('./graphs');
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

const { class1, function1, Object1 } = require('./module');

// Accessibility store with comprehensive accessibility improvements
const a11yStore = {
  liveRegion: null,
  // ... existing methods ...

  /**
   * Set up a focus trap within a container element
   * @param {HTMLElement} container - The container element to trap focus within
   * @returns {Object} An object containing the container element and a destroy function
   */
  prefersReducedMotion() {
    const prefersReducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return prefersReducedQuery.matches;
  },

  prefersHighContrast() {
    const prefersHighContrastQuery = window.matchMedia('(prefers-contrast: more)');
    return prefersHighContrastQuery.matches;
  },

  liveRegion: null,

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('role', 'status');
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.style.position = 'absolute';
      this.liveRegion.style.width = '1px';
      this.liveRegion.style.height = '1px';
      this.liveRegion.style.padding = '0';
      this.liveRegion.style.margin = '-1px';
      this.liveRegion.style.overflow = 'hidden';
      this.liveRegion.style.clip = 'rect(0, 0, 0, 0)';
      this.liveRegion.style.whiteSpace = 'nowrap';
      this.liveRegion.style.border = '0';
      document.body.appendChild(this.liveRegion);
    }
    this.liveRegion.textContent = '';
    // Use setTimeout to ensure the region is announced
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  announce(message, priority) {
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
          if (!landmark.getAttribute('aria-label')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  ensureSvgAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }
    };

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      }
    };

      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', titleElement.id);

      if (!svg.getAttribute('aria-hidden')) {
        svg.setAttribute('aria-hidden', 'true');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href="#"], [href=""], a[onclick]');
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
    const interactiveElements = document.querySelectorAll('div[onclick], span[onclick], a[onkeydown], [onmouseup], [onmousedown], [onfocus], [onblur]');
    interactiveElements.forEach((element) => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', 'button');
      }
    });
  },

  /**
   * Add ARIA labels to form controls if missing
   */
  addFormControlLabels() {
    const formControls = document.querySelectorAll('input, select, textarea, button');
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
  ensureImageAltText() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('role')) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });
  },
};

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

// ... rest of the code ...