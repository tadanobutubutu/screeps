// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Accessibility utilities for improved keyboard navigation and screen reader support

/**
 * Initializes skip link functionality for keyboard users
 * Allows users to skip repetitive navigation and jump to main content
 */
const initSkipLink = () => {
  const skipLink = document.querySelector('[data-skip-link]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = skipLink.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        // Announce to screen readers
        announceToScreenReader('Skipped to main content');
      }
    });
  }
};

/**
 * Traps focus within an element (useful for modals/dialogs)
 * @param {HTMLElement} element - The container element to trap focus within
 * @returns {Function} - Cleanup function to remove event listeners
 */
const trapFocus = (element) => {
  if (!element) return () => {};

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
    
    // Close on Escape key
    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('close-modal'));
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Announces message to screen readers using ARIA live region
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
const announceToScreenReader = (message, priority = 'polite') => {
  let announcer = document.getElementById('sr-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  }

  // Clear and set message (ensures announcement even if same message)
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
};

/**
 * Manages focus when modals/dialogs open and close
 * Stores previous focus and restores it on close
 */
const FocusManager = {
  previouslyFocused: null,
  
  saveFocus() {
    this.previouslyFocused = document.activeElement;
  },
  
  restoreFocus() {
    if (this.previouslyFocused && this.previouslyFocused.focus) {
      this.previouslyFocused.focus();
    }
  }
};

/**
 * Handles reduced motion preference
 * Returns true if user prefers reduced motion
 * @returns {boolean}
 */
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Safe focus function that checks if element is focusable
 * @param {HTMLElement} element - Element to focus
 */
const safeFocus = (element) => {
  if (element && typeof element.focus === 'function') {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
};

/**
 * Initialize all accessibility features
 */
const initAccessibility = () => {
  initSkipLink();
  
  // Handle reduced motion preference changes
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', (e) => {
    if (e.matches) {
      announceToScreenReader('Reduced motion enabled');
    }
  });
  
  // Add aria-hidden to off-screen content that shouldn't be read
  document.querySelectorAll('.visually-hidden, [aria-hidden="true"]').forEach(el => {
    if (!el.querySelector('[aria-live]')) {
      el.setAttribute('aria-hidden', 'true');
    }
  });
};

// Export for use in other modules
export {
  initSkipLink,
  trapFocus,
  announceToScreenReader,
  FocusManager,
  prefersReducedMotion,
  safeFocus,
  initAccessibility
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}