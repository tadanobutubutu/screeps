// TODO: Address accessibility issues from insight report:

/**
 * Main application module
 * @module main
 */

// Track focus for accessibility
let lastFocusedElement = null;

/**
 * Save the currently focused element before modal/overlay opens
 */
function saveFocus() {
  lastFocusedElement = document.activeElement;
}

/**
 * Restore focus to the previously focused element
 */
function restoreFocus() {
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

/**
 * Handle keyboard events for accessibility
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Function} closeCallback - Function to call when Escape is pressed
 */
function handleKeyboardNavigation(event, closeCallback) {
  if (event.key === 'Escape' && typeof closeCallback === 'function') {
    closeCallback();
  }
}

/**
 * Trap focus within a container (for modals/dialogs)
 * @param {HTMLElement} container - The container to trap focus within
 */
function trapFocus(container) {
  if (!container) return;
  
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });
}

/**
 * Announce message to screen readers
 * @param {string} message - The message to announce
 * @param {string} [politeness='polite'] - ARIA live politeness setting
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
 * Initialize main application
 */
function init() {
  saveFocus();
  // Add your initialization code here
}

/**
 * Clean up and close application
 */
function cleanup() {
  restoreFocus();
  // Add your cleanup code here
}

// Export functions for testing and external use
export {
  saveFocus,
  restoreFocus,
  handleKeyboardNavigation,
  trapFocus,
  announceToScreenReader,
  init,
  cleanup
};

// Auto-initialize if DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}