// TODO: This is the existing code that needs to be preserved

/**
 * Accessibility utilities for addressing common accessibility issues
 */

/**
 * Announces a message to screen readers using ARIA live regions
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
 * Traps focus within a specific element (useful for modals/dialogs)
 * @param {HTMLElement} element - The container element to trap focus within
 * @returns {function} Cleanup function to remove the trap
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  
  return function cleanup() {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Removes focus outline for mouse users but preserves for keyboard users
 * This helps address visual accessibility concerns
 */
function handleFocusVisibility() {
  const addMouseClass = () => document.body.classList.add('mouse-users');
  const removeMouseClass = (e) => {
    if (e.key === 'Tab') {
      document.body.classList.remove('mouse-users');
    }
  };

  document.addEventListener('mousedown', addMouseClass);
  document.addEventListener('keydown', removeMouseClass);

  return {
    cleanup: () => {
      document.removeEventListener('mousedown', addMouseClass);
      document.removeEventListener('keydown', removeMouseClass);
    }
  };
}

/**
 * Manages focus for modal/dialog accessibility
 * @param {HTMLElement} element - The modal element
 * @param {HTMLElement} previousActiveElement - Element that had focus before modal opened
 */
function manageFocusForModal(element, previousActiveElement) {
  const cleanup = trapFocus(element);
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }

  return function restoreFocus() {
    cleanup();
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };
}

module.exports = {
  announceToScreenReader,
  trapFocus,
  handleFocusVisibility,
  manageFocusForModal
};