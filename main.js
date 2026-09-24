// TODO: Address accessibility issues from insight report:

/**
 * Manages focus for accessibility
 * @param {HTMLElement} element - The element to focus
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Announces a message to screen readers
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
  let announcement = document.getElementById('sr-announcer');
  if (!announcement) {
    announcement = document.createElement('div');
    announcement.id = 'sr-announcer';
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    document.body.appendChild(announcement);
  }
  announcement.textContent = message;
}

/**
 * Handles keyboard navigation for interactive elements
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Object} options - Configuration options
 */
function handleKeyboardNavigation(event, options = {}) {
  const allowedKeys = options.allowedKeys || ['Enter', ' ', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (!allowedKeys.includes(event.key)) {
    return false;
  }
  return true;
}

/**
 * Traps focus within a container for modal dialogs
 * @param {HTMLElement} container - The container element
 * @param {KeyboardEvent} event - The keyboard event
 */
function trapFocus(container, event) {
  if (event.key !== 'Tab') return;
  
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
 * Updates ARIA attributes for expanded/collapsed state
 * @param {HTMLElement} element - The toggle element
 * @param {boolean} isExpanded - Whether the element is expanded
 */
function updateAriaExpanded(element, isExpanded) {
  if (element) {
    element.setAttribute('aria-expanded', String(isExpanded));
  }
}

module.exports = {
  manageFocus,
  announceToScreenReader,
  handleKeyboardNavigation,
  trapFocus,
  updateAriaExpanded
};