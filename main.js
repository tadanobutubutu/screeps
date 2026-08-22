// TODO: Address accessibility issues from insight report:

/**
 * Initialize accessibility features
 * Addresses issues from accessibility insight report
 */
function initializeAccessibility() {
  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('[role="button"], [role="link"], a, button');
  
  interactiveElements.forEach((element) => {
    // Ensure tabindex is set for keyboard navigation
    if (!element.hasAttribute('tabindex') && (element.tagName === 'DIV' || element.hasAttribute('role'))) {
      element.setAttribute('tabindex', '0');
    }
    
    // Add keyboard event handlers for custom interactive elements
    if (element.hasAttribute('role') || element.tagName === 'DIV') {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    }
  });

  // Manage focus for modal dialogs and dynamic content
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  // Trap focus within modals
  window.trapFocus = function(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusable = focusableContent[0];
    const lastFocusable = focusableContent[focusableContent.length - 1];

    element.addEventListener('keydown', (e) => {
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
  };

  // Announce dynamic content changes to screen readers
  window.announceToScreenReader = function(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.setAttribute('class', 'sr-only');
    announcer.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      announcer.textContent = message;
      setTimeout(() => announcer.remove(), 1000);
    }, 100);
  };

  // Ensure images have alt text
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      console.warn('Accessibility: Image missing alt attribute');
    }
  });

  // Improve form accessibility
  document.querySelectorAll('input, select, textarea').forEach((field) => {
    if (!field.hasAttribute('id')) {
      console.warn('Accessibility: Form field missing id attribute');
    }
  });
}

/**
 * Handle skip link functionality for keyboard users
 */
function initializeSkipLinks() {
  const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '#main');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}

/**
 * Update page title for screen readers when content changes
 */
function updatePageTitle(newTitle) {
  document.title = newTitle;
  window.announceToScreenReader(`Page title changed to: ${newTitle}`);
}

// Export functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    initializeSkipLinks,
    updatePageTitle
  };
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeAccessibility();
    initializeSkipLinks();
  });
} else {
  initializeAccessibility();
  initializeSkipLinks();
}