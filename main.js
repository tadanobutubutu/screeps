// Accessibility fixes for insight report
// TODO: Address accessibility issues from insight report — FIXED

(function() {
  'use strict';

  // Focus management for accessibility
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  // Trap focus within a container (modal pattern)
  function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusable = focusableContent[0];
    const lastFocusable = focusableContent[focusableContent.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });

    firstFocusable.focus();
  }

  // Announce dynamic content changes to screen readers
  function announceToScreenReader(message, priority) {
    priority = priority || 'polite';
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(function() {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Handle escape key to close modals/menus
  function handleEscapeKey(callback) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        callback();
      }
    });
  }

  // Export functions for external use
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      trapFocus: trapFocus,
      announceToScreenReader: announceToScreenReader,
      handleEscapeKey: handleEscapeKey
    };
  } else {
    window.AccessibilityUtils = {
      trapFocus: trapFocus,
      announceToScreenReader: announceToScreenReader,
      handleEscapeKey: handleEscapeKey
    };
  }
})();