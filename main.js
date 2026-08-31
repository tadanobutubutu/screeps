// TODO: Implement this function for adding SVG accessibility props

// main.js - Combined utility and accessibility features

// TODO: Identify and update specific functions that render dependency graphs or

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="region"]');
  let uniqueIds = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => id.split('-')[1]);
    let id;

    while (existingIds.includes(landmark.id.split('-')[1])) {
      id = generateUniqueId();
    }

    uniqueIds.push(id);
    landmark.id = id;
  });
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);

  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// TODO: Implement function for addressing accessibility issues from insight report
// Mock implementation of the function to address accessibility issues
// This should be replaced with actual logic based on the insight report structure
/**
 * Addresses accessibility issues from an insight report
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @param {string} insightReport.issue - The type of issue (e.g., 'REACT_025')
 * @param {Array} insightReport.elements - Elements related to the issue
 * @param {Object} insightReport.details - Additional details about the issue
 */
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issue) {
    return;
  }

  switch (insightReport.issue) {
    case 'REACT_025': // Ensure unique landmarks
      if (insightReport.elements) {
        const seenIds = new Set();
        insightReport.elements.forEach((element) => {
          if (element.id && validateLandmark(element)) {
            if (seenIds.has(element.id.split('-')[1])) {
              const newId = `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              element.id = newId;
              seenIds.add(newId);
            } else {
              seenIds.add(element.id);
            }
          }
        });
      }
      break;
    default:
      console.warn(`Unknown accessibility issue type: ${insightReport.issue}`);
  }
}

// Wrap primary content in main element
function wrapPrimaryContentInMain() {
  const primaryContent = document.querySelector('.primary-content');
  if (primaryContent) {
    const mainElement = document.createElement('main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
    primaryContent.removeAttribute('class');
    primaryContent.classList.add('primary-content-inner');
  }
}

// TODO: Implement functions to validate table accessibility, table structure, and fix landmark issues

// Add accessible names to SVGs (TODO: Add real implementation)
function addAccessibleNamesToSVGs() {
  const svgs = document.getElementsByTagName('svg');
  Array.from(svgs).forEach((svg) => {
    console.warn(`Add accessible names to ${svg.outerHTML}`);
  });
}

// Add ARIA attributes to form controls (TODO: Add real implementation)
function addARIAFormControls() {
  const formControls = document.querySelectorAll('form :focusable');
  Array.from(formControls).forEach((control) => {
    const { role } = control.getAttributeNode('role') || {};

    // Add role, label, and aria-label attributes here

    console.warn(`Add ARIA attributes to ${control.outerHTML}`);
  });
}

// Enforce unique landmarks (TODO: Add real implementation)
function ensureUniqueLandmarksWithIds() {
  const landmarks = document.querySelectorAll('[role="region"]');
  const ids = new Set();

  landmarks.forEach((landmark) => {
    const existingId = ids.has(landmark.id);

    // If the landmark already has a unique ID, don't change it
    if (!existingId) {
      let newId = getRandomInt(100_000, 999_999);
      while (ids.has(newId)) {
        newId = getRandomInt(100_000, 999_999);
      }
      landmark.id = newId;
    }

    ids.add(landmark.id);
  });
}

// Fix fake link issues (TODO: Add real implementation)
function fixFakeLinkIssues() {
  const links = document.querySelectorAll('a[href="#"]:not([data-fake-link])');
  Array.from(links).forEach((link) => {
    link.setAttribute('aria-hidden', 'true');
  });
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();

  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarksWithIds();

  wrapPrimaryContentInMain();

  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion,
    addressAccessibilityIssues,
    addAccessibleNamesToSVGs,
    addARIAFormControls,
    ensureUniqueLandmarksWithIds,
    fixFakeLinkIssues
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    addSvgAccessibilityProps, // TODO: Implement this function later
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    validateLandmark,
    renderDependencyGraph,
    addressAccessibilityIssues,
    wrapPrimaryContentInMain, // New function
    addAccessibleNamesToSVGs, // New function (TODO: Implement)
    addARIAFormControls, // New function (TODO: Implement)
    ensureUniqueLandmarksWithIds, // New function
    fixFakeLinkIssues // New function (TODO: Implement)
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}