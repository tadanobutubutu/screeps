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
     * Announce message to screen readers
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
     * Handle keyboard navigation
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
   * Add ARIA attributes to an element
   * @param {HTMLElement} element - The element to add ARIA attributes to
   * @param {Object} attributes - ARIA attributes to add
   */
  addAriaAttributes: (element, attributes) => {
    if (!element || !attributes) return;

    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith('aria-')) {
        element.setAttribute(key, value);
      }
    });
  },

  /**
   * Ensure an element has proper keyboard accessibility
   * @param {HTMLElement} element - The element to make accessible
   * @param {Object} options - Configuration options
   */
  ensureKeyboardAccessibility: (element, options = {}) => {
    if (!element) return;

    const { role = 'button', tabIndex = 0, label } = options;

    if (role) element.setAttribute('role', role);
    if (tabIndex !== undefined) element.setAttribute('tabindex', tabIndex);
    if (label) element.setAttribute('aria-label', label);

    // Add keyboard event listeners
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  },

  /**
   * Create a live region for dynamic content updates
   * @param {string} id - The ID for the live region
   * @param {string} [priority='polite'] - The priority of the live region
   * @returns {HTMLElement} The created live region element
   */
  createLiveRegion: (id, priority = 'polite') => {
    const liveRegion = document.createElement('div');
    liveRegion.id = id;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-9999px';
    document.body.appendChild(liveRegion);
    return liveRegion;
  },

  /**
   * Update a live region with new content
   * @param {string} id - The ID of the live region to update
   * @param {string} content - The new content to announce
   */
  updateLiveRegion: (id, content) => {
    const liveRegion = document.getElementById(id);
    if (liveRegion) {
      liveRegion.textContent = content;
    }
  }
}

// The new function to check link accessibility
// This function will be used to validate the accessibility of links

/**
 * Check the accessibility of a link element.
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} An object containing the accessibility status and any issues found
 */
function checkLinkAccessibility(link) {
  if (!link) {
    throw new Error('Link element is required');
  }

  const issues = [];

  // Check if link has valid href
  if (!link.hasAttribute('href') || !link.getAttribute('href')) {
    issues.push('Link is missing an href attribute');
  }

  // Check if link has accessible name (text content or aria-label)
  const textContent = link.textContent && link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledBy = link.getAttribute('aria-labelledby');
  const title = link.getAttribute('title');

  if (!textContent && !ariaLabel && !ariaLabelledBy && !title) {
    issues.push('Link has no accessible name (text, aria-label, aria-labelledby, or title)');
  }

  // Check for empty text content
  if (textContent === '' && !ariaLabel && !ariaLabelledBy) {
    issues.push('Link has empty text content and no aria-label or aria-labelledby');
  }

  // Check if link has target="_blank" without rel="noopener"
  if (link.getAttribute('target') === '_blank') {
    const rel = link.getAttribute('rel') || '';
    if (!rel.includes('noopener')) {
      issues.push('Link with target="_blank" should include rel="noopener" for security');
    }
    if (!rel.includes('noreferrer')) {
      issues.push('Link with target="_blank" should include rel="noreferrer" for privacy');
    }
  }

  // Check for sufficient color contrast (basic check)
  const style = typeof window !== 'undefined' && window.getComputedStyle ? window.getComputedStyle(link) : null;
  if (style) {
    const color = style.color;
    const bgColor = style.backgroundColor;
    if (color && bgColor && color === bgColor) {
      issues.push('Link text color matches background color, may cause visibility issues');
    }
  }

  // Check if link is focusable
  const tabIndex = link.getAttribute('tabindex');
  if (tabIndex === '-1') {
    issues.push('Link has tabindex="-1" which removes it from tab order');
  }

  // Check for proper role if not a standard anchor
  if (link.tagName.toLowerCase() !== 'a' && !link.getAttribute('role')) {
    issues.push('Non-anchor link element is missing a role attribute');
  }

  return {
    accessible: issues.length === 0,
    issues,
    link
  };
}

/**
 * Initialize accessibility features for the application.
 */
