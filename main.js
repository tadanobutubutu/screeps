// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Implementation to trap focus within container
  container.addEventListener('keydown', (e) => {
    const isTab = e.key === 'Tab';
    if (!isTab) return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement && lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement && firstElement.focus();
      }
    }
  });
}

// main.js

const main = require('./utilities');
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: function() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Announce message to screen readers
  announceToScreenReader: function(message, priority) {
    if (priority === undefined) {
      priority = 'polite';
    }
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(function() {
      announcer.remove();
    }, 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: function(e, handlers) {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  // New function for focus trap
  newFocusTrap: function(element, options) {
    if (!element) {
      return null;
    }

    const config = options || {};
    const focusableSelector = config.focusableSelector ||
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    let active = true;
    let focusableElements = [];

    // Get all focusable elements within the container
    function getFocusableElements() {
      return Array.from(element.querySelectorAll(focusableSelector)).filter(function(el) {
        return el.offsetParent !== null; // Element is visible
      });
    }

    // Handle keyboard navigation for focus trap
    function handleTrapKeydown(e) {
      if (!active) return;

      if (e.key === 'Tab') {
        focusableElements = getFocusableElements();

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (activeElement === firstElement || !element.contains(activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (activeElement === lastElement || !element.contains(activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }

      // Handle Escape key to release focus trap (if configured)
      if (e.key === 'Escape' && config.allowEscape !== false) {
        releaseTrap();
        if (config.onEscape) {
          config.onEscape(e);
        }
      }
    }

    // Release the focus trap
    function releaseTrap() {
      active = false;
      element.removeEventListener('keydown', handleTrapKeydown);
    }

    // Activate the focus trap
    function activate() {
      active = true;
    }

    // Check if trap is currently active
    function isActive() {
      return active;
    }

    // Initialize the trap
    element.addEventListener('keydown', handleTrapKeydown);

    // Focus first focusable element on init (if configured)
    if (config.autoFocus !== false) {
      focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        setTimeout(function() {
          if (active) {
            focusableElements[0].focus();
          }
        }, 0);
      }
    }

    // Return control object
    return {
      release: releaseTrap,
      activate: activate,
      isActive: isActive,
      updateFocusableElements: function() {
        focusableElements = getFocusableElements();
        return focusableElements;
      }
    };
  },

  // Function to address accessibility issues from insight report
  addressAccessibilityIssues: function(issues) {
    if (!issues || !Array.isArray(issues)) return;

    issues.forEach(issue => {
      try {
        switch(issue.type) {
          case 'missing-alt':
            if (issue.element) {
              issue.element.setAttribute('alt', issue.suggestedText || '');
            }
            break;
          case 'empty-link':
            if (issue.element) {
              issue.element.textContent = issue.suggestedText || 'Link';
            }
            break;
          case 'low-contrast':
            if (issue.element) {
              issue.element.style.color = issue.suggestedColor || '#000000';
            }
            break;
          case 'missing-label':
            if (issue.element) {
              const label = document.createElement('label');
              label.textContent = issue.suggestedText || 'Label';
              label.setAttribute('for', issue.element.id || '');
              issue.element.parentNode.insertBefore(label, issue.element);
            }
            break;
          case 'aria-role':
            if (issue.element) {
              issue.element.setAttribute('role', issue.suggestedRole || 'button');
            }
            break;
          default:
            console.warn('Unknown accessibility issue type:', issue.type);
        }
      } catch (error) {
        console.error('Error addressing accessibility issue:', error);
      }
    });
  }
};

const exportUtils = {
  // ... existing exportUtils implementation
};

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  validateTableAccessibility,
  validateTableStructure,
  renderDependencyGraph,
  renderIndex,
  renderGraphIndex,
  limitTabFunctionality,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  handleFocusTrap,
  revokeSession,
  functionA,
  functionB,
  newFocusTrap,
  addLangAttribute,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  validateTableAccessibilityImpl,
  validateTableStructureImpl,
  transformInputData,
  setSvgAccessibleProps,
  addAccessibleNamesToSVGs,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  addressAccessibilityIssues,
  newFunction,
  newFunction1,
  newFunction2,
  updateGraphRendering
} = main;

const a11yStore = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  newFocusTrap: newFocusTrap,
  addressAccessibilityIssues: addressAccessibilityIssues
};

// Initialize wrapPrimaryContentInMain on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  wrapPrimaryContentInMain();
});

// Import all utilities functions for convenience (merged from both branches)

module.exports = {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  validateTableAccessibility,
  validateTableStructure,
  renderDependencyGraph,
  renderIndex,
  renderGraphIndex,
  newFunction,
  newFunction1,
  newFunction2,
  updateGraphRendering,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  handleFocusTrap,
  revokeSession,
  functionA,
  functionB,
  accessibilityUtils,
  newFocusTrap,
  addLangAttribute,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  validateTableAccessibilityImpl,
  validateTableStructureImpl,
  transformInputData,
  setSvgAccessibleProps,
  addAccessibleNamesToSVGs,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  addressAccessibilityIssues,
  a11yStore,
  trapFocus
};