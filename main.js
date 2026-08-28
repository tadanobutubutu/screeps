// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

/**
 * Accessibility utilities for the application
 * Addresses issues from the insight report
 */

const Accessibility = {
  // Focus management
  focusableElements: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  
  /**
   * Trap focus within an element (e.g., modal)
   * @param {HTMLElement} container - The container element to trap focus within
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(this.focusableElements);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstFocusable?.focus();

    return () => container.removeEventListener('keydown', handleTabKey);
  },

  /**
   * Announce message to screen readers using aria-live region
   * @param {string} message - The message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announce(message, priority = 'polite') {
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  },

  /**
   * Check if user prefers reduced motion
   * @returns {boolean}
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Handle escape key press
   * @param {KeyboardEvent} e - The keyboard event
   * @param {Function} callback - Function to call on escape
   */
  handleEscapeKey(e, callback) {
    if (e.key === 'Escape') {
      callback();
    }
  }
};

// Keyboard navigation initialization
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Global escape key handling
    Accessibility.handleEscapeKey(e, () => {
      // Close any open modals or dropdowns
      const activeModal = document.querySelector('[role="dialog"]:not([hidden])');
      if (activeModal) {
        activeModal.hidden = true;
      }
    });
  });

  // Skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Accessibility, initKeyboardNavigation };
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKeyboardNavigation);
} else {
  initKeyboardNavigation();
}