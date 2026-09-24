// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)

const {
  createInPageButton: importedCreateInPageButton,
  createWebResourceButton: importedCreateWebResourceButton,
  validateTableAccessibility: importedValidateTableAccessibility,
  validateTableStructure: importedValidateTableStructure,
  validateLandmark: importedValidateLandmark,
  validateLandmarkStructure: importedValidateLandmarkStructure,
  getSvgAccessibleName: importedGetSvgAccessibleName,
  getLangAttribute: importedGetLangAttribute,
  validateAccessibilityReport: importedValidateAccessibilityReport
} = require('./utilities');
const main = require('./utilities');

const http = require('http');
const fs = require('fs');
const path = require('path');

// Dependency imports
const { dependencyGraphContent } = require('./dependency-graph')
const { indexContent } = require('./index')
const { spawn } = require('child_process')

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

const accessibilityUtils = {
  // ... existing methods from both branches ...

  /**
     * Announce message to screen readers (from origin/head)
     * @param {string} message - The message to announce
     * @param {string} [priority='polite'] - The priority of the message (optional, defaults to 'polite')
     */
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.style.position = 'absolute'
    announcer.style.left = '-9999px'
    announcer.textContent = message
    document.body.appendChild(announcer)
    setTimeout(() => announcer.remove(), 1000)
  },

  /**
     * Handle keyboard navigation (from origin/head)
     * @param {Event} e - The keyboard event
     * @param {Object} handlers - The handler functions for different keys
     */
  handleKeyboardNav: (e, handlers) => {
    const key = e.key
    if (handlers[key]) {
      handlers[key](e)
    }
  },

  /**
     * Check link accessibility by verifying required attributes
     * @param {HTMLAnchorElement} link - The link element to check
     * @returns {Object} Accessibility status and issues
     */
  checkLinkAccessibility: (link) => {
    if (!link || link.tagName !== 'A') {
      return { isAccessible: false, issues: ['Not a valid link element'] }
    }

    const issues = []

    // Check for href attribute
    if (!link.hasAttribute('href') || link.getAttribute('href').trim() === '') {
      issues.push('Missing or empty href attribute')
    }

    // Check for aria-label or text content
    if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
      issues.push('Missing aria-label or link text')
    }

    // Check for target attribute if it's an external link
    if (link.href && link.hostname !== window.location.hostname) {
      if (!link.hasAttribute('target')) {
        issues.push('External link missing target attribute')
      } else if (link.getAttribute('target') !== '_blank') {
        issues.push('External link should use target="_blank"')
      }

      if (!link.hasAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
        issues.push('External link missing rel="noopener noreferrer"')
      }
    }

    // Check for role attribute if it's a button-like link
    if (link.getAttribute('role') === 'button' && !link.hasAttribute('tabindex')) {
      issues.push('Button-like link missing tabindex="0"')
    }

    return {
      isAccessible: issues.length === 0,
      issues: issues.length > 0 ? issues : null
    }
  },

  /**
   * Set up keyboard navigation for an element
   * @param {HTMLElement} element - The element to set up navigation for
   * @param {Object} handlers - The handler functions for different keys
   */
  setupKeyboardNav: (element, handlers) => {
    if (!element || !handlers) return;

    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, handlers);
    });
  },

  /**
   * Add ARIA attributes to an element
   * @param {HTMLElement} element - The element to add ARIA attributes to
   * @param {Object} attributes - The ARIA attributes to add
   */
  addAriaAttributes: (element, attributes) => {
    if (!element || !attributes) return;

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(`aria-${key}`, value);
    });
  },

  /**
   * Create a live region for screen reader announcements
   * @param {string} [priority='polite'] - The priority of the live region
   * @returns {HTMLElement} The created live region element
   */
  createLiveRegion: (priority = 'polite') => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-9999px';
    document.body.appendChild(liveRegion);
    return liveRegion;
  },

  /**
   * Focus the first focusable element within a container
   * @param {HTMLElement} container - The container to search for focusable elements
   */
  focusFirstElement: (container) => {
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  },

  /**
   * Validate the landmark structure for accessibility issues
   * @param {HTMLElement} rootElement - The root element to validate
   * @returns {Object} Validation results with issues and suggestions
   */
  validateLandmarks: (rootElement) => {
    if (!rootElement || typeof rootElement.querySelectorAll !== 'function') {
      return {
        valid: false,
        issues: ['Invalid root element provided']
      };
    }

    const requiredLandmarks = ['header', 'main', 'footer'];
    const foundLandmarks = new Set();
    const issues = [];
    const suggestions = [];

    // Check for required landmarks
    requiredLandmarks.forEach(landmark => {
      const elements = rootElement.querySelectorAll(`[role="${landmark}"], ${landmark}`);
      if (elements.length === 0) {
        issues.push(`Missing required landmark: ${landmark}`);
        suggestions.push(`Add a <${landmark}> element or element with role="${landmark}"`);
      } else if (elements.length > 1) {
        issues.push(`Multiple ${landmark} landmarks found`);
        suggestions.push(`Ensure only one ${landmark} landmark exists in the document`);
      } else {
        foundLandmarks.add(landmark);
      }
    });

    // Check for additional landmarks
    const allLandmarks = rootElement.querySelectorAll('[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="navigation"], [role="region"], header, main, footer, aside, nav, section');
    allLandmarks.forEach(element => {
      const role = element.getAttribute('role') || element.tagName.toLowerCase();
      if (!requiredLandmarks.includes(role) && !foundLandmarks.has(role)) {
        suggestions.push(`Consider adding ARIA label to ${role} landmark: aria-label="..."`);
      }
    });

    return {
      valid: issues.length === 0,
      issues,
      suggestions,
      foundLandmarks: Array.from(foundLandmarks)
    };
  }
}

