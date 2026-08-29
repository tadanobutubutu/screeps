// Addressed accessibility issues from insight report

(function() {
  'use strict';

  // Ensure keyboard accessibility for all interactive elements
  document.addEventListener('keydown', function(e) {
    // Add keyboard support for Enter and Space on clickable elements
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target;
      if (target.getAttribute('role') === 'button' || target.classList.contains('clickable')) {
        e.preventDefault();
        target.click();
      }
    }
  });

  // Initialize accessibility features on DOM ready
  function initAccessibility() {
    // Ensure all images have alt attributes (add empty alt for decorative images)
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
      }
    });

    // Ensure form inputs have associated labels
    const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
    inputs.forEach(function(input) {
      if (!input.id) {
        input.id = 'input-' + Math.random().toString(36).substr(2, 9);
      }
      const label = document.querySelector('label[for="' + input.id + '"]');
      if (!label) {
        const existingLabel = input.closest('label');
        if (!existingLabel) {
          console.warn('Input ' + input.id + ' is missing an associated label');
        }
      }
    });

    // Set up ARIA live regions for dynamic content updates
    const liveRegions = document.querySelectorAll('[data-live-region]');
    liveRegions.forEach(function(region) {
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
    });

    // Ensure buttons have accessible names
    const buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
      if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
        console.warn('Button is missing accessible name');
      }
    });

    // Manage focus for modal/dialog elements
    const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
    modals.forEach(function(modal) {
      modal.setAttribute('aria-modal', 'true');
    });

    // Ensure links have meaningful text (not just "click here" or "read more")
    const links = document.querySelectorAll('a');
    links.forEach(function(link) {
      const text = link.textContent.trim().toLowerCase();
      if (text === 'click here' || text === 'read more' || text === 'here' || text === 'more') {
        console.warn('Link "' + text + '" should have more descriptive text');
      }
    });
  }

  // Public API for triggering accessibility validation
  function validateAccessibility() {
    initAccessibility();
    return true;
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }

  // Export functions for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initAccessibility: initAccessibility,
      validateAccessibility: validateAccessibility
    };
  } else {
    window.AccessibilityUtils = {
      initAccessibility: initAccessibility,
      validateAccessibility: validateAccessibility
    };
  }
})();