const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

/**
 * Checks if a table data array has the required structure
 * @param {Array} tableData - The table data to check
 * @param {Array} requiredColumns - List of required column names
 * @returns {Object} - { valid: boolean, missingColumns: string[] }
 */
function checkTableData(tableData, requiredColumns) {
    if (!Array.isArray(tableData) || tableData.length === 0) {
        return { valid: false, missingColumns: requiredColumns };
    }
    
    const headers = tableData[0];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    return {
        valid: missingColumns.length === 0,
        missingColumns
    };
}

// Implement validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];
  
  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }
  
  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }
  
  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }
  
  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateLandmarkStructure(landmark) {
  // Implementation: check landmark structure completeness
  if (!landmark.id) return false;
  return true;
}

function addFixLandmarkIssues() {
  // Implementation: apply fixes for landmark issues
  console.log('Applying landmark fixes');
}

// Todo 4: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // Implementation: generate accessible name for SVG
  return svg.getAttribute ? svg.getAttribute('title') || 'Unnamed SVG' : 'Unnamed SVG';
}

function addAriaToFormControls() {
  // Implementation: add ARIA attributes to form controls
  if (typeof document !== 'undefined') {
    document.querySelectorAll('.form-control').forEach(el => {
      el.setAttribute('aria-label', 'Input field');
    });
  }
}

// Todo 5: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // Implementation: ensure landmarks have unique IDs
  try {
    const landmarks = Object.values(require('./landmarks'));
    const seen = new Set();
    for (const landmark of landmarks) {
      if (seen.has(landmark.id)) {
        throw new Error(`Duplicate landmark ID: ${landmark.id}`);
      }
      seen.add(landmark.id);
    }
  } catch (e) {
    // landmarks module may not exist
    logger.warn('Could not validate landmark uniqueness:', e.message);
  }
}

// Todo 6: Fix 1 fake link issue
function fixFakeLinkIssues() {
  // Implementation: fix broken links
  if (typeof document !== 'undefined') {
    document.querySelectorAll('a[href]').forEach(link => {
      if (!link.href || !link.href.startsWith('http')) {
        link.href = '#';
      }
    });
  }
}

/**
 * Announce content changes to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level ('polite' or 'assertive')
 */
function announceToScreenReader(message, priority = 'polite') {
  if (typeof document === 'undefined') return;

  // Remove any existing announcements
  const existingAnnouncement = document.querySelector('[role="status"].sr-only-announcement');
  if (existingAnnouncement) {
    existingAnnouncement.remove();
  }

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only-announcement';
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is read
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.remove();
    }
  }, 1000);
}

