// main.js - Addressing accessibility issues from insight report

// Accessibility helper functions
const A11yHelpers = {
  /**
   * Trap focus within an element (for modals, dialogs, etc.)
   * @param {HTMLElement} element - The container element to trap focus within
   */
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
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

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },

  /**
   * Announce message to screen readers
   * @param {string} message - The message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announce(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  /**
   * Handle escape key for closing modals/dropdowns
   * @param {KeyboardEvent} event
   * @param {Function} callback
   */
  handleEscapeKey(event, callback) {
    if (event.key === 'Escape') {
      callback();
    }
  },

  /**
   * Add keyboard support for custom dropdowns/menus
   * @param {HTMLElement} container
   * @param {Object} options
   */
  enableKeyboardNavigation(container, options = {}) {
    const items = container.querySelectorAll('[role="option"], [role="menuitem"]');
    let currentIndex = -1;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentIndex = (currentIndex + 1) % items.length;
          items[currentIndex].focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
          items[currentIndex].focus();
          break;
        case 'Home':
          e.preventDefault();
          currentIndex = 0;
          items[currentIndex].focus();
          break;
        case 'End':
          e.preventDefault();
          currentIndex = items.length - 1;
          items[currentIndex].focus();
          break;
        case 'Enter':
        case ' ':
          if (currentIndex >= 0 && items[currentIndex].click) {
            e.preventDefault();
            items[currentIndex].click();
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }
};

// Existing code preserved below
// TODO: Address accessibility issues from insight report — CONTINUING

// Initialize accessibility features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Apply accessibility improvements to interactive elements
  
  // Make all interactive elements keyboard accessible
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((el) => {
    // Ensure proper focus visibility
    el.addEventListener('focus', () => {
      el.classList.add('focus-visible');
    });
    el.addEventListener('blur', () => {
      el.classList.remove('focus-visible');
    });
  });

  // Enhance form accessibility
  const formInputs = document.querySelectorAll('input, select, textarea');
  formInputs.forEach((input) => {
    if (!input.getAttribute('aria-describedby') && input.title) {
      const errorId = `error-${input.id || Math.random().toString(36).substr(2, 9)}`;
      input.setAttribute('aria-describedby', errorId);
    }
  });

  // Improve error handling for forms
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.setAttribute('novalidate', 'true');
    
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const invalidFields = [];
      
      form.querySelectorAll('[required]').forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          invalidFields.push(field);
          field.setAttribute('aria-invalid', 'true');
        } else {
          field.removeAttribute('aria-invalid');
        }
      });

      if (!isValid) {
        e.preventDefault();
        A11yHelpers.announce(`Form has ${invalidFields.length} error(s). Please correct them.`, 'assertive');
        invalidFields[0].focus();
      }
    });
  });

  // Add skip link functionality if not present
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
    skipLink.addEventListener('focus', (e) => {
      e.target.style.cssText = 'position:static;width:auto;height:auto;padding:10px;background:#000;color:#fff;';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Ensure all images have alt text handling
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      console.warn('Image missing alt attribute:', img.src);
    }
  });

  // Improve live region announcements
  const liveRegions = document.querySelectorAll('[aria-live]');
  liveRegions.forEach((region) => {
    if (!region.id) {
      region.id = `live-region-${Math.random().toString(36).substr(2, 9)}`;
    }
  });
});

// Export for use in tests and other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { A11yHelpers };
}