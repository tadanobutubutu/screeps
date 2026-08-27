// Address accessibility issues from insight report

// Utility function to handle keyboard navigation for interactive elements
function setupKeyboardNavigation(selector, callback) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        callback(element);
      }
    });
  });
}

// Function to manage focus for modal/dialog accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          event.preventDefault();
        }
      }
    }
  });

  firstFocusable?.focus();
}

// Function to announce dynamic content changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Initialize main functionality
function init() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    // Animation code here - only runs if user hasn't requested reduced motion
  }
}

// Handle skip link functionality
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = skipLink.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }
}

// Main initialization on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setupSkipLinks();
  });
} else {
  init();
  setupSkipLinks();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupKeyboardNavigation,
    trapFocus,
    announceToScreenReader,
    init,
    setupSkipLinks
  };
}