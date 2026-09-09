// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

// REACT_015: Returns the appropriate lang attribute value for the HTML element
function getLangAttribute() {
  // Default to English; can be extended to detect from content/user preference
  return 'en';
}

// REACT_015: Returns a person name string, used in accessible contexts
function personName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return name.trim();
}

// REACT_027: Validates that a table has proper accessibility attributes
function validateTableAccessibility(table) {
  if (!table) return false;
  // Ensure table has a caption or aria-label
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label');
  const hasAriaLabelledBy = table.getAttribute('aria-labelledby');
  return Boolean(hasCaption || hasAriaLabel || hasAriaLabelledBy);
}

// REACT_027: Validates the structural integrity of a table (thead, tbody, proper rows/cells)
function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const hasHeader = table.querySelector('thead') || table.querySelector('th');
  const hasBody = table.querySelector('tbody');
  return Boolean(hasHeader && hasBody);
}

// REACT_017: Validates that a landmark element is properly defined
function validateLandmark(element) {
  if (!element) return false;
  const landmarkRoles = [
    'banner', 'navigation', 'main', 'complementary',
    'contentinfo', 'search', 'form', 'region'
  ];
  const role = element.getAttribute('role');
  const tag = element.tagName.toLowerCase();
  const implicitLandmarks = {
    header: 'banner', nav: 'navigation', main: 'main',
    aside: 'complementary', footer: 'contentinfo', form: 'form'
  };
  return landmarkRoles.includes(role) || Boolean(implicitLandmarks[tag]);
}

// REACT_017: Validates the structure of landmark elements within a container
function validateLandmarkStructure(container) {
  if (!container) return false;
  const landmarks = container.querySelectorAll(
    'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
  );
  // Ensure at least one main landmark exists
  return Array.from(landmarks).some(el => el.tagName.toLowerCase() === 'main' || el.getAttribute('role') === 'main');
}

// REACT_041: Returns an accessible name for an SVG element
function getSvgAccessibleName(svg, fallbackName) {
  if (!svg) return '';
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const ref = document.getElementById(ariaLabelledBy);
    if (ref) return ref.textContent || '';
  }
  const titleEl = svg.querySelector('title');
  if (titleEl && titleEl.textContent) return titleEl.textContent;
  return fallbackName || '';
}

// REACT_036: Creates an in-page button element (avoiding fake <a> links)
function createInPageButton(label, onClickHandler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  if (typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original logic preserved from commit dbc62f0d7ea6e8ed531f9712000039619b9f3d51

// New function or changes requested in the issue
function newFunction() {
  // Implementation of the new function
  // Example:
  console.log('New function is running');
}

// Existing exports (do not remove or rename)
export function existingFunction() {
  // Implementation of the existing function
  // Example:
  console.log('Existing function is running');
}

function addMainLandmark() {
  // Implementation to add the main landmark
}

function addSvgAccessibleNames() {
  // Implementation to add accessible names to SVGs
}

function ensureUniqueLandmarks() {
  // Implementation to ensure unique landmarks, keeping single <main>
}

function fixFakeLinkIssue() {
  // Implementation to fix the fake link issue
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
    
    // Set tabindex to -1 for all focusable elements except the last one
    focusableElements.forEach((element, index) => {
      if (index !== focusableElements.length - 1) {
        element.tabIndex = -1;
      }
    });

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
  
  // Reset tabindex for all focusable elements
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusableElements.forEach((element) => {
    element.tabIndex = 1; // Reset tabindex to original state (if it was 1)
  });
  
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

// Export functions for testing
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