// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Manages focus for accessibility (ARIA best practice)
 * @param {HTMLElement} element - The element to focus on
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Traps focus within a container element (useful for modals/dialogs)
 * @param {HTMLElement} container - The container element
 * @param {KeyboardEvent} event - The keyboard event
 */
function trapFocus(container, event) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Announces content to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcementElement = document.getElementById('sr-announcer');
  if (announcementElement) {
    announcementElement.setAttribute('aria-live', priority);
    announcementElement.textContent = '';
    // Force screen reader to announce by removing and re-adding content
    setTimeout(() => {
      announcementElement.textContent = message;
    }, 100);
  }
}

/**
 * Functions to ensure all SVG elements have accessible names
 */
function ensureSvgAccessibleNames() {
  // ... existing code ...
}

function updateAccessibleSvgNames() {
  // ... existing code ...
}

/**
 * Adds SVG accessibility props to all SVG elements in the document or specific container.
 * This function iterates over all SVG elements and applies accessibility properties
 * such as role, aria-hidden, and title where appropriate.
 * @param {HTMLElement} [container=document] - The container to process SVGs in
 * @returns {NodeList|Array} NodeList of processed SVG elements, or empty array if document is not available
 */
function addSvgAccessibilityProps(container = document) {
  // ... existing code ...
}

/**
 * Handles keyboard navigation for custom components
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} orientation - 'horizontal' or 'vertical'
 */
function handleKeyboardNavigation(event, orientation = 'horizontal') {
  // ... existing code ...
}

// Combined module exports for both accessibility and Node utilities
module.exports = {
  addLangAttribute,
  manageFocus,
  trapFocus,
  announceToScreenReader,
  handleKeyboardNavigation,
  ensureSvgAccessibleNames,
  updateAccessibleSvgNames,
  addSvgAccessibilityProps,
  // Accessibility functions (from HEAD)
  // Node utilities and other functions (from origin/main)
  // ... other exported functions ...
};