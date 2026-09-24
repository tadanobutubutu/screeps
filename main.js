// TODO: This is the modified and merged code
// This is the existing code that needs to be preserved in main.js
// main.js - Main application entry point

// TODO: This is the existing code that needs to be preserved
// Main module

// Dependency imports
const { dependencyGraphContent } = require('./content/dependencyGraphContent');
const { indexContent } = require('./content/indexContent');

const main = require('./utilities');

// Set default language for accessibility
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = 'en';
}

const a11yStore = {
  // ... existing methods ...

  checkDependencyGraphContainer() {
    const dependencyGraphContainer = document.querySelector('#dependencyGraphContainer');
    return dependencyGraphContainer ? dependencyGraphContainer : null;
  },

  isDependencyGraphContainerPresent() {
    const container = this.checkDependencyGraphContainer();
    return container !== null;
  },

  setDependencyGraphARIA() {
    if (this.isDependencyGraphContainerPresent()) {
      document.querySelector('#dependencyGraphContainer').setAttribute('role', 'tree');
      document.querySelector('#dependencyGraphContainer').setAttribute('aria-label', 'Dependency Graph');
    }
  },

  /**
   * Set up a focus trap within a container element
   * @param {HTMLElement} container - The container element to trap focus within
   * @returns {Object} An object containing the container element and a destroy function
   */
  setupFocusTrap(container) {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
      '[role="button"]:not([disabled])'
    ];

    const focusableElements = Array.from(container.querySelectorAll(focusableSelectors.join(',')));

    if (focusableElements.length === 0) {
      return { container, destroy: () => {} };
    }

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${landmark.index || 0}`);
        }

        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${landmark.index || 1}`);
          }
        }
      }
    };

    const handleFocusIn = (event) => {
      if (!container.contains(event.target)) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('focusin', handleFocusIn);

    return {
      container,
      destroy: () => {
        container.removeEventListener('keydown', handleKeyDown);
        container.removeEventListener('focusin', handleFocusIn);
      }
    };
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

  /**
   * Handle focus trapping for keyboard navigation
   * Opens a modal and ensures focus remains within the modal until Escape is pressed
   * @param {HTMLElement} targetContainer - The modal/container to trap focus in
   */
  handleFocusTrap(targetContainer) {
    // Store the previously focused element before opening the trap
    const previousFocused = document.activeElement;

    if (targetContainer) {
      // Find the first focusable element within the container
      const firstFocusable = targetContainer.querySelector('[tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
        previousFocused = document.activeElement;

        // Trap focus: prevent tabbing to background when inside the container
        targetContainer.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            if (previousFocused) {
              previousFocused.focus();
              // Optional: close the modal here if desired
            }
          }
        });

        // Close the trap when clicking outside the container
        targetContainer.addEventListener('click', (e) => {
          if (e.target !== targetContainer) {
            e.stopPropagation();
            // Could implement closing logic here
          }
        });
      }
    }
  },

  // ... remaining a11yStore methods ...

  /**
   * Ensure all interactive elements are accessible
   */
  ensureInteractiveElementsAccessible() {
    this.ensureInteractiveRoles();
    this.addFormControlLabels();
    this.ensureImageAccessibility();
  }
};

// New functions
function ensureUniqueLandmarks() {
  // Implementation to ensure unique landmarks
}

/**
 * Harvest logic implementation
 * Collects and processes data from various sources
 * @param {Object} options - Harvest options
 * @param {Array} options.sources - Array of data sources to harvest from
 * @param {boolean} options.recursive - Whether to recursively harvest from nested sources
 * @param {Function} options.transform - Optional transformation function for harvested data
 * @returns {Object} Harvested data with metadata
 */
function harvest(options = {}) {
  const { sources = [], recursive = false, transform = (data) => data } = options;
  
  const harvestedItems = [];
  const harvestMetadata = {
    timestamp: new Date().toISOString(),
    sourceCount: sources.length,
    itemCount: 0,
    errors: []
  };

  sources.forEach((source) => {
    try {
      const data = source.data || source;
      const items = Array.isArray(data) ? data : [data];
      
      items.forEach((item) => {
        const transformedItem = transform(item);
        harvestedItems.push({
          ...transformedItem,
          harvestedAt: new Date().toISOString(),
          sourceId: source.id || 'unknown'
        });
        
        if (recursive && item.children && Array.isArray(item.children)) {
          const childOptions = {
            ...options,
            sources: item.children.map((child, index) => ({
              id: `${source.id || 'source'}-child-${index}`,
              data: child
            }))
          };
          const childResults = harvest(childOptions);
          harvestedItems.push(...childResults.data);
        }
      });
    } catch (error) {
      harvestMetadata.errors.push({
        source: source.id || 'unknown',
        error: error.message
      });
    }
  });

  harvestMetadata.itemCount = harvestedItems.length;

  return {
    data: harvestedItems,
    metadata: harvestMetadata,
    totalHarvested: harvestedItems.length
  };
}

// ... rest of the code ...

module.exports = {
  greetingFunction,
  getWelcomeMessage,
  ensureInteractiveElementsAccessible,
  harvest,
  config,
  a11yStore,
  // math helpers
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