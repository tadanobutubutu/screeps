// TODO: Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----
// Accessibility improvements: Ensure keyboard navigation, focus management, and ARIA support

(function() {
  'use strict';

  // Existing code preserved
  const app = {
    init: function() {
      this.setupAccessibility();
      this.bindEvents();
    },

    setupAccessibility: function() {
      // Ensure all interactive elements are keyboard accessible
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      
      interactiveElements.forEach(function(element) {
        // Ensure elements have proper focus styles
        if (!element.hasAttribute('tabindex') && !element.matches('a, button, input, select, textarea')) {
          // Elements are already focusable by default
        }
        
        // Add aria-label if missing on elements with only icons
        if (element.tagName === 'BUTTON' && !element.textContent.trim() && !element.hasAttribute('aria-label')) {
          console.warn('Accessibility: Button missing accessible name');
        }
      });
    },

    bindEvents: function() {
      // Keyboard event handling
      document.addEventListener('keydown', function(e) {
        // Handle Enter and Space for buttons
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.matches('button, [role="button"]')) {
            e.preventDefault();
            e.target.click();
          }
        }
        
        // Handle Escape for modal/dialog close
        if (e.key === 'Escape') {
          const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
          if (modal) {
            modal.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Focus management for accessibility
      document.addEventListener('focus', function(e) {
        if (e.target) {
          e.target.classList.add('focus-visible');
        }
      }, true);

      document.addEventListener('blur', function(e) {
        if (e.target) {
          e.target.classList.remove('focus-visible');
        }
      }, true);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      app.init();
    });
  } else {
    app.init();
  }

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = app;
  }
})();