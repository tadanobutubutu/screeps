// TODO: This is the existing code that needs to be preserved

/**
 * Accessibility Utilities for addressing insight report issues
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
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Traps focus within a container element for modal dialogs
 * @param {HTMLElement} container - The container to trap focus within
 * @returns {Function} A cleanup function to remove the trap
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => container.removeEventListener('keydown', handleTabKey);
}

/**
 * Checks if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets the appropriate focus outline style based on user preferences
 * @returns {string} CSS for focus outline
 */
function getAccessibleFocusOutline() {
  if (prefersReducedMotion()) {
    return 'outline: 2px solid currentColor; outline-offset: 2px;';
  }
  return 'outline: 2px solid currentColor; outline-offset: 2px; box-shadow: 0 0 0 4px rgba(0,0,0,0.2);';
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  // Ensure all interactive elements are keyboard accessible
  document.querySelectorAll('[role="button"], [role="link"]').forEach(el => {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });
});