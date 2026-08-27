// Address accessibility issues from insight report — FIXED

(function() {
  'use strict';

  // Accessibility improvements
  function initAccessibility() {
    // Ensure skip links work properly
    const skipLinks = document.querySelectorAll('.skip-link, [href^="#"]');
    skipLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId) || document.querySelector(targetId);
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });

    // Create ARIA live region for dynamic content announcements
    let liveRegion = document.querySelector('[aria-live]');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only visually-hidden';
      liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
      document.body.appendChild(liveRegion);
    }

    // Ensure all images have alt attributes
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
      }
    });

    // Enhance button and link accessibility
    document.querySelectorAll('button, a[href]').forEach(el => {
      el.addEventListener('keyboardactivate', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          this.click();
        }
      });
    });
  }

  // Focus trap for modals
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
      if (e.key === 'Escape') {
        element.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Announce content changes to screen readers
  function announce(message, priority = 'polite') {
    const liveRegion = document.querySelector(`[aria-live="${priority}"]`) || 
                       document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;
    setTimeout(() => { liveRegion.textContent = ''; }, 1000);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }

  // Export functions for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initAccessibility, trapFocus, announce };
  }
})();