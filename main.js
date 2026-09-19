// main.js - Combined utility and accessibility features

// Existing functionality preserved
function exampleFunction() {
  return 'example';
}

// New function implementation
function addressAccessibilityIssuesFromInsightReport(report) {
  // Placeholder logic for addressing accessibility issues based on an insight report
  // This function should be implemented based on the actual requirements and logic
  // that needs to be applied to the report.
  if (!report || !Array.isArray(report)) {
    console.error('Invalid report format');
    return;
  }

  report.forEach(issue => {
    // Implement logic to address each issue in the report
    console.log(`Addressing issue: ${issue.description}`);
    // For demonstration purposes, we are just logging the issue.
    // In a real-world scenario, this could involve modifying the DOM,
    // applying styles, or interacting with other parts of the application.
  });
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
  const focusableElementsString = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll(focusableElementsString);
  
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
    announce: function(message) {
      announcer.textContent = '';
      setTimeout(function() {
        announcer.textContent = message;
      }, 100);
    },
    destroy: function() {
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
    handleKeyboardNavigation,
    trapFocus,
    createAnnouncer,
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

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc4 >
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac4 >
// _Commit: f8051b788bad4952d8493f08d3c722a06ff80d3_
// <!-- todo-hash: b498b47abee4 >
// _Commit: 60d5f1a2c3e4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
// _Commit: abcdef1234567890abcdef1234567890abcdef12

_Commit: feb9680b5af4505068fcf221c52a94afa10f173e_

<!-- todo-hash: e242a52a58b42aca6ca1fe442222a93da9f0c2f4 -->

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    window.accessibilityFeatures = initializeAccessibility();
  });
}