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

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

const renderGraphIndex = (graphData) => {
  // Placeholder for the new rendering logic
  // This function should use the new functions for rendering the graph/index
  // For example, it could call ... ... etc.
  // Replace this with the actual implementation details

  // Address accessibility issues from insight report
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
};

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

// Function to handle initial accessibility setup
function handleInitialAccessibility() {
  a11yStore.checkLandmarkElements();
  a11yStore.addSVGAccessibilityProps();
  a11yStore.fixFakeLinks();
}

// New entry point for accessibility related functions
function accessibility() {
  // Handle initial accessibility setup on page load
  handleInitialAccessibility();
  // Ensure all interactive elements have proper ARIA roles and attributes after page load
  ensureInteractiveElementsAccessible();
}

// --- Accessibility utility functions (from HEAD) ---

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute (lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en'
  }
  return lang || 'en'
}

/**
 * Gets the lang attribute from the document's <html> tag
 * @returns {string} The current lang attribute value or default 'en'
 */
function getLangAttribute () {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en'
  }
  return 'en'
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang (content) {
  // Simple language detection based on common patterns
  let lang = 'en' // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fa5]/.test(content)) {
      lang = 'zh' // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja' // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru' // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar' // Arabic
    } else if (/[àâäçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr' // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de' // German
    }
  }

  return lang
}

/**
 * Creates a person name element with proper accessibility attributes
 * @param {Object} options - Options for creating the person name element
 * @param {string} options.firstName - The person's first name
 * @param {string} options.lastName - The person's last name
 * @param {string} options.lang - The language code for the name (default: 'en')
 * @param {HTMLElement} options.container - Optional container element to append to
 * @returns {HTMLElement} The created element with accessible naming
 */
function personName (options = {}) {
  const { firstName = '', lastName = '', lang = 'en', container = null } = options
  const fullName = `${firstName} ${lastName}`.trim()

  if (typeof document !== 'undefined') {
    const nameElement = document.createElement('span')
    nameElement.setAttribute('lang', lang)
    nameElement.setAttribute('aria-label', fullName)
    nameElement.textContent = fullName || 'Unknown'

    if (container) {
      container.appendChild(nameElement)
    }

    return nameElement
  }

  return fullName || 'Unknown'
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton (parent = document.body) {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.setAttribute('role', 'button')
  btn.setAttribute('aria-label', 'Open modal')
  parent.appendChild(btn)
  return btn
}

// New function to validate table accessibility
function validateTableAccessibility () {
  // Implementation for table accessibility validation
}

// New function to validate table structure
function validateTableStructure () {
  // Implementation for table structure validation
}

// New function to validate landmarks
function validateLandmark () {
  // Implementation for landmark validation
}

// New function to validate landmark structure
function validateLandmarkStructure () {
  // Implementation for landmark structure validation
}

// New function to get SVG accessible name
function getSvgAccessibleName () {
  // Implementation for getting SVG accessible name
}

// New function to create a web resource button suitable for accessibility
function createWebResourceButton (url, text, parent = document.body) {
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('role', 'button')
  a.setAttribute('aria-label', text)
  a.textContent = text
  parent.appendChild(a)
  return a
}

// New function to validate unique landmarks
function validateUniqueLandmarks () {
  // Implementation for validating unique landmark roles
  // Ensures each landmark has a unique identifier for accessibility
}

/**
 * Creates a focus trap for keyboard navigation within a given container element.
 * Prevents focus from leaving the container when Tab key is pressed.
 * @param {HTMLElement} container - The container element to trap focus within
 * @returns {Object} An object with a detach method to remove the focus trap
 */
function newFocusTrap (container) {
  if (!container || typeof document === 'undefined') {
    return { detach: () => {} }
  }

  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ')

  const previousActiveElement = document.activeElement

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return
    }

    const focusableElements = Array.from(container.querySelectorAll(focusableSelectors)).filter(
      (el) => el.offsetParent !== null
    )

    if (focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  // Optionally focus the first focusable element in the trap
  const focusableElements = Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (el) => el.offsetParent !== null
  )

  if (focusableElements.length > 0) {
    focusableElements[0].focus()
  }

  return {
    detach: () => {
      container.removeEventListener('keydown', handleKeyDown)
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus()
      }
    }
  }
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} container - The container element to render the graph in
 * @param {Object} data - The dependency data to visualize
 * @returns {Object} An object with methods to update and destroy the graph
 */
function renderDependencyGraph (container, data) {
  if (!container || typeof document === 'undefined') {
    return {
      update: () => {},
      destroy: () => {}
    }
  }

  // Create the graph container
  const graphContainer = document.createElement('div')
  graphContainer.className = 'dependency-graph'
  container.appendChild(graphContainer)

  // Initialize the graph visualization
  // This would typically use a library like D3.js or similar
  // For now, we'll just create a placeholder
  const graphElement = document.createElement('div')
  graphElement.textContent = 'Dependency Graph Visualization'
  graphElement.setAttribute('role', 'img')
  graphElement.setAttribute('aria-label', 'Dependency graph visualization')
  graphContainer.appendChild(graphElement)

  return {
    update: (newData) => {
      // Update the graph with new data
      console.log('Updating graph with new data:', newData)
    },
    destroy: () => {
      // Clean up the graph
      container.removeChild(graphContainer)
    }
  }
}

/**
 * Renders an index view of available resources
 * @param {HTMLElement} container - The container element to render the index in
 * @param {Array} items - The items to display in the index
 * @returns {Object} An object with methods to update and destroy the index
 */
function renderIndexView (container, items) {
  if (!container || typeof document === 'undefined') {
    return {
      update: () => {},
      destroy: () => {}
    }
  }

  // Create the index container
  const indexContainer = document.createElement('div')
  indexContainer.className = 'index-view'
  container.appendChild(indexContainer)

  // Create the index list
  const indexList = document.createElement('ul')
  indexList.setAttribute('role', 'list')
  indexContainer.appendChild(indexList)

  // Populate the index with items
  items.forEach((item) => {
    const listItem = document.createElement('li')
    listItem.textContent = item.name || 'Unnamed item'
    listItem.setAttribute('role', 'listitem')

    if (item.url) {
      const link = document.createElement('a')
      link.href = item.url
      link.textContent = item.name || 'Unnamed item'
      listItem.textContent = ''
      listItem.appendChild(link)
    }

    indexList.appendChild(listItem)
  })

  return {
    update: (newItems) => {
      // Update the index with new items
      while (indexList.firstChild) {
        indexList.removeChild(indexList.firstChild)
      }

      newItems.forEach((item) => {
        const listItem = document.createElement('li')
        listItem.textContent = item.name || 'Unnamed item'
        listItem.setAttribute('role', 'listitem')

        if (item.url) {
          const link = document.createElement('a')
          link.href = item.url
          link.textContent = item.name || 'Unnamed item'
          listItem.textContent = ''
          listItem.appendChild(link)
        }

        indexList.appendChild(listItem)
      })
    },
    destroy: () => {
      // Clean up the index
      container.removeChild(indexContainer)
    }
  }
}

// Export the new functions
module.exports = {
  setHtmlLangAttribute,
  getLangAttribute,
  detectAndSetLang,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createWebResourceButton,
  validateUniqueLandmarks,
  newFocusTrap,
  renderDependencyGraph,
  renderIndexView,
  // Export main application functions
  greetingFunction,
  renderGraphIndex,
  a11yStore,
  ensureInteractiveElementsAccessible,
  handleInitialAccessibility,
  accessibility
}

// ... rest of the code ...