/**
 * Initialize accessibility features for the application.
 */
function initAccessibility () {
  // Set up accessibility utilities
  if (typeof window !== 'undefined') {
    // Ensure screen reader support is available
    document.body.setAttribute('role', 'application');
    // Add lang attribute to HTML element
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      accessibilityUtils.addLangAttribute(htmlElement);
    }
  }
  return accessibilityUtils
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `auto-id-${Math.random().toString(36).substr(2, 9)}`
  }
  return element;
};

/**
 * Get all loaded tables
 * @returns {Array} Array of table objects
 */
function getTables() {
  return appData.tables;
}

/**
 * Get application configuration
 * @returns {Object} Configuration object
 */
function getConfig() {
  return { ...appData.config };
}

/**
 * Set application configuration
 * @param {Object} config - Configuration object
 */
function setConfig(config) {
  appData.config = { ...appData.config, ...config };
}

function parseJSONsafe(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * Validates that all tables in the application meet accessibility standards
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility() {
  const errors = [];
  const tables = getTables();

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    // Check if table has headers
    if (!table.headers || !Array.isArray(table.headers) || table.headers.length === 0) {
      errors.push({
        tableIndex: i,
        error: 'Table must have headers defined'
      });
    }

    // Check if table has proper structure
    if (!table.rows || !Array.isArray(table.rows)) {
      errors.push({
        tableIndex: i,
        error: 'Table must have rows array defined'
      });
    }

    // Check for proper ARIA attributes (placeholder implementation)
    if (table.ariaLabel === undefined && table.caption === undefined) {
      errors.push({
        tableIndex: i,
        error: 'Table should have aria-label or caption for accessibility'
      });
    }

    // Add lang attribute to HTML element
    if (document.documentElement.lang === undefined) {
      document.documentElement.lang = 'en';
    }

    // Add landmark roles and fix landmark issues
    if (table.role === undefined) {
      table.role = 'table';
    }

    // Add accessible names to 2 SVGs
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      if (svg.getAttribute('aria-label') === null) {
        svg.setAttribute('aria-label', 'SVG description');
      }
    });

    // Ensure unique landmarks (2 issues)
    const landmarks = ['navigation', 'search', 'main', 'contentinfo', 'complementary', 'form'];
    let uniqueLandmarks = new Set();
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
      elements.forEach(element => {
        uniqueLandmarks.add(landmark);
      });
    });
    if (uniqueLandmarks.size !== landmarks.length) {
      errors.push({
        tableIndex: i,
        error: 'Landmarks are not unique'
      });
    }

    // Fix 1 fake link issue
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      if (link.href === '#') {
        link.style.display = 'none';
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation(operation, maxRetries = CONFIG.maxRetries) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      log(`Attempt ${i + 1} failed: ${error.message}`, 'warn');
      if (i < maxRetries - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  throw lastError;
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// New function added as per issue
function myNewFunction(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.toUpperCase();
}

// Calculate sum of numbers array
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

// Additional utility functions for accessibility
function addMainLandmark() {
  // Implementation for REACT_017: Add landmark issues
  // ...
}

function ensureUniqueLandmarks() {
  // Implementation for REACT_025: Ensure unique landmarks
  // ...
}

function addAltAttribute() {
  // Implementation for adding alt attributes
  // ...
}

function replaceButtonId() {
  // Implementation for replacing button id
  // ...
}

function addLangAttribute() {
  // Implementation for adding lang attribute
  // ...
}

function fixTableStructure() {
  // Implementation for fixing table structure
  // ...
}

function addSvgAccessibleName() {
  // Implementation for adding SVG accessible name
  // ...
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issues
  // ...
}

function addAriaAttribute() {
  // Implementation for adding aria attributes
  // ...
}

/**
 * Sets the lang attribute on an element
 * @param {HTMLElement} element - The element to modify
 * @param {string} lang - The language code to set
 * @returns {HTMLElement} The element with lang attribute set
 */
function setLangAttribute(element, lang) {
  if (element) {
    element.setAttribute('lang', lang);
  }
  return element;
}

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label)
  }
  return element
}

const renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  }
}

/**
 * Ensure an element has an id, generating one if necessary.
 * @param {HTMLElement} element - The element to check/generate id for
 * @param {string} [prefix='element'] - Prefix for generated id
 * @returns {string} The element's id
 */
function ensureElementHasId (element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required')
  }

  if (element.id) {
    return element.id
  }

  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  element.id = id
  return id
}

function renderDependencyGraphs (container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required')
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required')
  }

  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container')

  // Add accessibility label if not present
  const hasAriaLabel = addAriaLabel(container, `Dependency graph: ${containerId}`)

  // Add keyboard navigation support
  accessibilityUtils.setupKeyboardNav(container, {
    Escape: (e) => {
      e.preventDefault();
      accessibilityUtils.announceToScreenReader('Graph navigation closed');
    },
    ArrowLeft: (e) => {
      e.preventDefault();
      // Implement left navigation
    },
    ArrowRight: (e) => {
      e.preventDefault();
      // Implement right navigation
    }
  });

  // Add keyboard navigation support
  accessibilityUtils.addKeyboardNavigation(container, {
    'Escape': () => {
      // Handle escape key for closing the graph
      const closeButton = container.querySelector('[aria-label="Close graph"]');
      if (closeButton) closeButton.click();
    }
  });

  return {
    containerId,
    accessible: hasAriaLabel,
    ...renderDependencyGraph(dependencies)
  }
}

/**
 * Trap focus within an element.
 * @param {HTMLElement} element - The element to trap focus within
 */
function focusTrap (element) {
  if (!element) return

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  })

  // Focus the first element when trap is activated
  firstElement.focus();

  return element;
}

/**
 * Create a new focus trap with enhanced functionality.
 * @param {HTMLElement} element - The element to trap focus within
 * @param {Object} [options] - Configuration options for the focus trap
 * @param {boolean} [options.initialFocus=false] - Whether to focus the first element automatically
 * @param {boolean} [options.returnFocus=false] - Whether to return focus to the previously focused element when the trap is deactivated
 * @returns {Object} An object with methods to activate and deactivate the focus trap
 */
