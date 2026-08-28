// TODO: Address accessibility issues from insight report

// Accessibility helper functions for improving keyboard navigation and screen reader support

/**
 * Focus management utilities for improved accessibility
 */
const focusManager = {
  /**
   * Set focus to an element with proper focus styles
   * @param {HTMLElement} element - The element to focus
   * @param {Object} options - Focus options
   */
  setFocus(element, options = {}) {
    if (!element) return;
    
    const defaultOptions = {
      preventScroll: false,
      focusVisible: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    element.focus(mergedOptions);
    
    // Ensure focus indicator is visible
    if (mergedOptions.focusVisible) {
      element.classList.add('focus-visible');
    }
  },

  /**
   * Trap focus within a container (for modals/dialogs)
   * @param {HTMLElement} container - The container to trap focus within
   * @returns {Function} Cleanup function to remove trap
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    this.setFocus(firstElement);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
};

/**
 * Announce content changes to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcementElement = document.getElementById('sr-announcer') || createAnnouncementElement();
  
  announcementElement.setAttribute('aria-live', priority);
  announcementElement.textContent = '';
  
  // Use setTimeout to ensure the announcement is read
  setTimeout(() => {
    announcementElement.textContent = message;
  }, 100);
}

function createAnnouncementElement() {
  const element = document.createElement('div');
  element.id = 'sr-announcer';
  element.setAttribute('aria-live', 'polite');
  element.setAttribute('aria-atomic', 'true');
  element.className = 'sr-only';
  element.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
  document.body.appendChild(element);
  return element;
}

/**
 * Handle keyboard navigation for custom components
 * @param {HTMLElement} element - The element to add keyboard support to
 * @param {Object} options - Configuration options
 */
function setupKeyboardNavigation(element, options = {}) {
  const defaultOptions = {
    orientation: 'vertical', // 'vertical' or 'horizontal'
    wrap: false,
    onActivate: null
  };

  const config = { ...defaultOptions, ...options };
  const items = element.querySelectorAll('[role="option"], [role="menuitem"], .keyboard-navigable');

  let currentIndex = -1;

  const handleKeyDown = (e) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = config.orientation === 'vertical' ? currentIndex + 1 : currentIndex;
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = config.orientation === 'vertical' ? currentIndex - 1 : currentIndex;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = config.orientation === 'horizontal' ? currentIndex + 1 : currentIndex;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = config.orientation === 'horizontal' ? currentIndex - 1 : currentIndex;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        if (currentIndex >= 0 && config.onActivate) {
          e.preventDefault();
          config.onActivate(items[currentIndex], currentIndex);
        }
        return;
      default:
        return;
    }

    // Handle wrapping
    if (config.wrap) {
      if (newIndex < 0) newIndex = items.length - 1;
      if (newIndex >= items.length) newIndex = 0;
    } else {
      if (newIndex < 0 || newIndex >= items.length) return;
    }

    // Update selection
    if (newIndex !== currentIndex) {
      if (currentIndex >= 0) {
        items[currentIndex].setAttribute('tabindex', '-1');
        items[currentIndex].removeAttribute('aria-selected');
      }

      currentIndex = newIndex;
      items[currentIndex].setAttribute('tabindex', '0');
      items[currentIndex].setAttribute('aria-selected', 'true');
      items[currentIndex].focus();
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get current main.js content with the TODO comment
 */
function getMainContent() {
  return {
    message: 'Accessibility improvements have been added to main.js',
    features: [
      'Focus management utilities',
      'Screen reader announcement helpers',
      'Keyboard navigation setup',
      'Reduced motion preference detection'
    ]
  };
}

// Export accessibility utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    focusManager,
    announceToScreenReader,
    setupKeyboardNavigation,
    prefersReducedMotion,
    getMainContent
  };
}

// Browser global exports
if (typeof window !== 'undefined') {
  window.accessibilityUtils = {
    focusManager,
    announceToScreenReader,
    setupKeyboardNavigation,
    prefersReducedMotion,
    getMainContent
  };
}