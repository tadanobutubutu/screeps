// main.js - Main application entry point

// Main module

// Dependency imports
const { dependencyGraphContent } = require('./content/dependencyGraphContent');
const { indexContent } = require('./content/indexContent');

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

const { class1, function1, Object1 } = require('./some/module');

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
    this.liveRegion.setAttribute('aria-live', priority);
    this.announce(message, priority);
  },

  announce(message, priority) {
    // Force screen reader to announce by temporarily clearing and re-setting content
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
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
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  validateLandmark() {
    const requiredLandmarks = ['main', 'nav', 'header', 'footer'];
    requiredLandmarks.forEach(landmark => {
      const elements = document.querySelectorAll(landmark);
      if (elements.length === 0) {
        console.warn(`Missing required landmark: ${landmark}`);
      }
    });
  },

  validateLandmarkStructure() {
    const mainElements = document.querySelectorAll('main');
    const navElements = document.querySelectorAll('nav');
    
    if (mainElements.length > 1) {
      console.warn('More than one main landmark found');
    }
    
    if (navElements.length > 2) {
      console.warn('More than two nav landmarks found');
    }
  },

  ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
    const seenIds = new Set();
    
    landmarks.forEach(landmark => {
      if (landmark.id && seenIds.has(landmark.id)) {
        console.error(`Duplicate landmark ID: ${landmark.id}`);
      }
      if (landmark.id) {
        seenIds.add(landmark.id);
      }
    });
  },

  setSvgAttributes() {
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

      svg.setAttribute('aria-labelledby', titleElement.id);

      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    if (title && title.textContent) {
      return title.textContent;
    }
    
    const desc = svg.querySelector('desc');
    if (desc && desc.textContent) {
      return desc.textContent;
    }
    
    return svg.getAttribute('aria-label') || '';
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[data-fake-link], .fake-link');
    fakeLinks.forEach(link => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-label', link.textContent || 'Link');
    });
  },

  validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
        console.warn('Link missing accessible text');
      }
    });
  },

  handleFakeLinks() {
    const fakeLinks = document.querySelectorAll('[onclick], [data-href]');
    fakeLinks.forEach(link => {
      if (link.tagName !== 'A') {
        link.setAttribute('role', 'link');
        link.setAttribute('tabindex', '0');
      }
    });
  },

  /**
   * Ensure all interactive elements have proper ARIA roles
   */
  ensureInteractiveRoles() {
    const interactiveElements = document.querySelectorAll('div, span, section');
    interactiveElements.forEach(element => {
      if (element.hasAttribute('onclick') || element.hasAttribute('onkeydown') || 
          element.hasAttribute('onmouseup') || element.hasAttribute('onmousedown') || 
          element.hasAttribute('onfocus') || element.hasAttribute('onblur')) {
        if (!element.hasAttribute('role')) {
          element.setAttribute('role', 'button');
        }
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
      if (!img.hasAttribute('alt') && !img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
        img.setAttribute('alt', '');
      }
    });
  },

  getLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
    return htmlElement ? htmlElement.getAttribute('lang') : null;
  },

  createInPageButton() {
    const buttons = document.querySelectorAll('[data-in-page]');
    buttons.forEach(button => {
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      if (!button.hasAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent || 'In-page action');
      }
    });
  },

  validateTableAccessibility() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const headers = table.querySelectorAll('th');
      if (headers.length === 0) {
        console.warn('Table missing header cells');
      }
      
      if (!table.hasAttribute('scope')) {
        const caption = table.querySelector('caption');
        if (!caption) {
          console.warn('Table missing caption or summary');
        }
      }
    });
  },

  validateTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table, tableIndex) => {
      const rows = table.querySelectorAll('tr');
      let cellCount = 0;
      
      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td, th');
        if (rowIndex === 0) {
          cellCount = cells.length;
        } else if (cells.length !== cellCount) {
          console.warn(`Table ${tableIndex + 1}, Row ${rowIndex + 1}: Cell count mismatch`);
        }
      });
    });
  },

  // ... remaining a11yStore methods ...

  // Additional utility methods
  init() {
    this.getLangAttribute();
    this.checkLandmarkElements();
    this.ensureUniqueLandmarks();
    this.setSvgAttributes();
    this.ensureInteractiveRoles();
    this.addFormControlLabels();
    this.ensureImageAccessibility();
    this.validateTableAccessibility();
    this.validateTableStructure();
    this.fixFakeLinks();
    this.createInPageButton();
  }
};

// New functions
function ensureInteractiveElementsAccessible() {
  if (a11yStore) {
    a11yStore.ensureInteractiveRoles();
    a11yStore.addFormControlLabels();
  }
}

// Export all functions and data
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
  
  // Utility functions
  greetingFunction,
  getWelcomeMessage,
  ensureInteractiveElementsAccessible,
  
  // Configuration
  config,
  
  // Accessibility store
  a11yStore,
  
  // Additional exports
  class1,
  function1,
  Object1
};

// Initialize accessibility features if in browser environment
if (typeof document !== 'undefined') {
  if (a11yStore && typeof a11yStore.init === 'function') {
    document.addEventListener('DOMContentLoaded', () => {
      a11yStore.init();
    });
  }
}