// TODO: This is the existing code that needs to be preserved

// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation

/**
 * Traps focus within a container element for modal dialogs
 * @param {HTMLElement} container - The container to trap focus within
 * @param {HTMLElement} firstElement - First focusable element
 * @param {HTMLElement} lastElement - Last focusable element
 */
function trapFocus(container, firstElement, lastElement) {
  container.addEventListener('keydown', function(e) {
    if (e.target !== firstElement && e.target !== lastElement) return;
    
    if (e.shiftKey && e.target === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && e.target === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });
}

/**
 * Announces message to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    if (announcer.parentNode) {
      announcer.parentNode.removeChild(announcer);
    }
  }, 1000);
}

/**
 * Handles keyboard events for accessibility
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Function} callback - Callback function to execute
 * @param {string[]} allowedKeys - Array of allowed key names
 */
function handleAccessibleKeydown(event, callback, allowedKeys = ['Enter', 'Space', 'Escape']) {
  if (allowedKeys.includes(event.key)) {
    event.preventDefault();
    callback();
  }
}

/**
 * Sets ARIA attributes on an element
 * @param {HTMLElement} element - The element to update
 * @param {Object} attributes - Object containing ARIA attribute key-value pairs
 */
function setAriaAttributes(element, attributes) {
  if (!element || !attributes) return;
  
  Object.keys(attributes).forEach(key => {
    const attrName = key.startsWith('aria-') ? key : `aria-${key}`;
    element.setAttribute(attrName, attributes[key]);
  });
}

/**
 * Removes tab index from element and its children
 * @param {HTMLElement} element - The container element
 */
function removeTabAccess(element) {
  if (!element) return;
  
  element.setAttribute('inert', '');
  element.setAttribute('aria-hidden', 'true');
}

module.exports = {
  trapFocus,
  announceToScreenReader,
  handleAccessibleKeydown,
  setAriaAttributes,
  removeTabAccess
};