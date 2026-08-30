// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks

_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: aeb56379799401e81e60116be6cede327e2b5df3_

//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->

/**
 * Generates a report based on accessibility issues found in the document.
 * @returns {Object} A report containing accessibility findings categorized by type.
 */
function generateAccessibilityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: 0,
      critical: 0,
      moderate: 0,
      minor: 0
    },
    issues: {
      landmarks: [],
      formControls: [],
      keyboardNavigation: [],
      ariaAttributes: [],
      images: []
    }
  };

  // Check landmarks for uniqueness and proper roles
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside, [role="region"], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  const landmarkIds = new Set();
  
  landmarks.forEach(landmark => {
    const id = landmark.id;
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || '';
    
    if (id) {
      if (landmarkIds.has(id)) {
        report.issues.landmarks.push({
          type: 'DUPLICATE_ID',
          severity: 'critical',
          message: `Duplicate landmark ID: "${id}"`,
          element: tagName
        });
        report.summary.totalIssues++;
        report.summary.critical++;
      }
      landmarkIds.add(id);
    } else {
      report.issues.landmarks.push({
        type: 'MISSING_ID',
        severity: 'moderate',
        message: `Landmark missing ID attribute`,
        element: tagName,
        role: role || null
      });
      report.summary.totalIssues++;
      report.summary.moderate++;
    }
  });

  // Check for main landmark
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    report.issues.landmarks.push({
      type: 'MISSING_MAIN',
      severity: 'critical',
      message: 'No main landmark found in the document'
    });
    report.summary.totalIssues++;
    report.summary.critical++;
  } else if (mainElements.length > 1) {
    report.issues.landmarks.push({
      type: 'MULTIPLE_MAIN',
      severity: 'moderate',
      message: `Multiple main landmarks found (${mainElements.length})`,
      count: mainElements.length
    });
    report.summary.totalIssues++;
    report.summary.moderate++;
  }

  // Check form controls for accessibility
  const formControls = document.querySelectorAll('input, select, textarea');
  formControls.forEach((control, index) => {
    const id = control.id;
    const hasLabel = control.getAttribute('aria-label') || 
                     control.getAttribute('aria-labelledby') ||
                     document.querySelector(`label[for="${id}"]`);
    
    if (!hasLabel && !['hidden', 'submit', 'button', 'reset'].includes(control.type)) {
      report.issues.formControls.push({
        type: 'MISSING_LABEL',
        severity: 'critical',
        message: `Form control missing accessible label`,
        element: control.tagName.toLowerCase(),
        type: control.type || 'text'
      });
      report.summary.totalIssues++;
      report.summary.critical++;
    }

    if (control.required && !control.getAttribute('aria-required')) {
      report.issues.formControls.push({
        type: 'MISSING_ARIA_REQUIRED',
        severity: 'minor',
        message: `Required field missing aria-required attribute`,
        element: control.tagName.toLowerCase()
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }
  });

  // Check for images without alt text
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      report.issues.images.push({
        type: 'MISSING_ALT',
        severity: 'critical',
        message: 'Image missing alt attribute'
      });
      report.summary.totalIssues++;
      report.summary.critical++;
    } else if (img.getAttribute('alt') === '' && !img.hasAttribute('role')) {
      report.issues.images.push({
        type: 'EMPTY_ALT',
        severity: 'moderate',
        message: 'Image has empty alt attribute - consider if decorative'
      });
      report.summary.totalIssues++;
      report.summary.moderate++;
    }
  });

  // Check for interactive elements without keyboard support
  const interactiveElements = document.querySelectorAll('[role="button"], [role="link"]');
  interactiveElements.forEach(element => {
    const isAnchor = element.tagName.toLowerCase() === 'a';
    const isButton = element.tagName.toLowerCase() === 'button';
    const hasTabIndex = element.hasAttribute('tabindex');
    
    if (!isAnchor && !isButton && !hasTabIndex) {
      report.issues.keyboardNavigation.push({
        type: 'NOT_KEYBOARD_ACCESSIBLE',
        severity: 'moderate',
        message: 'Interactive element may not be keyboard accessible',
        element: element.tagName.toLowerCase(),
        role: element.getAttribute('role')
      });
      report.summary.totalIssues++;
      report.summary.moderate++;
    }
  });

  // Check for proper ARIA usage
  const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
  elementsWithAria.forEach(element => {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim() === '') {
      report.issues.ariaAttributes.push({
        type: 'EMPTY_ARIA_LABEL',
        severity: 'minor',
        message: 'Element has empty aria-label',
        element: element.tagName.toLowerCase()
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }
  });

  return report;
}

/**
 * Addresses accessibility issues from an insight report.
 * @param {Object} insightReport - The insight report containing accessibility findings.
 * @returns {Object} The report with accessibility issues addressed.
 */
function addressAccessibilityIssues(insightReport) {
  // Implementation to address accessibility issues from an insight report.
  // Apply specific accessibility fixes here based on the report's structure.
  // For now, we simply return the report unchanged.
  return insightReport;
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="region"]');
  let uniqueIds = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => id.split('-')[1]);
    let id;

    while (existingIds.includes(landmark.id.split('-')[1])) {
      id = generateUniqueId();
    }

    uniqueIds.push(id);
    landmark.id = id;
  });
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
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
  });
}

// Set of used landmark IDs for ensuring uniqueness
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Create main landmark
  const main = document.querySelector('main') || document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = 'main-content';

  // Create navigation landmark
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';

  // Create banner/header landmark
  const header = document.querySelector('header') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';

  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';

  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = document.querySelectorAll('[aria-expanded]');
  collapsibles.forEach(collapsible => {
    if (collapsible.getAttribute('aria-expanded') === 'true') {
      collapsible.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-labels to form inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', `Input field ${index + 1}`);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaToFormControls() {
  // Add required aria attributes to form controls
  const formControls = document.querySelectorAll('input, select, textarea');

  formControls.forEach(control => {
    // Ensure all form controls have accessible names
    if (control.id && !control.getAttribute('aria-label')) {
      const label = document.querySelector(`label[for="${control.id}"]`) || null;
      if (label) {
        label.id = label.id || `label-${control.id}`;
        control.setAttribute('aria-labelledby', label.id);
      }
    }

    // Mark required fields appropriately
    if (control.required && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
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

// Function to improve keyboard navigation for interactive elements
function improveKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll('[tabindex="-1"]');
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
  });
}

// Function to add ARIA live regions for dynamic content updates
function addLiveRegionForDynamicContent() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'alert');
  document.body.appendChild(liveRegion);
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks();
  
  // Improve keyboard navigation
  improveKeyboardNavigation();
  
  // Add live region for dynamic content
  addLiveRegionForDynamicContent();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion
  };
}

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

// Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
// Assumes you have already set the id on the button element in your code.

replaceMyButtonId();
addProperLandmarkRegions();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addProperLandmarkRegions,
    addProperAccountManagement,
    addAriaToFormControls,
    replaceMyButtonId,
    getLangAttribute,
    getFullLangAttribute,
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    ensureUniqueLandmarks,
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    generateAccessibilityReport
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}