// main.js - Main application logic

/**
 * Checks if a link is accessible and properly configured for accessibility
 * @param {string} url - The URL to check
 * @returns {Object} - Object containing isAccessible boolean and message string
 */
function checkLinkAccessibility(url) {
  // Check if URL is provided
  if (!url || typeof url !== 'string') {
    return {
      isAccessible: false,
      message: 'No URL provided'
    };
  }

  try {
    const urlObj = new URL(url);
    
    // Check for valid protocol
    if (!['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol)) {
      return {
        isAccessible: false,
        message: `Invalid protocol: ${urlObj.protocol}`
      };
    }

    // Check for empty hostname
    if (!urlObj.hostname) {
      return {
        isAccessible: false,
        message: 'No hostname provided'
      };
    }

    // Check for fragment-only URLs (page anchors are accessible)
    if (url.startsWith('#')) {
      return {
        isAccessible: true,
        message: 'Internal page anchor'
      };
    }

    return {
      isAccessible: true,
      message: 'Link is accessible'
    };
  } catch (error) {
    return {
      isAccessible: false,
      message: `Invalid URL format: ${error.message}`
    };
  }
}

// Example usage
function validatePageLinks() {
  const links = document.querySelectorAll('a[href]');
  const results = [];

  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const result = checkLinkAccessibility(href);
    
    if (!result.isAccessible) {
      console.warn(`Link ${index + 1}: ${result.message}`, href);
    }
    
    results.push({
      index,
      href,
      ...result
    });
  });

  return results;
}

/**
 * Accessibility utilities for the application
 */
// TODO: This is the existing code that needs to be preserved
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
//_Commit: 7c71fe35502d1cacefd35e209f9d20be82c56fc3_
//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->

/**
 * Manages focus trapping within a container element
 * @param {HTMLElement} container - The container element to trap focus within
 * @returns {Function} - Cleanup function to remove the focus trap
 */
trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

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
  };

  container.addEventListener('keydown', handleTabKey);
  
  // Ensure focus is set to the first focusable element
  if (firstFocusable) {
    firstFocusable.focus();
  }

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
},

/**
 * Announces a message to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
announceToScreenReader(message, priority = 'polite') {
  let announcer = document.getElementById('aria-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'aria-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
    document.body.appendChild(announcer);
  }

  // Clear and set message (ensures announcement even for repeated messages)
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
},

/**
 * Handles escape key to close modals/dropdowns
 * @param {Function} closeCallback - Function to call when Escape is pressed
 * @param {HTMLElement} element - Element to attach the listener to
 */
handleEscapeKey(closeCallback, element = document) {
  const handler = (e) => {
    if (e.key === 'Escape' && typeof closeCallback === 'function') {
      closeCallback();
    }
  };
  
  element.addEventListener('keydown', handler);
  
  return () => {
    element.removeEventListener('keydown', handler);
  };
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure skip link functionality if present
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
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
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkLinkAccessibility, validatePageLinks, AccessibilityUtils };
}