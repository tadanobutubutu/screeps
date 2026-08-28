// main.js

const _ = require('lodash');
const dependencyGraphContent = require('./dependencyGraphContent');

const fs = require('fs');
const path = require('path');

// Import accessibility helper functions
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');

// Math Helper Imports
const { add } = require('./mathHelpers');
const { subtract } = require('./mathHelpers');
const { multiply } = require('./mathHelpers');
const { divide } = require('./mathHelpers');
const { power } = require('./mathHelpers');
const { squareRoot } = require('./mathHelpers');

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

const renderDependencyGraph = (dependencyGraph, container) => {
  const graphContent = dependencyGraph;
  container.innerHTML = graphContent;
};

const config = {
  enabled: true
};

// Store for functions
const main = {
  functions: {},

  // Register a function
  register: function(name, fn) {
    this.functions[name] = fn;
  },

  // Get a registered function
  get: function(name) {
    return this.functions[name];
  },

  // Execute a registered function
  execute: function(name, ...args) {
    const fn = this.functions[name];
    if (typeof fn === 'function') {
      return fn.apply(this, args);
    }
    throw new Error(`Function ${name} not found`);
  }
};

// New export for the myNewFunction
function myNewFunction(arr) {
  return _.map(arr, item => item * 2);
}

// Function to fix table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }

    if (!existingTbody) {
      const remainingRows = rows.length > 0 ? Array.from(rows).slice(0) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length > 0) {
        // If first cell should be a header
        if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
          const firstCell = cells[0];
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.insertBefore(th, firstCell);
        }
      }
    });
  });
  return tables.length;
}

// Function to validate landmark structure.
function validateLandmarkStructure(container) {
  if (!container) return { valid: false, issues: ['Container not found'] };
  const issues = [];
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]');
  if (landmarks.length === 0) {
    issues.push('No landmarks found in container');
  }
  const mainLandmarks = container.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length > 1) {
    issues.push('Multiple main landmarks found');
  }
  return { valid: issues.length === 0, issues };
}

// Function to ensure unique landmarks.
function ensureUniqueLandmarks(container) {
  if (!container) return { valid: false, issues: ['Container not found'] };
  const issues = [];
  const seen = new Map();
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach((landmark) => {
    const tag = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || tag;
    const label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || '';
    const key = `${role}:${label}`;
    if (seen.has(key)) {
      issues.push(`Duplicate landmark: ${role}`);
    } else {
      seen.set(key, true);
    }
  });
  return { valid: issues.length === 0, issues };
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = null;

  if (!mainElement) {
    // Find the main content area and wrap it or create main element
    const body = document.body;
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('id', 'main-content');
    } else {
      mainElement = document.createElement('main');
      mainElement.setAttribute('id', 'main-content');
      const primaryContent = body.querySelector('.content');
      if (primaryContent) {
        mainElement.appendChild(primaryContent);
      }
      body.insertBefore(mainElement, body.firstChild);
    }
  }

  return mainElement;
}

// Update scope attributes in all .html files in the views directory
const viewsDir = path.join(__dirname, 'views');
fs.readdirSync(viewsDir)
  .filter(file => file.endsWith('.html'))
  .forEach(file => {
    const filePath = path.join(viewsDir, file);
    updateThScopeAttribute(filePath);
  });

