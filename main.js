// main.js - Combined utility and accessibility features

// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(container, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  const handleKeydown = (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  };

  if (container) {
    container.addEventListener('keydown', handleKeydown);
  }

  return {
    remove: () => {
      if (container) {
        container.removeEventListener('keydown', handleKeydown);
      }
    }
  };
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElementsString = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll(focusableElementsString);
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleTabKey);

  return {
    remove: () => {
      container.removeEventListener('keydown', handleTabKey);
    }
  };
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);
  
  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    },
    destroy: () => {
      if (announcer.parentNode) {
        announcer.parentNode.removeChild(announcer);
      }
    }
  };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion,
    createAnnouncer
  };
}

// TODO: add the new functions or changes requested in the issue

/**
 * Checks if a link is accessible by attempting to navigate to it
 * @param {string} link - The URL of the link to check
 * @returns {Promise<boolean>} - Resolves to true if the link is accessible, false otherwise
 */
async function isLinkAccessible(link) {
  try {
    const response = await fetch(link, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// New function requested in the issue (Add back any required exports that might have been?)
// Example: a hypothetical new function
/**
 * New function to demonstrate the addition of a new export
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} - The sum of a and b
 */
function add(a, b) {
  return a + b;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.accessibilityFeatures = initializeAccessibility();
    });
  } else {
    window.accessibilityFeatures = initializeAccessibility();
  }
}