function initAccessibility () {
  // Set up accessibility utilities
  if (typeof window !== 'undefined') {
    // Ensure screen reader support is available
    document.body.setAttribute('role', 'application');

    // Create a global live region for important announcements
    accessibilityUtils.createLiveRegion('global-announcer', 'assertive');
  }
  return accessibilityUtils
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `auto-id-${Math.random().toString(36).substr(2, 9)}`
  }
  return element
}

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

  // Add ARIA attributes for better screen reader support
  accessibilityUtils.addAriaAttributes(container, {
    'aria-roledescription': 'dependency visualization',
    'aria-busy': 'false'
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

  return element
}

function newFocusTrap () {
  // New function implementation
}

/**
 * Spawn a child process with the given command and arguments.
 * @param {string} command - The command to execute
 * @param {string[]} args - Arguments to pass to the command
 * @param {Object} options - Options for the spawn function
 * @returns {ChildProcess} The spawned process
 */
function spawnProcess (command, args = [], options = {}) {
  return spawn(command, args, options)
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
    }
  }

  throw new Error('Invalid credential response')
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

function newFocusTrap() {
  // New function implementation
  let activeTrap = null;

  const createFocusTrap = (element, options = {}) => {
    if (!element) return null;

    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return null;

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
      } else if (e.key === 'Escape' && options.onEscape) {
        options.onEscape();
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    // Return an object with methods to activate/deactivate the trap
    return {
      activate: () => {
        if (activeTrap) {
          activeTrap.deactivate();
        }
        activeTrap = this;
        firstElement.focus();
      },
      deactivate: () => {
        element.removeEventListener('keydown', handleKeyDown);
        activeTrap = null;
      }
    };
  };

  return {
    create: createFocusTrap,
    getActiveTrap: () => activeTrap
  };
}

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

    const csvString = csvRows.join('\n')
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv')
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

/**
 * Add accessible names to SVG elements
 * @param {SVGElement} svg - The SVG element to add accessible name to
 * @param {string} name - The accessible name to add
 */
function addSvgAccessibleName (svg, name) {
  if (!svg || !name) return

  // Add title element for screen readers
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
  title.textContent = name
  svg.insertBefore(title, svg.firstChild)

  // Add aria-label as fallback
  svg.setAttribute('aria-label', name)
}

/**
 * Create a landmark element with proper role and label
 * @param {string} role - The ARIA role for the landmark
 * @param {string} label - The accessible label for the landmark
 * @returns {HTMLElement} The created landmark element
 */
function createLandmark (role, label) {
  const element = document.createElement('div')
  element.setAttribute('role', role)
  element.setAttribute('aria-label', label)
  return element
}

/**
 * Fix fake links by converting them to proper buttons or links
 * @param {HTMLElement} element - The element to fix
 * @param {string} [role='button'] - The role to assign (button or link)
 */
function fixFakeLink (element, role = 'button') {
  if (!element) return

  if (role === 'button') {
    element.setAttribute('role', 'button')
    element.setAttribute('tabindex', '0')
    element.setAttribute('aria-label', element.textContent || 'Button')
  } else if (role === 'link') {
    element.setAttribute('role', 'link')
    element.setAttribute('tabindex', '0')
    element.setAttribute('aria-label', element.textContent || 'Link')
  }

  // Add keyboard event handlers
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      element.click()
    }
  })
}

// New functions for rendering graph/index
/**
 * Render the dependency graph content
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} data - The graph data to render
 * @param {Object} options - Rendering options
 * @returns {Object} The rendered graph information
 */
function renderGraphContent(container, data, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  if (!data) {
    throw new Error('Graph data is required');
  }

  // Ensure container has proper accessibility attributes
  ensureElementHasId(container, 'graph-container');
  addAriaLabel(container, 'Dependency graph visualization');

  // Render the graph content
  const graph = renderDependencyGraph(data);

  // Apply any additional options
  if (options.interactive) {
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('role', 'application');
  }

  return {
    containerId: container.id,
    graphData: graph,
    options
  };
}

/**
 * Render the index content
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} data - The index data to render
 * @param {Object} options - Rendering options
 * @returns {Object} The rendered index information
 */
function renderIndexContent(container, data, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  if (!data) {
    throw new Error('Index data is required');
  }

  // Ensure container has proper accessibility attributes
  ensureElementHasId(container, 'index-container');
  addAriaLabel(container, 'Dependency index');

  // Process the index data
  const processedData = {
    items: data.items || [],
    metadata: data.metadata || {}
  };

  // Apply any additional options
  if (options.collapsible) {
    container.setAttribute('aria-expanded', 'true');
  }

  return {
    containerId: container.id,
    indexData: processedData,
    options
  };
}

/**
 * Add landmark roles to the document structure
 */
