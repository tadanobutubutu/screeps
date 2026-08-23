// TODO: Address accessibility issues from insight report:
// - Ensure all interactive elements are keyboard accessible
// - Add proper focus management
// - Implement ARIA attributes where needed
// - Handle skip links and landmarks

(function() {
  'use strict';

  // Global accessibility settings
  const a11ySettings = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(forced-colors: active)').matches
  };

  // Initialize accessibility features on DOM ready
  function initA11y() {
    setupKeyboardNavigation();
    setupFocusManagement();
    setupARIAEnhancements();
    announceToScreenReader('Page loaded successfully');
  }

  // Ensure all interactive elements are keyboard accessible
  function setupKeyboardNavigation() {
    const interactiveElements = document.querySelectorAll(
      '[role="button"], [role="link"], [role="menuitem"], ' +
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    interactiveElements.forEach(element => {
      // Ensure elements have visible focus indicators
      if (!element.classList.contains('keyboard-focus')) {
        element.addEventListener('focus', ensureFocusVisible);
        element.addEventListener('blur', removeFocusStyle);
      }
    });
  }

  // Ensure focus indicators are visible
  function ensureFocusVisible(event) {
    event.target.classList.add('keyboard-focus');
    
    // Remove tabindex from naturally focusable elements
    if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(event.target.tagName)) {
      event.target.removeAttribute('tabindex');
    }
  }

  // Remove focus style when element loses focus
  function removeFocusStyle(event) {
    event.target.classList.remove('keyboard-focus');
  }

  // Manage focus for accessibility
  function setupFocusManagement() {
    // Handle skip link functionality
    const skipLink = document.querySelector('.skip-link');
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

    // Trap focus within modals/dialogs
    document.addEventListener('keydown', handleFocusTrap);
  }

  // Focus trap handler for modals
  function handleFocusTrap(event) {
    const modal = document.querySelector('[role="dialog"][aria-modal="true"]:focus-within');
    
    if (modal && event.key === 'Tab') {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  // Enhance ARIA attributes
  function setupARIAEnhancements() {
    // Live region for dynamic content updates
    let liveRegion = document.getElementById('a11y-live-region');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
      document.body.appendChild(liveRegion);
    }

    // Mark main content area
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }

  // Announce messages to screen readers
  function announceToScreenReader(message, priority = 'polite') {
    const liveRegion = document.getElementById('a11y-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = '';
      
      // Use setTimeout to ensure screen readers pick up the change
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 100);
    }
  }

  // Handle reduced motion preference
  function handleReducedMotion() {
    if (a11ySettings.reducedMotion) {
      document.body.classList.add('reduced-motion');
      
      // Disable CSS animations and transitions
      const style = document.createElement('style');
      style.id = 'a11y-reduced-motion';
      style.textContent = '*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }';
      document.head.appendChild(style);
    }
  }

  // Public API
  window.A11y = {
    init: initA11y,
    announce: announceToScreenReader,
    settings: a11ySettings
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initA11y);
  } else {
    initA11y();
  }

  // Listen for preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', handleReducedMotion);

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initA11y,
      setupKeyboardNavigation,
      setupFocusManagement,
      setupARIAEnhancements,
      announceToScreenReader,
      ensureFocusVisible,
      removeFocusStyle,
      handleFocusTrap,
      handleReducedMotion
    };
  }
})();