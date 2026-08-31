// TODO: Address accessibility issues from insight report
(function() {
  'use strict';

  // Ensure keyboard navigation for interactive elements
  document.addEventListener('keydown', function(e) {
    // Handle Enter and Space key activation for custom controls
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
        e.preventDefault();
        e.target.click();
      }
    }
  });

  // Focus management utilities
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusable = focusableContent[0];
    const lastFocusable = focusableContent[focusableContent.length - 1];

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
  }

  // Announce dynamic content changes to screen readers
  function announceToScreenReader(message, priority) {
    priority = priority || 'polite';
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(function() {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Expose utilities globally for use by other modules
  window.main = {
    trapFocus: trapFocus,
    announceToScreenReader: announceToScreenReader
  };
})();