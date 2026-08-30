// main.js - Combined utility and accessibility features

// Existing functionality preserved
function exampleFunction() {
  return 'example';
}

// New function implementation
function processData(input) {
  if (!input) {
    return null;
  }
  return input;
}

// Accessibility helper function for keyboard navigation
function handleKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  return (event) => {
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
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  return (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
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
  
  return {
    announce: announcer.announce,
    handleKeyboardNavigation,
    trapFocus,
    prefersReducedMotion
  };
}

/**
 * Validates landmark elements in a given container
 * Checks for proper landmark structure, required landmarks, and accessibility issues
 * @param {Element} [root=document.body] - Root element to search within
 * @param {Object} [options={}] - Validation options
 * @param {boolean} [options.checkRequired=true] - Whether to check for required landmarks
 * @returns {Object} Validation result object
 */
function validateLandmark(root = document.body, options = {}) {
  const {
    checkRequired = true
  } = options;

  // Valid landmark roles according to ARIA specification
  const validLandmarkRoles = [
    'banner', 'navigation', 'main', 'complementary', 'contentinfo', 
    'search', 'form', 'region'
  ];

  // Find all elements with explicit landmark roles
  const landmarks = [];
  
  validLandmarkRoles.forEach(role => {
    const elements = root.querySelectorAll(`[role="${role}"]`);
    elements.forEach(el => {
      landmarks.push({
        role: role,
        element: el,
        id: el.id || null
      });
    });
  });

  // Check for duplicate IDs
  const idCount = {};
  landmarks.forEach(lm => {
    if (lm.id) {
      idCount[lm.id] = (idCount[lm.id] || 0) + 1;
    }
  });

  const duplicateIds = Object.keys(idCount).filter(id => idCount[id] > 1);

  // Check for missing landmark roles (if checking required)
  const foundRoles = landmarks.map(lm => lm.role);
  const missingRoles = checkRequired 
    ? validLandmarkRoles.filter(role => !foundRoles.includes(role) && 
        ['main', 'navigation', 'banner'].includes(role))
    : [];

  // Check for accessibility issues
  const issues = [];

  // Check for multiple main landmarks (best practice is one)
  const mainLandmarks = landmarks.filter(lm => lm.role === 'main');
  if (mainLandmarks.length > 1) {
    issues.push({
      type: 'multiple-main-landmarks',
      message: `Found ${mainLandmarks.length} <main> landmarks. Best practice is to have exactly one.`,
      severity: 'warning'
    });
  }

  // Check for missing main landmark
  if (checkRequired && mainLandmarks.length === 0) {
    issues.push({
      type: 'missing-main',
      message: 'No <main> landmark found. Pages should have exactly one main landmark.',
      severity: 'error'
    });
  }

  // Check navigation landmarks for proper labeling
  const navLandmarks = landmarks.filter(lm => lm.role === 'navigation');
  navLandmarks.forEach((nav, index) => {
    if (!nav.id && !nav.element.getAttribute('aria-label') && 
        !nav.element.getAttribute('aria-labelledby')) {
      issues.push({
        type: 'unlabeled-navigation',
        message: `Navigation landmark at index ${index} is missing an accessible label (id, aria-label, or aria-labelledby).`,
        severity: 'warning'
      });
    }
  });

  return {
    isValid: issues.filter(i => i.severity === 'error').length === 0,
    landmarks: landmarks,
    landmarkCount: landmarks.length,
    rolesFound: [...new Set(foundRoles)],
    duplicateIds: duplicateIds,
    missingRoles: missingRoles,
    issues: issues
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    exampleFunction,
    processData,
    initializeAccessibility,
    handleKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    addAccessibleNamesToSvg,
    validateLandmark
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}