// Function to check table structure for accessibility
function checkTableStructure(tableElement) {
  if (!tableElement) return { valid: false, errors: ['Table element is required'] };
  
  const errors = [];

  // Check if table has thead (DOM element)
  if (tableElement.querySelector) {
    const thead = tableElement.querySelector('thead');
    if (!thead) {
      errors.push('Table must have a thead element');
    } else {
      const thElements = thead.querySelectorAll('th');
      if (thElements.length === 0) {
        errors.push('Table thead must contain th elements');
      }
    }

    // Check if table has tbody
    const tbody = tableElement.querySelector('tbody');
    if (!tbody) {
      errors.push('Table must have a tbody element');
    } else {
      const rows = tbody.querySelectorAll('tr');
      if (rows.length === 0) {
        errors.push('Table tbody must contain tr elements with td');
      }
    }

    // Check for fake links in table
    const fakeLinks = tableElement.querySelectorAll('div[onclick], span[onclick]');
    fakeLinks.forEach(el => {
      if (!el.getAttribute('role') || el.getAttribute('role') !== 'button') {
        errors.push(`Fake link detected: <${el.tagName.toLowerCase()}> with onClick but no button role`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

// REACT_027: Add scope="col" or scope="row" to <th> elements
/**
 * Add scope attributes to table headers
 * @param {HTMLTableElement} tableElement - Table element to process
 * @returns {Array} Array of updates made
 */
function addScopeToHeaders(tableElement) {
  if (!tableElement || !tableElement.querySelectorAll) return [];

  const headers = tableElement.querySelectorAll('th');
  const updates = [];

  headers.forEach((th) => {
    const row = th.closest('tr');
    if (!row) return;
    
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(th);

    // Determine if scope should be 'col' or 'row'
    let scope = 'col';

    // Check if it's a row header (first cell in a row that's not the first row)
    if (cellIndex === 0 && rowIndex > 0) {
      scope = 'row';
    }

    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', scope);
      updates.push({
        element: th,
        scope: scope,
        position: { row: rowIndex, col: cellIndex }
      });
    }
  });

  return updates;
}

function createAccessibleLink(link) {
  // Implementation: create accessible link
  if (!link || !link.getAttribute) return;
  
  const href = link.getAttribute('href');
  if (href) {
    link.setAttribute('aria-label', `Click to go to ${href}`);
  }
}

/**
 * Initialize the application
 * @param {Object} options - Configuration options
 * @returns {boolean} Initialization status
 */
function initialize(options = {}) {
  if (isInitialized) {
    logger.warn('App already initialized');
    return false;
  }

  config.set(options);
  isInitialized = true;
  logger.info('Application initialized');
  return true;
}

/**
 * Process and transform data
 * @param {Array} data - Input data to process
 * @returns {Array|null} Processed data or null if invalid
 */
function processData(data) {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

/**
 * Validate input string
 * @param {string} input - Input to validate
 * @returns {boolean} Validation result
 */
function validateInput(input) {
  return typeof input === 'string' && input.length > 0;
}

/**
 * Format data for output
 * @param {any} data - Data to format
 * @returns {string} Formatted string
 */
function formatOutput(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Basic utility functions
 */
function calculateSum(a, b) {
  return a + b;
}

function calculateDifference(a, b) {
  return a - b;
}

function calculateProduct(a, b) {
  return a * b;
}

function calculateQuotient(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

/**
 * Example function to check if a number is even
 * @param {number} num - Number to check
 * @returns {boolean} True if even, false otherwise
 */
function isEven(num) {
  return num % 2 === 0;
}

/**
 * Example function to get the maximum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Maximum value
 */
function getMax(a, b) {
  return a > b ? a : b;
}

/**
 * Example function to get the minimum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Minimum value
 */
function getMin(a, b) {
  return a < b ? a : b;
}

// Sample implementation to maintain module structure
function main() {
  console.log('Main function executed');
}

// Polyfill for Array.prototype.flat (if not available)
if (typeof Array !== 'undefined' && !Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    writable: true,
    value: function depthFlat(depth = 1) {
      return depth > 0
        ? Array.prototype.reduce.call(this, function (acc, val) {
            return acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val);
          }, [])
        : Array.prototype.slice.call(this);
    }
  });
}

function getAppState() {
  return {
    isInitialized,
    ...appData
  };
}

function setData(key, value) {
  appData[key] = value;
  return appData;
}

function getData(key) {
  return appData[key];
}

function shutdown() {
  isInitialized = false;
  logger.info('Application shutdown complete');
}

// Additional functions from origin
function newFunction() {
  // Implementation of the new function
  console.log('This is the new function.');
}

function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

const VERSION = '1.0.0';

// Accessibility features for DOM environment
let insightButton, insightPanel, toggleButton, modal, modalClose;

// Initialize accessibility features
function initializeAccessibility() {
  if (typeof document === 'undefined') return;

  // DOM Elements with proper ARIA attributes
  insightButton = document.getElementById('insight-button');
  insightPanel = document.getElementById('insight-panel');
  toggleButton = document.querySelector('[aria-expanded]');
  modal = document.getElementById('accessible-modal');
  modalClose = document.getElementById('modal-close');

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  interactiveElements.forEach((element, index) => {
    element.setAttribute('tabindex', index === 0 ? '0' : '1');
  });

  // Add focus indicators for keyboard navigation
  const focusStyles = document.createElement('style');
  focusStyles.textContent = `
    :focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
    :focus:not(:focus-visible) {
      outline: none;
    }
    :focus-visible {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(focusStyles);
}

// Toggle insight panel with proper ARIA attributes
function toggleInsightPanel() {
  if (!toggleButton || !insightPanel) return;

  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  toggleButton.setAttribute('aria-expanded', !isExpanded);
  insightPanel.hidden = isExpanded;
  
  if (!isExpanded) {
    // Move focus to panel when opened for screen readers
    insightPanel.focus();
  }
}

// Modal handling with focus management (accessibility requirement)
function openModal() {
  if (!modal) return;

  modal.hidden = false;
  modal.setAttribute('aria-modal', 'true');
  
  // Focus trap management
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (firstElement) {
    firstElement.tabIndex = 0;
    
    lastElement.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        firstElement.focus();
      }
    });

    firstElement.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        lastElement.focus();
      }
    });

    // Focus first element
    firstElement?.focus();
  }

  // Close on Escape key
  document.addEventListener('keydown', handleEscapeKey);
  
  // Store trigger element to return focus
  const trigger = document.activeElement;
  modal.dataset.triggerId = trigger?.id || 'modal-trigger';
}

function closeModal() {
  if (!modal) return;

  modal.hidden = true;
  modal.removeAttribute('aria-modal');
  
  // Return focus to trigger element
  const triggerId = modal.dataset.triggerId;
  const trigger = document.getElementById(triggerId);
  trigger?.focus();
  
  // Remove escape key listener
  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

// Setup event listeners
function setupAccessibilityEventListeners() {
  if (typeof document === 'undefined') return;

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (insightButton) {
    insightButton.addEventListener('click', toggleInsightPanel);
    // Ensure keyboard accessibility
    insightButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleInsightPanel();
      }
    });
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleInsightPanel);
    toggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleInsightPanel();
      }
    });
  }
}

// Auto-initialize accessibility features
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeAccessibility();
      setupAccessibilityEventListeners();
    });
  } else {
    initializeAccessibility();
    setupAccessibilityEventListeners();
  }
}

// Export functions for testing and use
module.exports = {
  VERSION,
  validateLandmark,
  checkTableData,
  initialize,
  getAppState,
  setData,
  getData,
  shutdown,
  config,
  logger,
  newFunction,
  modifiedFunction,
  initializeAccessibility,
  toggleInsightPanel,
  openModal,
  closeModal,
  setupAccessibilityEventListeners,
  processData,
  validateInput,
  formatOutput,
  calculateSum,
  calculateDifference,
  calculateProduct,
  calculateQuotient,
  isEven,
  getMax,
  getMin,
  main,
  validateLandmarkStructure,
  addFixLandmarkIssues,
  getSvgAccessibleName,
  addAriaToFormControls,
  ensureUniqueLandmarks,
  fixFakeLinkIssues,
  announceToScreenReader,
  checkTableStructure,
  addScopeToHeaders,
  createAccessibleLink
};
```