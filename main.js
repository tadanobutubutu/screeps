// TODO: Address accessibility issues from insight report:

/**
 * Initialize accessibility features for the application
 */
function initializeAccessibility() {
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  
  interactiveElements.forEach(element => {
    // Ensure all interactive elements are keyboard accessible
    if (!element.hasAttribute('tabindex') && !element.hasAttribute('disabled')) {
      element.setAttribute('tabindex', '0');
    }
    
    // Add focus indicators for keyboard users
    element.addEventListener('focus', () => {
      element.classList.add('keyboard-focus');
    });
    
    element.addEventListener('blur', () => {
      element.classList.remove('keyboard-focus');
    });
  });
  
  // Handle skip links if present
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = skipLink.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
  
  // Ensure proper ARIA attributes on forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    if (!form.hasAttribute('aria-label') && !form.hasAttribute('aria-labelledby')) {
      const formTitle = form.querySelector('h1, h2, h3, legend');
      if (formTitle) {
        form.setAttribute('aria-labelledby', formTitle.id || `form-title-${Math.random().toString(36).substr(2, 9)}`);
        if (!formTitle.id) {
          formTitle.id = form.getAttribute('aria-labelledby');
        }
      }
    }
  });
  
  // Add live region for dynamic content updates
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'visually-hidden';
  document.body.appendChild(liveRegion);
  
  return liveRegion;
}

/**
 * Announce message to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const liveRegion = document.querySelector('[aria-live]') || initializeAccessibility();
  if (liveRegion) {
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

/**
 * Handle keyboard navigation for custom components
 * @param {HTMLElement} element - The element to make keyboard accessible
 * @param {string[]} keys - Array of keys to handle (default: arrow keys)
 */
function setupKeyboardNavigation(element, keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
  element.addEventListener('keydown', (e) => {
    if (keys.includes(e.key)) {
      e.preventDefault();
      const focusableElements = element.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      const focusableArray = Array.from(focusableElements);
      const currentIndex = focusableArray.indexOf(document.activeElement);
      
      let nextIndex;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextIndex = currentIndex < focusableArray.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableArray.length - 1;
      }
      
      focusableArray[nextIndex].focus();
    }
  });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    announceToScreenReader,
    setupKeyboardNavigation
  };
}