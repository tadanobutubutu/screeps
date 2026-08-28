const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {}

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

// Utility functions from HEAD
function processData(data) {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

function validateInput(input) {
  return typeof input === 'string' && input.length > 0;
}

function formatOutput(data) {
  return JSON.stringify(data, null, 2);
}

// Polyfill for Array.prototype.flat (if not available)
if (!Array.prototype.flat) {
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

module.exports = {
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
  processData,
  validateInput,
  formatOutput,
  initializeAccessibility,
  toggleInsightPanel,
  openModal,
  closeModal,
  setupAccessibilityEventListeners
};

// Initialize on DOM ready
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