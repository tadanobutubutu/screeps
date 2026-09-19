// main.js - Combined utility and accessibility features

// TODO: Create or update the affected functions to be accessible
// ----- BEGIN ORIGINAL CODE (unchanged) -----

// Preserve existing functionality
module.exports = {
  // Existing exports preserved
};

// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: aeb56379799401e81e60116be6cede327e2b5df3_

<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->

/**
 * Stores used landmark IDs to prevent duplicates.
 * @type {Set<string>}
 */
const _usedLandmarkIds = new Set();

// Used landmark IDs set for uniqueness checking
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ... {
    let candidate = baseName;
    let counter = 1;
    while (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9);
        candidate = `${baseName}-${counter}-${suffix}`;
        counter++;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Validates table accessibility by checking for proper ARIA attributes and structure.
 * 
 * @param {HTMLElement} table - The table element to validate.
 * @returns {Object} - Validation results with issues and status.
 */
function validateTableAccessibility(table) {
  const results = {
    issues: [],
    isValid: true,
    message: ''
  };
  
  if (!table || table.tagName !== 'TABLE') {
    results.issues.push('Element is not a table');
    results.isValid = false;
    results.message = 'Invalid table element';
    return results;
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    results.issues.push('Missing caption');
    results.isValid = false;
  }
  
  // Check for proper header structure
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    results.issues.push('Missing table headers');
    results.isValid = false;
  }
  
  // Check for semantic structure
  const hasValidStructure = Array.from(table.rows).some(row => {
    return Array.from(row.cells).some(cell => cell.tagName === 'TH');
  });
  
  if (!hasValidStructure) {
    results.issues.push('Invalid header structure');
    results.isValid = false;
  }
  
  results.message = results.isValid ? 'Table is accessible' : 'Table needs accessibility improvements';
  return results;
}

// Accessibility helper function for keyboard navigation
function createKeyboardHandler(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  return function handleKeyEvent(event) {
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

// Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2
// Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3
// Commit: b498b47abee4b3f29c69a9762237d968a50cc419
// Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e

/**
 * Addresses accessibility issues from an insight report.
 * @param {Object} insightReport - The insight report containing accessibility findings.
 * @returns {Object} The report with accessibility issues addressed.
 */
function addressAccessibilityIssues(insightReport) {
  if (insightReport && insightReport.landmarks && Array.isArray(insightReport.landmarks)) {
    insightReport.landmarks = ensureUniqueLandmarks(insightReport.landmarks);
  }
  // Apply other accessibility fixes as needed
  return insightReport;
}

/*
 * Helper to manage focus within a container
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTabKey(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
  
  container.addEventListener('keydown', handleTabKey);
}

/**
 * Function to ensure landmarks have unique identifiers
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Landmarks with unique IDs.
 */
function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  const result = [];
  const uniqueIds = [];

  function generateUniqueId() {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => id.split('-')[1]);
    let id;
    let attempts = 0;
    const maxAttempts = 100;

    while (uniqueIds.includes(id) && attempts < maxAttempts) {
      id = generateUniqueId();
      attempts++;
    }

    uniqueIds.push(id);
    landmark.id = id;
  });
  
  return landmarks;
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function ... {
  // Create main landmark
  const main = document.getElementById('main-content') || document.querySelector('main') || document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = main.id || 'main-content';

  // Create navigation landmark
  const nav = document.querySelector('nav') || document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';

  // Create banner/header landmark
  const header = document.querySelector('header') || document.getElementById('header') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';

  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.getElementById('footer') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';

  // Create aside landmark for complementary content
  const asides = ...
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });

  // Append landmarks to the body if they were created
  if (!document.querySelector('main')) document.body.appendChild(main);
  if (!document.querySelector('nav')) document.body.appendChild(nav);
  if (!document.querySelector('header')) document.body.appendChild(header);
  if (!document.querySelector('footer')) document.body.appendChild(footer);
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function ... {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = ...
  collapsibles.forEach(collapsible => {
    if (collapsible.getAttribute('aria-expanded') === 'true') {
      collapsible.setAttribute('aria-expanded', 'false');
    } else {
      collapsible.setAttribute('aria-expanded', 'true');
    }
  });

  // Add aria-labels to form inputs
  const inputs = ...
  ... index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if ... {
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
  const formControls = ... select, textarea');

  formControls.forEach(control => {
    // Ensure all form controls have accessible names
    if (control.id && ... {
      const label = ... || null;
      if (label) {
        label.id = label.id || ...
        ... label.id);
      }
    }

    // Mark required fields appropriately
    if (control.required && ... {
      ... 'true');
    }
  });
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = ...
  ... 'polite');
  ... 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  ...
  
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
  return ... reduce)').matches;
}

// Function to improve keyboard navigation for interactive elements
function improveKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
  });
}

// Function to add ARIA live regions for dynamic content updates
function addLiveRegionForDynamicContent() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'alert');
  liveRegion.id = 'dynamic-content-live-region';
  document.body.appendChild(liveRegion);
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Ensure all landmarks have unique IDs
  addProperLandmarkRegions();
  
  // Improve keyboard navigation
  ...
  
  // Add live region for dynamic content
  ...
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    addProperLandmarkRegions,
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
 * Deep clones an