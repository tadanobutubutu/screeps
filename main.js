// Address accessibility issues from insight report

// Utility functions for accessibility improvements

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
 * Announces content to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Handles keyboard navigation for interactive elements
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} selector - CSS selector for focusable elements
 */
function handleKeyboardNavigation(event, selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') {
  const focusableElements = Array.from(document.querySelectorAll(selector));
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Removes focus outlines for mouse users while preserving for keyboard users
 */
function initFocusManagement() {
  let hadKeyboardEvent = false;
  
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      hadKeyboardEvent = true;
      document.body.classList.add('user-is-tabbing');
    }
  });

  document.addEventListener('mousedown', () => {
    if (hadKeyboardEvent) {
      document.body.classList.remove('user-is-tabbing');
      hadKeyboardEvent = false;
    }
  });
}

/**
 * Ensures proper focus management when modal dialogs open/close
 * @param {HTMLElement} modal - The modal element
 * @param {HTMLElement} triggerElement - The element that triggered the modal
 */
function trapFocusInModal(modal, triggerElement) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
    if (event.key === 'Escape') {
      modal.blur();
      if (triggerElement) triggerElement.focus();
    }
  });

  firstFocusable?.focus();
}

// Export all functions for use in other modules
export {
  manageFocus,
  announceToScreenReader,
  handleKeyboardNavigation,
  initFocusManagement,
  trapFocusInModal
};

// Initialize accessibility features on DOM load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initFocusManagement();
  });
}