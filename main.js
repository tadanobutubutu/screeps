// TODO: Address accessibility issues from insight report

// Accessibility utilities
const accessibility = {
  // Ensure keyboard navigation for custom components
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
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
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },

  // Announce changes to screen readers
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      announcer.textContent = message;
      setTimeout(() => document.body.removeChild(announcer), 1000);
    }, 100);
  },

  // Handle escape key for modal/dialog close
  handleEscapeKey(callback) {
    const handler = (e) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  },

  // Reduce motion for users who prefer it
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// Initialize accessibility features
function initAccessibility() {
  // Add skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.tabIndex = -1;
        target.focus();
        e.preventDefault();
      }
    });
  }

  // Ensure all images have alt attributes
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      console.warn('Accessibility: Image missing alt attribute');
    }
  });

  // Ensure form inputs have associated labels
  document.querySelectorAll('input, select, textarea').forEach((input) => {
    if (!input.id) return;
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
      console.warn(`Accessibility: Input ${input.id || input.name} missing label`);
    }
  });
}

// Export functions
module.exports = {
  accessibility,
  initAccessibility
};