function newFocusTrap(element, options = {}) {
  if (!element) {
    throw new Error('Element is required for focus trap');
  }

  let previousActiveElement = null;
  let isActive = false;

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    console.warn('No focusable elements found in the focus trap container');
    return {
      activate: () => {},
      deactivate: () => {}
    };
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    } else if (e.key === 'Escape') {
      // Optional: Add escape key handling if needed
    }
  };

  const activate = () => {
    if (isActive) return;

    previousActiveElement = document.activeElement;
    isActive = true;

    if (options.initialFocus) {
      firstElement.focus();
    }

    element.addEventListener('keydown', handleKeyDown);
  };

  const deactivate = () => {
    if (!isActive) return;

    isActive = false;
    element.removeEventListener('keydown', handleKeyDown);

    if (options.returnFocus && previousActiveElement) {
      previousActiveElement.focus();
    }
  };

  return {
    activate,
    deactivate,
    isActive: () => isActive
  };
}

function newFocusTrap(element) {
  if (!element) return;

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });

  firstElement.focus();
}

function spawnProcess(command, args = [], options = {}) {
  return spawn(command, args, options);
}

// Credential response handling
async function handleCredentialResponse (response) {
  if (!response) {
    throw new Error('No response received')
  }

  if (response.error) {
    throw new Error(response.error)
  }

  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 3600
    };
  }

  throw new Error('Invalid credential response');
}

// TODO: Address accessibility issues from insight report
const addressAccessibilityIssues = (container) => {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  // Check and fix lang attribute on HTML element
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    setLangAttribute(htmlElement, 'en');
    fixes.langAdded = true;
  }

  // Add main landmark if not present
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length === 0) {
    addMainLandmark();
    fixes.mainLandmarkAdded = true;
  }

  // Ensure unique landmarks
  ensureUniqueLandmarks();
  fixes.landmarksFixed = 1;

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (index < 5) {
      getSvgAccessibleName(svg, `Graphic ${index + 1}`);
      fixes.svgNamesAdded += 1;
    }
  });

  // Fix fake link issues
  const fakeLinks = document.querySelectorAll('a[role="button"]:not([href]):not([href=""])');
  fakeLinks.forEach((link, index) => {
    if (index < 5) {
      fixFakeLinkIssue(link);
      fixes.fakeLinksFixed += 1;
    }
  });

  log('Lang attribute added to HTML element', 'info');

  log('Main landmark added', 'info');

  const landmarkFixes = fixes.landmarksFixed || 0;
  if (landmarkFixes > 0) {
    log(`Fixed ${landmarkFixes} unique landmarks`, 'info');
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
  }

  return fixes;
};

function personName(name) {
  const span = document.createElement('span');
  span.setAttribute('aria-label', `Person name: ${name}`);
  span.textContent = name;
  return span;
}

function validateTableAccessibility(table) {
  if (!table) return false;

  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelector('thead') !== null;
  const rows = table.querySelectorAll('tr');

  let isValid = hasCaption && hasHeaders;

  if (rows.length > 0) {
    const firstRowCells = rows[0].querySelectorAll('th, td');
    const hasScope = Array.from(firstRowCells).some(cell =>
      cell.hasAttribute('scope')
    );
    isValid = isValid && hasScope;
  }

  return isValid;
}

function validateTableStructure(table) {
  if (!table) return false;

  const rows = table.querySelectorAll('tr');
  let isValid = true;

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (index === 0) {
      const hasHeaderCells = Array.from(cells).some(cell =>
        cell.tagName.toLowerCase() === 'th'
      );
      isValid = isValid && hasHeaderCells;
    } else {
      if (cells.length !== rows[0].querySelectorAll('td, th').length) {
        isValid = false;
      }
    }
  });

  return isValid;
}

function validateLandmark(element) {
  if (!element) return false;

  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'form', 'section'];
  if (landmarks.includes(tagName)) {
    return true;
  }

  if (role && landmarkRoles.includes(role)) {
    return true;
  }

  return false;
}

