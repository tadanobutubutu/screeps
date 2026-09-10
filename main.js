// TODO: Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

/**
 * Handles keyboard navigation for interactive elements
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Object} options - Configuration options
 * @param {string[]} options.trapKeys - Keys that should trap focus within an element
 * @param {Function} options.onEscape - Callback when Escape key is pressed
 * @returns {boolean} Whether the event was handled
 */
function handleKeyboardNavigation(event, options = {}) {
  const { trapKeys = ['Tab'], onEscape } = options;
  const { key } = event;

  if (trapKeys.includes(key)) {
    return true;
  }

  if (key === 'Escape' && typeof onEscape === 'function') {
    onEscape(event);
    return true;
  }

  return false;
}

/**
 * Announces content to screen readers
 * @param {string} message - The message to announce
 * @param {string} politeness - 'polite' or 'assertive'
 */
function announceToScreenReader(message, politeness = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Manages focus within a container element
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

module.exports = {
  handleKeyboardNavigation,
  announceToScreenReader,
  trapFocus
};