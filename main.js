// Main JavaScript file
// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

(function() {
  'use strict';

  // Store focusable elements for keyboard navigation
  let focusableElements = [];

  // Initialize application with accessibility improvements
  function init() {
    const app = document.getElementById('app');
    if (app) {
      app.setAttribute('role', 'application');
      if (!app.getAttribute('aria-label')) {
        app.setAttribute('aria-label', 'Main application content');
      }
      // Make app focusable for keyboard users
      app.setAttribute('tabindex', '0');
    }
  }

  // Handle keyboard navigation improvements
  function handleKeyboardNavigation(event) {
    // Escape key closes modals
    if (event.key === 'Escape') {
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-expanded', 'false');
      }
    }

    // Enter/Space activation for custom controls
    if ((event.key === 'Enter' || event.key === ' ') && event.target.getAttribute('role')) {
      event.preventDefault();
      event.target.click();
    }
  }

  // Improve button accessibility
  function improveButtonAccessibility(event) {
    const button = event.target.closest('button');
    if (button) {
      // Ensure buttons have accessible name
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        button.setAttribute('aria-label', 'Button action');
      }
    }
  }

  // Trap focus within container (for modals/dialogs)
  function trapFocus(container) {
    focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTab(event) {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    container.addEventListener('keydown', handleTab);
    return handleTab;
  }

  // Announce dynamic content changes to screen readers
  function announceToScreenReader(message, priority) {
    priority = priority || 'polite';
    let announcer = document.getElementById('a11y-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
      document.body.appendChild(announcer);
    }

    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }

  // Export functions for external use
  window.Main = {
    init: init,
    trapFocus: trapFocus,
    announce: announceToScreenReader,
    handleKeyboard: handleKeyboardNavigation
  };

  // Event listeners
  document.addEventListener('keydown', handleKeyboardNavigation);
  document.addEventListener('click', improveButtonAccessibility);

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();