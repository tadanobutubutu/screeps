// TODO: Address accessibility issues from insight report — FIXED

/**
 * Accessibility utilities for the application
 */
const AccessibilityUtils = {
  /**
   * Manages focus trapping within a container element
   * @param {HTMLElement} container - The container element to trap focus within
   * @returns {Function} - Cleanup function to remove the focus trap
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
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
    
    // Ensure focus is set to the first focusable element
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  /**
   * Announces a message to screen readers using ARIA live regions
   * @param {string} message - The message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announceToScreenReader(message, priority = 'polite') {
    let announcer = document.getElementById('aria-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'aria-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
      document.body.appendChild(announcer);
    }

    // Clear and set message (ensures announcement even for repeated messages)
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  },

  /**
   * Handles escape key to close modals/dropdowns
   * @param {Function} closeCallback - Function to call when Escape is pressed
   * @param {HTMLElement} element - Element to attach the listener to
   */
  handleEscapeKey(closeCallback, element = document) {
    const handler = (e) => {
      if (e.key === 'Escape' && typeof closeCallback === 'function') {
        closeCallback();
      }
    };
    
    element.addEventListener('keydown', handler);
    
    return () => {
      element.removeEventListener('keydown', handler);
    };
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AccessibilityUtils };
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure skip link functionality if present
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href') || '#main-content');
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  });
}