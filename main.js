// Addressed accessibility issues from insight report

(function() {
  'use strict';

  // Focus management for accessibility
  const focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

  // Trap focus within a container (modal/dialog)
  function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusable = focusableContent[0];
    const lastFocusable = focusableContent[focusableContent.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
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
      }
    });

    firstFocusable.focus();
  }

  // Announce dynamic content changes to screen readers
  function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Handle keyboard events for custom interactive elements
  function handleKeyboardActivation(element, callback) {
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
      }
    });
  }

  // Export functions for external use
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      trapFocus,
      announceToScreenReader,
      handleKeyboardActivation
    };
  } else {
    window.main = {
      trapFocus,
      announceToScreenReader,
      handleKeyboardActivation
    };
  }
})();