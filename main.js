// main.js - Combined utility and accessibility features

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

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();

  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion
  };
}

// TODO: add the new functions or changes requested in the issue

// ... Existing functions ...

// Function to handle getLangAttribute for REACT_015
function getLangAttribute(htmlElement) {
  // Implement the logic to set the lang attribute based on the preferred language or localization
}

// Function to createInPageButton for REACT_015, REACT_036
function createInPageButton(options) {
  // Implement the logic to create a proper in-page link button
}

// Function to validateTableAccessibility for REACT_027
function validateTableAccessibility(table) {
  // Implement the logic to check for table accessibility issues and return a list of issues
}

// Function to validateTableStructure for REACT_027
function validateTableStructure(table) {
  // Implement the logic to check for table structure issues and return a list of issues
}

// Function to validateLandmark for REACT_017
function validateLandmark(element) {
  // Implement the logic to check for landmark presence and proper use
}

// Function to validateLandmarkStructure for REACT_017
function validateLandmarkStructure(element) {
  // Implement the logic to check for landmark structure compliance
}

// Function to ensureUniqueLandmarks for REACT_017, REACT_025
function ensureUniqueLandmarks() {
  // Implement the logic to check for and handle duplicate landmarks
}

// Function to getSvgAccessibleName for REACT_041
function getSvgAccessibleName(svg) {
  // Implement the logic to generate an accessible name for SVG elements
}

// Function to setSvgAttributes for REACT_041
function setSvgAttributes(svg, attributes) {
  // Implement the logic to set specified attributes on SVG elements
}

// Function to handleFakeLinks for REACT_036
function handleFakeLinks(links) {
  // Implement the logic to handle fake links within the app
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    setSvgAttributes,
    handleFakeLinks
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}