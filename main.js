// TODO: This is the existing code that needs to be preserved

/**
 * Handles focus trap for keyboard navigation within a container.
 * This function should be attached to keydown events on the trap container.
 * 
 * @param {KeyboardEvent} event - The keyboard event
 * @param {HTMLElement} trapContainer - The container element to trap focus within
 */
function handleFocusTrap(event, trapContainer) {
  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = trapContainer.querySelectorAll(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [tabindex="-1"]'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Sets up focus trap on a container element.
 * 
 * @param {HTMLElement} trapContainer - The container element to trap focus within
 * @returns {Function} A cleanup function to remove event listeners
 */
function setupFocusTrap(trapContainer) {
  const handler = (event) => handleFocusTrap(event, trapContainer);
  trapContainer.addEventListener('keydown', handler);
  
  return function cleanup() {
    trapContainer.removeEventListener('keydown', handler);
  };
}

module.exports = {
  handleFocusTrap,
  setupFocusTrap
};