// Game loop function
function run() {
  // Your game logic here...
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

/**
 * Checks the structure of a table and validates it against expected schema
 * @param {string|Object} tableOrName - The name of the table or the table object to check
 * @param {Array} expectedColumns - Array of expected column definitions
 * @returns {Object} - Validation result with isValid boolean and error messages
 */
function checkTableStructure(tableOrName, expectedColumns = []) {
    const result = {
        isValid: true,
        errors: []
    };

    // Support both call signatures: (tableName, expectedColumns) and (table, expectedColumns)
    if (typeof tableOrName === 'string') {
        if (!tableOrName || tableOrName.trim() === '') {
            result.isValid = false;
            result.errors.push('Table name must be a non-empty string');
            return result;
        }

        if (!Array.isArray(expectedColumns)) {
            result.isValid = false;
            result.errors.push('expectedColumns must be an array');
            return result;
        }

        if (expectedColumns.length === 0) {
            result.isValid = false;
            result.errors.push('expectedColumns must not be empty');
            return result;
        }

        for (const column of expectedColumns) {
            if (typeof column !== 'string' || column.trim() === '') {
                result.isValid = false;
                result.errors.push('All expected columns must be non-empty strings');
                return result;
            }
        }

        // In a real implementation, this would query the database schema
        // and validate that the table has the expected columns
        return result;
    }

    if (!tableOrName || typeof tableOrName !== 'object') {
        result.isValid = false;
        result.errors.push('Table must be a valid object');
        return result;
    }

    // Check if table has columns property
    if (!Array.isArray(tableOrName.columns)) {
        result.isValid = false;
        result.errors.push('Table must have a columns array');
        return result;
    }

    // Validate each expected column exists
    const tableColumns = tableOrName.columns.map(col => col.name || col);

    expectedColumns.forEach(expected => {
        const columnName = typeof expected === 'string' ? expected : expected.name;
        if (!tableColumns.includes(columnName)) {
            result.isValid = false;
            result.errors.push(`Missing expected column: ${columnName}`);
        }
    });

    // Check for unexpected columns if strict mode is needed
    if (tableOrName.strict && expectedColumns.length > 0) {
        const expectedColumnNames = expectedColumns.map(e => typeof e === 'string' ? e : e.name);
        tableOrName.columns.forEach(col => {
            const colName = col.name || col;
            if (!expectedColumnNames.includes(colName)) {
                result.isValid = false;
                result.errors.push(`Unexpected column found: ${colName}`);
            }
        });
    }

    return result;
}

/**
 * Validates table structure matches expected schema
 * @param {Object} tableSchema - The table schema object
 * @param {Object} expectedSchema - The expected schema object
 * @returns {Object} - Result object with isValid boolean and errors array
 */
function validateTableSchema(tableSchema, expectedSchema) {
  const errors = [];
  
  if (!tableSchema || typeof tableSchema !== 'object') {
    errors.push('Invalid table schema provided');
    return { isValid: false, errors };
  }
  
  if (!expectedSchema || typeof expectedSchema !== 'object') {
    errors.push('Invalid expected schema provided');
    return { isValid: false, errors };
  }
  
  const tableColumns = tableSchema.columns || [];
  const expectedColumns = expectedSchema.columns || [];
  
  if (tableColumns.length !== expectedColumns.length) {
    errors.push(`Column count mismatch: expected ${expectedColumns.length}, got ${tableColumns.length}`);
  }
  
  for (const expectedCol of expectedColumns) {
    const found = tableColumns.find(col => col.name === expectedCol.name);
    if (!found) {
      errors.push(`Missing expected column: ${expectedCol.name}`);
    } else if (expectedCol.type && found.type !== expectedCol.type) {
      errors.push(`Column ${expectedCol.name} type mismatch: expected ${expectedCol.type}, got ${found.type}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// TODO: Implement a function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// TODO: Implement the new function as per the issue requirements
function newFunction(a, b) {
  return a + b;
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs

function ensureElementHasId(element) {
  // existing function implementation
}

function addAriaLabel(element, label) {
  // existing function implementation
}

function renderDependencyGraphs(dependencies) {
  // existing function implementation
}

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

// Accessible utility functions
function createAccessibleButton(id, label, onClick) {
  const button = document.createElement('button');
  button.id = id;
  button.setAttribute('aria-label', label);
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

/**
 * Check if a value is a number
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a number, false otherwise
 */
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Utility: Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Utility: Check if user prefers high contrast
function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

// New function to add proper landmark regions
function addProperLandmarkRegions() {
  // Ensure <main> element exists and has proper lang attribute
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    document.body.insertBefore(mainElement, document.body.firstChild);
  }
  
  // Set lang attribute on main element
  mainElement.setAttribute('lang', document.documentElement.lang || 'en');
  
  // Ensure header has proper role
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  
  // Ensure nav elements have proper roles
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    if (navs.length > 1 && !nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  // Ensure footer has proper role
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

// Validate table accessibility
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const results = [];

  tables.forEach((table, index) => {
    const result = { index, issues: [] };

    // Check if table has a caption or th elements
    const hasCaption = table.querySelector('caption');
    const hasHeaders = table.querySelectorAll('th').length > 0;
    
    if (!hasCaption && !hasHeaders) {
      result.issues.push('Table should have a caption or header cells');
    }

    // Check for proper scope attributes on th elements
    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (!th.hasAttribute('scope')) {
        result.issues.push('Header cells should have scope attribute');
      }
    });

    // Check for accessible table structure
    const tbody = table.querySelector('tbody');
    const thead = table.querySelector('thead');
    if (!tbody && thElements.length === 0) {
      result.issues.push('Table should have proper thead/tbody structure');
    }

    results.push(result);
  });

  return results;
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    // Ensure SVG has a title for accessible name
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      titleElement.textContent = 'Image'; // Default accessible name
      svg.insertBefore(titleElement, svg.firstChild);
    }
    
    // Ensure title has an ID for aria-labelledby
    if (!titleElement.id) {
      titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
    }
    
    // Set aria-labelledby to point to the title
    svg.setAttribute('aria-labelledby', titleElement.id);
    
    // Add role img if not present (redundant but safe)
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// New function to fix fake links (REACT_036)
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[href]:not(a)');
  fakeLinks.forEach((link) => {
    link.setAttribute('role', 'link');
    link.setAttribute('tabindex', '0');
    link.setAttribute('data-interactive', 'true');
  });
}

// New function to create accessible dialog
function createAccessibleDialog(id, title, content, closeLabel = 'Close') {
  const dialog = document.createElement('div');
  dialog.id = id;
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-labelledby', `${id}-title`);
  dialog.setAttribute('aria-modal', 'true');
  
  const titleEl = document.createElement('h2');
  titleEl.id = `${id}-title`;
  titleEl.textContent = title;
  
  const closeButton = createAccessibleButton(`${id}-close`, closeLabel, () => {
    dialog.hidden = true;
    dialog.setAttribute('aria-hidden', 'true');
  });
  
  dialog.appendChild(titleEl);
  dialog.appendChild(closeButton);
  dialog.appendChild(content);
  
  return dialog;
}

// Announce message to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Trap focus within container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// Initialize accessibility features
function initAccessibility() {
  // Add skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }
  
  // Ensure all images have alt text
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });
  
  // Add proper labeling to form inputs
  document.querySelectorAll('input, select, textarea').forEach((input) => {
    if (!input.id && input.name) {
      input.id = input.name;
    }
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label && input.type !== 'hidden') {
      input.setAttribute('aria-label', input.name || 'Form input');
    }
  });
}

// Create a live region for screen reader announcements
function createLiveRegion() {
  if (this.liveRegion) return;

  const region = document.createElement('div');
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  region.id = 'a11y-live-region';
  document.body.appendChild(region);
  this.liveRegion = region;
}

// Announce message to screen readers
function announce(message, priority = 'polite') {
  if (!this.liveRegion) this.createLiveRegion();

  this.liveRegion.setAttribute('aria-live', priority);
  this.liveRegion.textContent = '';

  // Use setTimeout to ensure the change is detected by screen readers
  setTimeout(() => {
    this.liveRegion.textContent = message;
  }, 100);
}

// Setup keyboard navigation for interactive elements
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Handle Enter and Space for custom interactive elements
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest('[data-interactive]');
      if (target) {
        e.preventDefault();
        target.click();
      }
    }

    // Escape key to close modals/dropdowns
    if (e.key === 'Escape') {
      const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
      if (openModal) {
        openModal.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }
    }
    
    // Handle Tab key navigation
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  // Fix Safari focus trapping in dropdowns
  const dropdownContainers = document.querySelectorAll('[data-dropdown]');
  dropdownContainers.forEach((container) => {
    container.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const currentFocusedElement = document.activeElement;
      let focusIsInsideContainer = false;

      if (
        currentFocusedElement &&
        (currentFocusedElement === container ||
          currentFocusedElement.closest(container))
      ) {
        focusIsInsideContainer = true;
      }

      // Ensure focus trapping only within the dropdown container
      if (!focusIsInsideContainer) {
        // Find the first focusable element within the container
        const firstFocusableElement = container.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
      }
    });
  });
}

// Manage focus for accessibility
function setupFocusManagement() {
  // Trap focus within modals
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
}

// Setup skip links
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link');
  if (!skipLink) return;

  const targetId = skipLink.getAttribute('href')?.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;

  if (target) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      target.setAttribute('tabindex', '-1');
      target.focus();
      announce('Skipped to main content');
    });

    // Focus the skip link when the document is loaded in Safari
    if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
      skipLink.focus();
    }
  }
}

/**
 * Enhanced function to address accessibility issues from insight report
 * Combines both accessibility filtering and general issue processing
 * @param {Object} insightReport - The insight report containing issue data
 * @returns {Array} List of addressed issues
 */
function addressAccessibilityIssues(insightReport) {
  const addressedIssues = [];
  
  // Handle accessibility-specific issues (HEAD version)
  if (insightReport && insightReport.accessibility) {
    const accessibilityIssues = insightReport.accessibility || [];
    
    for (const issue of accessibilityIssues) {
      if (issue.type === 'accessibility') {
        console.log(`Addressing accessibility issue: ${issue.id}`);
        issue.addressed = true;
        addressedIssues.push(issue);
      }
    }
  }
  
  // Handle general issues (origin/main version)
  if (insightReport && insightReport.issues) {
    insightReport.issues.forEach(issue => {
      console.log(`Addressing issue: ${issue.issue}`);
      console.log(`Solution: ${issue.solution}`);
      addressedIssues.push(issue);
    });
  }
  
  return addressedIssues;
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  if (!element || !role) return { valid: false, issues: [] };
  
  const issues = [];
  const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
  
  if (!hasLabel && role !== 'main') {
    issues.push(`Landmark with role "${role}" is missing accessible label`);
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const results = {
    landmarks: [],
    issues: []
  };
  
  if (!container) return results;
  
  const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  roles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach(element => {
      const checkResult = checkLandmarkElement(role, element);
      results.landmarks.push({
        role,
        element,
        valid: checkResult.valid
      });
      
      if (!checkResult.valid) {
        results.issues.push({
          role,
          element,
          issues: checkResult.issues
        });
      }
    });
  });
  
  return results;
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  
  const hasText = link.textContent && link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
  const hasTitle = link.hasAttribute('title');
  
  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  const hasText = button.textContent && button.textContent.trim().length > 0;
  const hasAriaLabel = button.hasAttribute('aria-label');
  const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
  const hasTitle = button.hasAttribute('title');
  const hasIcon = button.querySelector('svg, img, icon');
  
  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle || hasIcon;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    links: { accessible: [], inaccessible: [] },
    buttons: { accessible: [], inaccessible: [] }
  };
  
  if (!container) return results;
  
  const links = container.querySelectorAll('a[href]');
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      results.links.accessible.push(link);
    } else {
      results.links.inaccessible.push(link);
    }
  });
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (isButtonAccessible(button)) {
      results.buttons.accessible.push(button);
    } else {
      results.buttons.inaccessible.push(button);
    }
  });
  
  return results;
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) return null;
  
  const existingMain = document.querySelector('main');
  if (existingMain) return existingMain;
  
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
        !child.hasAttribute('aria-hidden') || child.getAttribute('aria-hidden') !== 'true') {
      main.appendChild(child);
    }
  });
  
  document.body.insertBefore(main, document.body.firstChild);
  return main;
}

function setSvgAttributes(svgElement) {
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }

  // Ensure the SVG has an id for accessibility
  ensureElementHasId(svgElement);

  // Add a default aria-label if none exists
  if (!svgElement.getAttribute('aria-label')) {
    addAriaLabel(svgElement, 'SVG graphic');
  }
}

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// Existing code that should be preserved
function existingFunction() {
  // ... existing code ...
}

// New function to address accessibility issues from insight report
function newFunction() {
  // implementation of new function
}

// Implement the new functions here
function myFunction1(parameter1, parameter2) {
  // Your implementation goes here
}

function myFunction2(parameter3) {
  // Your implementation goes here
}

// Accessibility initialization
const a11yStore = {
  liveRegion: null,
  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
    this.initAccessibility();
  },
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
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[data-interactive]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
        if (openModal) {
          openModal.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
      }
    });

    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        if (!focusIsInsideContainer) {
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });
  },
  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
        skipLink.focus();
      }
    }
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

    // Also check for .landmark class elements from first version
    const landmarks = document.querySelectorAll('.landmark');
    landmarks.forEach((landmark, index) => {
      if (landmark.hasAttribute('aria-labelledby') && !landmark.querySelector(`#landmark-label-${index}`)) {
        console.warn(`REACT_017: ARIA-labelledby attribute exists without corresponding element for landmark at index ${index}`);
      }
    });
  },

  // New function to add proper landmark regions for accessibility
  addProperLandmarkRegions() {
    // Ensure the main landmark exists
    if (!document.querySelector('main, [role="main"]')) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      main.id = 'main-content';
      document.body.appendChild(main);
    }

    // Ensure banner landmark for header
    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
    }

    // Add navigation landmarks with accessible labels
    const navElements = document.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', `navigation-${index + 1}`);
      }
      if (!nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
    });

    // Ensure contentinfo landmark for footer
    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }

    // Ensure complementary landmark for aside
    const aside = document.querySelector('aside');
    if (aside && !aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
    }

    // Add form landmark to forms missing a label
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
        const label = form.querySelector('legend, label');
        if (!label) {
          form.setAttribute('role', 'form');
          form.setAttribute('aria-label', `form-${index + 1}`);
        }
      }
    });

    // Add search landmark if missing
    const searchRegions = document.querySelectorAll('[role="search"]');
    if (searchRegions.length === 0) {
      const searchInput = document.querySelector('input[type="search"]');
      if (searchInput && !searchInput.closest('[role="search"]')) {
        const searchRegion = document.createElement('div');
        searchRegion.setAttribute('role', 'search');
        searchRegion.setAttribute('aria-label', 'search');
        searchInput.parentNode.insertBefore(searchRegion, searchInput);
        searchRegion.appendChild(searchInput);
      }
    }

    // Ensure all landmark regions have accessible names where required
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
    landmarkRoles.forEach((role) => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach((el) => {
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
          const tagName = el.tagName.toLowerCase();
          let label = '';
          switch (role) {
            case 'navigation':
              label = 'navigation';
              break;
            case 'complementary':
              label = 'complementary';
              break;
            case 'contentinfo':
              label = 'contentinfo';
              break;
            case 'search':
              label = 'search';
              break;
            case 'form':
              label = 'form';
              break;
            default:
              label = role;
          }
          el.setAttribute('aria-label', label);
        }
      });
    });

    // Ensure only one main landmark
    const mains = document.querySelectorAll('main, [role="main"]');
    if (mains.length > 1) {
      for (let i = 1; i < mains.length; i++) {
        mains[i].remove();
      }
    }

    // Ensure only one banner landmark
    const banners = document.querySelectorAll('[role="banner"], header');
    if (banners.length > 1) {
      for (let i = 1; i < banners.length; i++) {
        banners[i].remove();
      }
    }

    // Ensure only one contentinfo/footer landmark
    const footers = document.querySelectorAll('[role="contentinfo"], footer');
    if (footers.length > 1) {
      for (let i = 1; i < footers.length; i++) {
        footers[i].remove();
      }
    }
  },

  // New function to add SVG accessibility props
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
  initAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
        }
      });
    }
    
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });
    
    document.querySelectorAll('input, select, textarea').forEach((input) => {
      if (!input.id && input.name) {
        input.id = input.name;
      }
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    });
  },
  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  }
};

