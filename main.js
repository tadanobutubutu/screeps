// TODO: This is the existing code that needs to be preserved

import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// Implemented validateLandmark functionality
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

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// ... (previous and updated code remains as it is)

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          elementsById[landmark.id] = true;
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// Screen reader announcements - ARIA live region for accessibility
let liveRegion = null;

/**
 * Creates or retrieves the ARIA live region for screen reader announcements.
 * @returns {HTMLElement} The live region element.
 */
function getLiveRegion() {
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.padding = '0';
    liveRegion.style.margin = '-1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';
    document.body.appendChild(liveRegion);
  }
  return liveRegion;
}

/**
 * Announces a message to screen readers using ARIA live region.
 * @param {string} message - The message to announce.
 * @param {string} priority - 'polite' or 'assertive'.
 */
function announceToScreenReader(message, priority = 'polite') {
  const region = getLiveRegion();
  region.setAttribute('aria-live', priority);
  // Clear and set message to trigger announcement
  region.textContent = '';
  setTimeout(() => {
    region.textContent = message;
  }, 100);
}

// Focus management for modals
let lastFocusedElement = null;

/**
 * Traps focus within a container element for modal accessibility.
 * @param {HTMLElement} container - The container to trap focus within.
 * @returns {Function} A function to release the focus trap.
 */
function trapFocus(container) {
  if (!container) return () => {};

  // Store the previously focused element
  lastFocusedElement = document.activeElement;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  // Focus the first focusable element
  if (firstFocusable) {
    firstFocusable.focus();
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    // Close modal on Escape key
    if (e.key === 'Escape') {
      releaseFocusTrap();
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return function to release the focus trap
  return function releaseFocusTrap() {
    container.removeEventListener('keydown', handleKeyDown);
    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  };
}

/**
 * Adds keyboard navigation support to interactive elements.
 * @param {HTMLElement} container - The container to add keyboard navigation to.
 */
function addKeyboardNavigation(container) {
  if (!container) return;

  const interactiveElements = container.querySelectorAll('button, a, input, select, textarea, [role="button"]');

  interactiveElements.forEach((element) => {
    // Add tabindex if not already present
    if (!element.hasAttribute('tabindex') && !element.matches('a, button, input, select, textarea')) {
      element.setAttribute('tabindex', '0');
    }

    // Add Enter key support for custom interactive elements
    if (element.getAttribute('role') === 'button') {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    }
  });
}

/**
 * Adds ARIA labels to interactive elements that lack descriptive labels.
 * @param {HTMLElement} container - The container to process.
 */
function addAriaLabels(container) {
  if (!container) return;

  const interactiveElements = container.querySelectorAll('button, a[href], input, select, textarea');

  interactiveElements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();

    // Check if element has an accessible name
    const hasAccessibleName = 
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('title') ||
      element.textContent.trim() ||
      element.placeholder;

    if (!hasAccessibleName) {
      // Add generic ARIA label based on element type
      if (tagName === 'button') {
        const buttonText = element.textContent.trim() || 'Button';
        element.setAttribute('aria-label', buttonText);
      } else if (tagName === 'a') {
        element.setAttribute('aria-label', 'Link');
      } else if (tagName === 'input') {
        const inputType = element.type || 'text';
        element.setAttribute('aria-label', `${inputType} input`);
      }
    }
  });
}

/**
 * Addresses the accessibility issues from the insight report.
 * Implements keyboard navigation, ARIA labels, screen reader announcements, and focus trapping.
 * @param {HTMLElement} container - The container to apply accessibility improvements to.
 * @param {Object} options - Configuration options for accessibility improvements.
 * @param {boolean} options.enableFocusTrap - Whether to enable focus trapping for modals.
 * @param {boolean} options.enableKeyboardNav - Whether to enable keyboard navigation.
 * @param {boolean} options.enableAriaLabels - Whether to add ARIA labels.
 * @returns {Function|null} A function to release focus trap, or null if not enabled.
 */
function addressInsightIssues(container, options = {}) {
  const {
    enableFocusTrap = false,
    enableKeyboardNav = true,
    enableAriaLabels = true
  } = options;

  // Add keyboard navigation support
  if (enableKeyboardNav) {
    addKeyboardNavigation(container);
  }

  // Add ARIA labels for interactive elements
  if (enableAriaLabels) {
    addAriaLabels(container);
  }

  // Enable focus trapping for modals if requested
  if (enableFocusTrap) {
    return trapFocus(container);
  }

  return null;
}

// Placeholder functions for other exports
function landmarkStructureCheck() {}
function setLanguageAttribute() {}
function addLandmarkRoles() {}
function fixFakeLinks() {}
function isSecureContext() { return true; }
function initApp() { return initializeApp(); }
function ensureFocusableElements(container) {
  if (!container) return;
  const focusable = container.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusable.forEach((el) => {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });
}
function renderDependencyGraphContent() {}
function validateSvgAccessibility() {}
function processUniqueElements() {}
function renderDependencyGraph() {}
function renderIndexView() {}
function calculateSum() { return 0; }
function addProperLandmarkRegions() {}
function countDependencies() { return 0; }

// Export functions for testing
export {
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck