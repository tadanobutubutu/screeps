// TODO: Address accessibility issues from insight report:

/**
 * Main application module for accessibility improvements
 */

// Ensure proper focus management for accessibility
const focusManagement = {
  // Store previously focused element for restoration
  lastFocusedElement: null,

  // Trap focus within a container (modal, dialog, etc.)
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleTabKey);
  },

  // Save focus before modal/dialog opens
  saveFocus() {
    this.lastFocusedElement = document.activeElement;
  },

  // Restore focus after modal/dialog closes
  restoreFocus() {
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }
};

// Announce dynamic content changes to screen readers
const liveRegion = {
  announce(message, priority = 'polite') {
    let announcer = document.getElementById('aria-live-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'aria-live-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only'; // Use screen-reader-only class
      announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      document.body.appendChild(announcer);
    }

    // Clear and set message (forces re-announcement)
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }
};

// Utility to generate unique IDs for ARIA relationships
const generateId = (() => {
  let counter = 0;
  return (prefix = 'aria-id') => `${prefix}-${++counter}`;
})();

// Ensure all interactive elements have proper roles and labels
const validateAccessibility = () => {
  const issues = [];
  
  // Check for buttons without accessible names
  document.querySelectorAll('button').forEach((btn, index) => {
    if (!btn.textContent.trim() && !btn.getAttribute('aria-label') && !btn.querySelector('img[alt]')) {
      issues.push(`Button at index ${index} has no accessible name`);
    }
  });

  // Check for images without alt text
  document.querySelectorAll('img').forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push(`Image at index ${index} is missing alt attribute`);
    }
  });

  return issues;
};

// Initialize accessibility features
function initAccessibility() {
  // Ensure skip link functionality
  const skipLink = document.querySelector('a[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  console.log('Accessibility features initialized');
}

// Export for use in other modules
export { focusManagement, liveRegion, generateId, validateAccessibility, initAccessibility };