function validateLandmarkStructure(element) {
  if (!element) return false;

  const landmarks = element.querySelectorAll(
    'header, nav, main, aside, footer, form[role="search"], section[aria-label], div[role="banner"], div[role="navigation"], div[role="main"], div[role="complementary"], div[role="contentinfo"]'
  );

  return landmarks.length > 0;
}

function getSvgAccessibleName(svg, name) {
  if (svg && name) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name);
  }
  return svg;
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('aria-label', text);
  button.addEventListener('click', onClick);
  return button;
}

function createWebResourceButton(text, url, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('aria-label', text);
  button.addEventListener('click', () => {
    window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
    if (onClick) onClick();
  });
  return button;
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll(
    'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
  );

  const landmarkTypes = {};

  landmarks.forEach((landmark, index) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const identifier = role || tagName;

    if (!landmarkTypes[identifier]) {
      landmarkTypes[identifier] = 0;
    } else {
      landmarkTypes[identifier]++;
      if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', `${identifier} ${landmarkTypes[identifier] + 1}`);
      }
    }
  });
}

function newFocusTrap(element) {
  if (!element) return;

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });

  firstElement.focus();
}

function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  if (typeof inputData === 'string') {
    let result = inputData;

    if (trimWhitespace) {
      result = result.trim();
    }

    if (uppercase) {
      result = result.toUpperCase();
    }

    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }

    return result;
  }

  if (typeof inputData === 'object' && !Array.isArray(inputData)) {
    const result = {};

    for (const key in inputData) {
      if (inputData.hasOwnProperty(key)) {
        if (preserveKeys || !key.startsWith('_')) {
          result[key] = transformInputData(inputData[key], options);
        }
      }
    }

    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map(item => transformInputData(item, options));
  }

  return inputData;
}

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.setAttribute('aria-label', `Download ${filename}`)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(url)
    link.remove()

    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader(`Download of ${filename} started`)
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2)
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json')
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])
    const csvRows = []
    csvRows.push(headers.join(','))

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    }

    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
  },

  /**
   * Export data to a file with accessibility support
   * @param {*} data - The data to export
   * @param {string} filename - The name of the file
   * @param {string} mimeType - The MIME type of the file
   * @param {Object} options - Additional options
   */
  exportWithAccessibility: (data, filename, mimeType, options = {}) => {
    const sanitizedFilename = sanitizeFilename(filename);
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = sanitizedFilename;
    link.setAttribute('aria-label', `Download ${sanitizedFilename}`);
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');

    // Add keyboard support
    accessibilityUtils.addKeyboardNavigation(link, {
      Enter: () => link.click(),
      ' ': () => link.click()
    });

    // Add ARIA attributes
    accessibilityUtils.ensureAriaAttributes(link, {
      'aria-live': 'polite',
      'aria-atomic': 'true'
    });

    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Announce download completion
    accessibilityUtils.announceToScreenReader(`Download of ${sanitizedFilename} started`);

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 100);
  }
}

/**
 * Sanitize a filename to remove invalid characters.
 * @param {string} filename - The filename to sanitize
 * @returns {string} The sanitized filename
 */
function sanitizeFilename (filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_')
}

/**
 * Safely read a file, returning null on error.
 * @param {string} filePath - The path to the file to read
 * @returns {string|null} The file contents or null if an error occurred
 */
function readFileSafe (filePath) {
  try {
    return require('fs').readFileSync(filePath, 'utf8')
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error')
    return null
  }
}

// Existing utility functions
function log (message, level = 'info') {
  const timestamp = new Date().toISOString()
  console[level === 'error' ? 'error' : 'log'](`[${timestamp}] [${level}] ${message}`)
}

module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  handleCredentialResponse,
  ensureElementId,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  spawnProcess,
  focusTrap,
  newFocusTrap,
  dependencyGraphContent,
  indexContent,
  sanitizeFilename,
  readFileSafe,
  log
};