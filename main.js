// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

// Accessibility utilities for improved keyboard navigation and screen reader support

/**
 * Manages focus for accessibility - moves focus to an element
 * @param {HTMLElement} element - The element to focus
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Announces a message to screen readers using aria-live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Traps focus within a container for modal dialogs
 * @param {HTMLElement} container - The container element
 * @returns {Function} Cleanup function to remove trap
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);
  return () => container.removeEventListener('keydown', handleKeyDown);
}

/**
 * Handles escape key for closing modals/dropdowns
 * @param {HTMLElement} element - The element to monitor
 * @param {Function} callback - Function to call on Escape
 */
function handleEscapeKey(element, callback) {
  function onKeyDown(e) {
    if (e.key === 'Escape') {
      callback();
    }
  }
  element.addEventListener('keydown', onKeyDown);
  return () => element.removeEventListener('keydown', onKeyDown);
}

// Export accessibility utilities
module.exports = {
  manageFocus,
  announceToScreenReader,
  trapFocus,
  handleEscapeKey
};