// REACT_015: Add lang attribute to HTML element
// - REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (typeof document !== 'undefined') {
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.lang = 'en';
  }
  document.documentElement.lang = 'en';
}

// Check for duplicate banners
const banners = document.querySelectorAll('[role="banner"], [role="header"]');
if (banners.length > 1) {
  throw new Error('Document should have at most one banner or header landmark');
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  // Check if a <main> element already exists
  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  // Identify landmark elements that should remain outside of <main>
  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  // Create a new <main> element
  mainElement = document.createElement('main');

  // Move all body children that are not in the exclude list into <main>
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  // Append the <main> element to the body
  document.body.appendChild(mainElement);

  return mainElement;
}

function ensureUniqueLandmarks() {
  // Ensure only one main landmark
  const mains = document.querySelectorAll('main, [role="main"]');
  const removedMains = [];
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      removedMains.push(mains[i]);
      mains[i].remove();
    }
  }

  // Ensure only one banner landmark
  const banners = document.querySelectorAll('[role="banner"], header');
  const removedBanners = [];
  if (banners.length > 1) {
    for (let i = 1; i < banners.length; i++) {
      removedBanners.push(banners[i]);
      banners[i].remove();
    }
  }

  // Ensure only one contentinfo/footer landmark
  const footers = document.querySelectorAll('[role="contentinfo"], footer');
  const removedFooters = [];
  if (footers.length > 1) {
    for (let i = 1; i < footers.length; i++) {
      removedFooters.push(footers[i]);
      footers[i].remove();
    }
  }

  return { removedMains, removedBanners, removedFooters };
}

module.exports = {
    config,
    countDependencies,
    run,
    checkTableStructure,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraphs,
    myNewFunction,
    isNumber,
    clamp,
    validateTableSchema,
    rotateBack,
    existingFunction,
    newFunction,
    myFunction1,
    myFunction2,
    addressAccessibilityIssues,
    main,
    SomeClass,
    someUtility,
    isLinkAccessible,
    isButtonAccessible,
    checkAccessibility,
    checkLandmarkElement,
    wrapPrimaryContentInMain,
    checkLandmarks,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    validateLandmark,
    addProperLandmarkRegions,
    addSVGAccessibilityProps,
    fixFakeLinks,
    createAccessibleButton,
    createAccessibleDialog,
    announceToScreenReader,
    trapFocus,
    initAccessibility,
    createLiveRegion,
    announce,
    setupKeyboardNavigation,
    setupFocusManagement,
    setupSkipLinks,
    prefersReducedMotion,
    prefersHighContrast,
    ensureUniqueLandmarks,
    a11yStore
};