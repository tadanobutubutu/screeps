// TODO: Address accessibility issues from insight report:
// - Add skip link functionality for keyboard users
// - Ensure focus management for modals/dialogs
// - Add ARIA live regions for dynamic content
// - Improve keyboard navigation support
// - Add screen reader announcements for user feedback

(function() {
  'use strict';

  // Accessibility Utilities
  
  const a11y = {
    // Focus trap for modals
    trapFocus: function(element) {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      });
      
      firstFocusable && firstFocusable.focus();
    },

    // ARIA live region for announcements
    announce: function(message, priority = 'polite') {
      let announcer = document.getElementById('a11y-announcer');
      if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
      }
      announcer.textContent = message;
      setTimeout(() => { announcer.textContent = ''; }, 1000);
    },

    // Handle keyboard navigation for custom components
    handleArrowKeys: function(element, callback) {
      element.addEventListener('keydown', function(e) {
        const keyMap = {
          'ArrowUp': 'up',
          'ArrowDown': 'down',
          'ArrowLeft': 'left',
          'ArrowRight': 'right',
          'Enter': 'enter',
          'Escape': 'escape'
        };
        const action = keyMap[e.key];
        if (action && callback) {
          e.preventDefault();
          callback(action, e);
        }
      });
    },

    // Reduce motion check
    prefersReducedMotion: function() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  };

  // Initialize accessibility features
  function initA11y() {
    // Initialize skip link functionality
    const skipLink = document.querySelector('[href^="#"]');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }

    // Ensure all buttons with role="button" respond to Enter key
    document.querySelectorAll('[role="button"]').forEach(function(button) {
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Add focus visible polyfill behavior
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-nav');
    });
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initA11y);
  } else {
    initA11y();
  }

  // Export for testing and external use
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { a11y };
  }
})();