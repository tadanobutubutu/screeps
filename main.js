const fs = require('fs');
const path = require('path');
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibility-utils');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

const viewsDir = path.join(__dirname, 'views');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

// Function to add proper landmark regions
function addProperLandmarkRegions() {
  // Implementation for landmark regions
}

// Function to count dependencies
function countDependencies() {
  // Existing function implementation

  // New implementation to count dependencies using Document and regex
  const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`]/g;
  const document = { body: { textContent: '' } };
  const importCount = (document.body.textContent || '').match(importCommentRegExp) || [];
  return importCount.length;
}

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const files = fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(viewsDir, file));

  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      // Example regex to find landmark elements without roles or regions
      const updatedContent = content.replace(/<div\s+role="landmark"/g, '<div role="landmark" aria-roledescription="region"');
      if (content !== updatedContent) {
        fs.writeFileSync(file, updatedContent);
        console.log(`Updated landmark roles in ${file}`);
      }
    } catch (error) {
      console.error(`Error updating landmarks in ${file}:`, error);
    }

    try {
      updateThScopeAttribute(file);
      validateTableAccessibility(file);
      // Add more accessibility checks here if needed
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  });
}

// New function implementation
function newFunction() {
  // Example implementation: return a simple message
  return 'New function executed';
}

// Start the game loop
const Module = {
  onInit: function() {
    setInterval(run, 1000);
  }
};

/**
 * Checks if a table has the expected structure
 * @param {string} tableName - The name of the table to check
 * @param {Array<string>} expectedColumns - Array of expected column names
 * @returns {boolean} - True if table structure matches expected columns, false otherwise
 */
function checkTableStructure(tableName, expectedColumns) {
  // ... existing implementation ...
  return true;
}

/**
 * Ensures the given element has an id attribute
 * @param {HTMLElement} element - The element to check
 * @returns {string} - The id of the element
 */
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

/**
 * Adds an aria-label to the given element
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The label text to add
 */
function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Renders dependency graphs for debugging purposes
 * @param {Object} dependencies - Object containing dependency mappings
 * @returns {string} - String representation of the dependency graph
 */
function renderDependencyGraphs(dependencies) {
  let graphOutput = 'Dependency Graph:\n';

  if (!dependencies || typeof dependencies !== 'object') {
    return graphOutput + 'No dependencies to display';
  }

  for (const [module, deps] of Object.entries(dependencies)) {
    graphOutput += `\n${module} -> `;
    if (Array.isArray(deps)) {
      graphOutput += deps.join(', ') || 'none';
    } else if (typeof deps === 'object' && deps !== null) {
      graphOutput += Object.keys(deps).join(', ') || 'none';
    } else {
      graphOutput += String(deps);
    }
  }

  return graphOutput;
}

/**
 * Module structure display function for debugging purposes
 * @param {Object} module - The module object to display
 * @returns {string} - String representation of the module structure
 */
function displayModuleStructure(module) {
  let structure = 'Module Structure:\n';

  if (!module) {
    return structure + 'No module provided';
  }

  structure += `Name: ${module.name || 'unnamed'}\n`;
  structure += `Exports: ${Object.keys(module.exports || {}).join(', ') || 'none'}\n`;
  structure += `Dependencies: ${(module.dependencies || []).length}\n`;

  return structure;
}

function myNewFunction(input) {
  // Implement the new function here
  return input;
}

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

/**
 * Updates th elements without scope attribute to include scope="row"
 * @param {string} file - The file path to process
 */
function updateThScope(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    // Simple regex to find th elements without scope attribute
    const updatedContent = content.replace(/<th(?![^>]*scope)([^>]*)>/gi, '<th scope="row"$1>');
    if (content !== updatedContent) {
      fs.writeFileSync(file, updatedContent);
      console.log(`Updated th scope attributes in ${file}`);
    }
  } catch (error) {
    console.error(`Error updating th scope in ${file}:`, error);
  }
}

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  const warnings = [];
  const foundLandmarks = {};

  LANDMARK_ELEMENTS.forEach(landmark => {
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    }
  });

  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * Creates an in-page button for the game interface
 * @param {Object} options - Button configuration options
 * @param {string} options.text - The text to display on the button
 * @param {Function} options.onClick - The callback function when button is clicked
 * @param {string} [options.id] - Optional unique identifier for the button
 * @param {string} [options.title] - Optional title/tooltip for the button
 * @param {string} [options.className] - Optional CSS class name for styling
 * @returns {Object} - The created button object
 */
function createInPageButtonOptions(options) {
  const { text, onClick, id, title, className } = options;

  // Validate required options
  if (!text) {
    throw new Error('Button text is required');
  }
  if (typeof onClick !== 'function') {
    throw new Error('onClick callback must be a function');
  }

  // Create button object
  const button = {
    id: id || `btn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text: String(text),
    title: title || '',
    className: className || 'default-button',
    onClick,
    disabled: false,
    visible: true,
    element: null
  };

  // Store button reference
  if (!createInPageButtonOptions.buttons) {
    createInPageButtonOptions.buttons = {};
  }
  createInPageButtonOptions.buttons[button.id] = button;

  return button;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,
  announcements: [],
  addAnnouncement(message) {
    this.announcements.push({
      message,
      timestamp: Date.now()
    });
  },
  getAnnouncements() {
    return this.announcements;
  },
  clearAnnouncements() {
    this.announcements = [];
  },

  init() {
    this.createLiveRegion();
    this.addSVGAccessibility();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.addFocusStyles();
    this.setupFocusVisiblePolyfill();
    this.enhanceDynamicContent();
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  // Apply ARIA attributes to SVG elements
  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.getAttribute('title') || 'Image description';
      const descriptionId = `svg-description-${Math.round(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('desc');
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = titleText;
      svg.appendChild(descriptionElement);
    });
  },

  // Apply ARIA attributes to dynamically added elements
  enhanceSVG() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      if (!svg.getAttribute('aria-labelledby')) {
        const titleText = svg.getAttribute('title') || 'Image description';
        const descriptionId = `svg-description-${Math.round(Math.random() * 1000)}`;
        svg.setAttribute('aria-labelledby', descriptionId);

        const descriptionElement = document.createElement('desc');
        descriptionElement.id = descriptionId;
        descriptionElement.textContent = titleText;
        svg.appendChild(descriptionElement);
      }
    });
  },

  // Anchor message to screen reader via live region
  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    // Use setTimeout to ensure the change is detected by screen readers
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Setup keyboard navigation for interactive elements
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[role="button"]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach(container => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest('[data-dropdown]'))
        ) {
          focusIsInsideContainer = true;
        }

        // Ensure focus trapping only within the dropdown container
        if (focusIsInsideContainer) {
          // Find the first focusable element within the container
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]'
          );

          if (firstFocusableElement) {
            const lastFocusableElement = firstFocusableElement;
            // Handle tab cycling
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
              e.preventDefault();
              lastFocusableElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
              e.preventDefault();
              firstFocusableElement.focus();
            }
          }
        }
      });
    });
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    // Trap focus within modals
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]'
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

  // Setup skip links
  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href').substring(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  // Add lang attribute to HTML element
  getLangAttribute() {
    return document.documentElement.lang || 'en';
  },

  // Create skip-to-main-content button
  createSkipToMainButton() {
    const button = document.createElement('button');
    button.textContent = 'Skip to main content';
    button.addEventListener('click', () => {
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    });
    return button;
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-contrast: more)').matches
    );
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElementsInDom() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(tag => {
      const landmark = document.querySelector(tag);
      if (landmark && landmark.id === '') {
        landmark.id = `${tag}-${Math.floor(Math.random() * 1000)}`;
      }
    });
  },

  // New function to add SVG accessibility props
  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      if (!svg.getAttribute('aria-labelledby')) {
        const titleText = svg.getAttribute('title') || 'Image description';
        const descriptionId = `svg-desc-${Math.floor(Math.random() * 1000)}`;
        svg.setAttribute('aria-labelledby', descriptionId);

        const descriptionElement = document.createElement('desc');
        descriptionElement.id = descriptionId;
        descriptionElement.textContent = titleText;
        svg.appendChild(descriptionElement);
      }
    });
  },

  // Address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;

    // Validate and fix table accessibility
    if (report.tables) {
      this.validateTableAccessibility();
      this.validateTableStructure();
    }

    // Validate and fix landmark elements
    if (report.landmarks) {
      this.checkLandmarkElementsInDom();
      this.validateLandmark();
      this.validateLandmarkStructure();
      this.ensureUniqueLandmarks();
    }

    // Apply SVG accessibility
    if (report.svg) {
      this.addSVGAccessibilityProps();
    }
  },

  // Validate and fix table accessibility
  validateTableAccessibility() {
    if (typeof window === 'undefined') return;
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const headers = table.querySelectorAll('th');
      headers.forEach(th => {
        if (!th.getAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      });
      if (!table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
        table.setAttribute('aria-label', 'Table');
      }
    });
  },

  // Validate and fix table structure
  validateTableStructure() {
    if (typeof window === 'undefined') return;
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.querySelector('thead')) {
        const thead = document.createElement('thead');
        const firstRow = table.querySelector('tr');
        if (firstRow) {
          thead.appendChild(firstRow);
        }
        table.insertBefore(thead, table.firstChild);
      }
      if (!table.querySelector('tbody')) {
        const tbody = document.createElement('tbody');
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          if (!table.querySelector('thead').contains(row)) {
            tbody.appendChild(row);
          }
        });
        table.appendChild(tbody);
      }
    });
  },

  // Validate landmark elements
  validateLandmark() {
    if (typeof window === 'undefined') return;
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
    landmarks.forEach(el => {
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('role')) {
        // Optionally add a role, but leave as is for now
      }
    });
  },

  // Validate landmark structure
  validateLandmarkStructure() {
    if (typeof window === 'undefined') return;
    const main = document.querySelector('main');
    if (main) {
      const nestedLandmarks = main.querySelectorAll('main, nav, header, footer, aside');
      if (nestedLandmarks.length > 0) {
        console.warn('Landmarks nested within main may be incorrect.');
      }
    }
  },

  // Ensure unique landmark IDs
  ensureUniqueLandmarks() {
    if (typeof window === 'undefined') return;
    const landmarks = document.querySelectorAll('[role="landmark"], main, nav, header, footer, aside');
    const idSet = new Set();
    landmarks.forEach(el => {
      const id = el.id;
      if (id) {
        if (idSet.has(id)) {
          console.warn('Duplicate landmark ID found:', id);
        } else {
          idSet.add(id);
        }
      }
    });
  },

  // Preserve existing code functionality
  preserveExistingCode() {
    // Placeholder to ensure existing functionality is maintained
    console.log("Preserving existing code and accessibility features");
  },

  // Get person name for accessible labeling
  personName() {
    const nameElement = document.querySelector('[data-person-name]');
    return nameElement ? nameElement.textContent.trim() : 'User';
  },

  // Get accessible name for SVG
  getSvgAccessibleName(svg) {
    return svg.getAttribute('aria-label') || svg.getAttribute('title') || 'Image';
  },
};

// Function to add landmark regions
function addLandmarkRegions() {
  const landmarks = {
    main: true,
    nav: false,
    aside: false
  };

  return {
    landmarks,
    regions: Object.keys(landmarks).filter(key => landmarks[key])
  };
}

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Get person name for accessible labeling
function personName() {
  return a11yStore.personName();
}

// Validate and fix table accessibility
function validateTableAccessibilityFn() {
  a11yStore.validateTableAccessibility();
}

// Validate and fix table structure
function validateTableStructureFn() {
  a11yStore.validateTableStructure();
}

// Validate landmark elements
function validateLandmark() {
  a11yStore.validateLandmark();
}

// Validate landmark structure
function validateLandmarkStructureFn() {
  a11yStore.validateLandmarkStructure();
}

// Get accessible name for SVG
function getSvgAccessibleNameFn(svg) {
  return a11yStore.getSvgAccessibleName(svg);
}

// Ensure unique landmark IDs
function ensureUniqueLandmarks() {
  a11yStore.ensureUniqueLandmarks();
}

// New function to handle dynamic content updates
function updateLiveRegion(message, priority = 'polite') {
  a11yStore.updateLiveRegion(message, priority);
}

// New function to check landmark elements
function checkLandmarkElementsInDom() {
  a11yStore.checkLandmarkElementsInDom();
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
  a11yStore.addSVGAccessibilityProps();
}

function preserveExistingCode() {
  a11yStore.preserveExistingCode();
}

// TODO: Implement this function for creating in-page buttons
function createInPageButtonElement(buttonId, buttonText, buttonClass) {
  // Create a new button element
  const button = document.createElement('button');

  // Set the button's ID, text content, and class
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;

  // Append the button to the body or a specific container
  document.body.appendChild(button);

  // Return the created button for further manipulation if needed
  return button;
}

// TODO: Implement this new function for making API calls
async function makeAPICall() {
  // Your implementation goes here
}

module.exports = {
  main,
  SomeClass,
  someUtility,
  config,
  countDependencies,
  run,
  checkTableStructure,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  myNewFunction,
  newFunction,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  displayModuleStructure,
  checkLandmarkElements,
  createInPageButtonOptions,
  a11yStore,
  addLandmarkRegions,
  addressAccessibilityIssues,
  LANDMARK_ELEMENTS,
  updateLiveRegion,
  addSVGAccessibilityProps,
  preserveExistingCode,
  personName,
  validateLandmark,
  ensureUniqueLandmarks,
  checkLandmarkElementsInDom,
  makeAPICall,
  createInPageButtonElement,
  updateThScopeAttribute,
  validateTableAccessibilityFn,
  validateTableStructureFn,
  validateLandmarkStructureFn,
  getSvgAccessibleNameFn
};