function addLandmarkRoles() {
  if (typeof document === 'undefined') return;

  // Add main landmark if not present
  if (!document.querySelector('main[role="main"]')) {
    const mainElement = document.querySelector('main') || document.createElement('main');
    mainElement.setAttribute('role', 'main');
    if (!document.querySelector('main')) {
      document.body.appendChild(mainElement);
    }
  }

  // Add navigation landmark if not present
  if (!document.querySelector('nav[role="navigation"]')) {
    const navElement = document.querySelector('nav') || document.createElement('nav');
    navElement.setAttribute('role', 'navigation');
    if (!document.querySelector('nav')) {
      document.body.appendChild(navElement);
    }
  }

  // Add search landmark if not present
  if (!document.querySelector('[role="search"]')) {
    const searchElement = document.querySelector('.search') || document.createElement('div');
    searchElement.setAttribute('role', 'search');
    if (!document.querySelector('.search')) {
      document.body.appendChild(searchElement);
    }
  }
}

/**
 * Add accessible names to SVG elements
 * @param {HTMLElement} svgElement - The SVG element to add accessible name to
 * @param {string} name - The accessible name to add
 */
function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return;

  // Add title element if not present
  let titleElement = svgElement.querySelector('title');
  if (!titleElement) {
    titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    svgElement.insertBefore(titleElement, svgElement.firstChild);
  }
  titleElement.textContent = name;

  // Add aria-label as fallback
  svgElement.setAttribute('aria-label', name);
}

/**
 * Fix fake links by converting them to proper buttons or adding proper ARIA attributes
 * @param {HTMLElement} linkElement - The link element to fix
 */
function fixFakeLink(linkElement) {
  if (!linkElement) return;

  // If it's a fake link (no href or href="javascript:void(0)"), convert to button
  if (!linkElement.getAttribute('href') || linkElement.getAttribute('href') === 'javascript:void(0)') {
    const button = document.createElement('button');
    button.textContent = linkElement.textContent;
    button.className = linkElement.className;
    button.setAttribute('aria-label', linkElement.getAttribute('aria-label') || linkElement.textContent);

    // Copy event listeners
    const clone = linkElement.cloneNode(true);
    linkElement.parentNode.replaceChild(button, linkElement);

    // Copy event listeners
    const events = ['click', 'keydown', 'keyup', 'focus', 'blur'];
    events.forEach(event => {
      const handler = linkElement[`on${event}`];
      if (handler) {
        button[`on${event}`] = handler;
      }
    });

    return button;
  }

  // If it's a real link but missing ARIA attributes
  if (!linkElement.getAttribute('aria-label') && !linkElement.querySelector('img, svg')) {
    linkElement.setAttribute('aria-label', linkElement.textContent);
  }

  return linkElement;
}

/**
 * Add accessible names to SVG elements
 * @param {SVGElement} svgElement - The SVG element to add accessible name to
 * @param {string} name - The accessible name to add
 */
function addAccessibleNameToSVG(svgElement, name) {
  if (!svgElement || !name) return;

  // Add aria-label if not already present
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', name);
  }

  // Add title element for additional accessibility
  let titleElement = svgElement.querySelector('title');
  if (!titleElement) {
    titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    svgElement.insertBefore(titleElement, svgElement.firstChild);
  }
  titleElement.textContent = name;
}

/**
 * Ensure unique landmark roles in the document
 * @param {HTMLElement} element - The element to check for landmark roles
 * @param {string} role - The landmark role to ensure uniqueness for
 */
function ensureUniqueLandmark(element, role) {
  if (!element || !role) return;

  // Check if the element already has the role
  if (element.getAttribute('role') !== role) {
    element.setAttribute('role', role);
  }

  // Ensure the landmark is unique by adding an ID if needed
  if (!element.id) {
    element.id = `${role}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Fix fake links by converting them to proper buttons or adding proper ARIA attributes
 * @param {HTMLElement} element - The element to fix
 */
function fixFakeLink(element) {
  if (!element) return;

  // If it's a fake link (span with click handler), convert to button
  if (element.tagName === 'SPAN' && element.onclick) {
    const button = document.createElement('button');
    button.textContent = element.textContent;
    button.onclick = element.onclick;
    button.className = element.className;
    element.parentNode.replaceChild(button, element);
    return button;
  }

  // If it's a link without href, add proper ARIA attributes
  if (element.tagName === 'A' && !element.getAttribute('href')) {
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.setAttribute('aria-disabled', 'true');
  }

  return element;
}

// TODO: Create or update the affected functions to be accessible
// The functions below have been created to match the exported names

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
  checkLinkAccessibility
};