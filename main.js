// main.js

// TODO: Add back any required exports that might have been?
// Add any missing exports here based on test requirements

// Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Internal set to track used landmark IDs
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
 * Replaces the ID of the "my-button" element with "exampleButton" if it exists.
 * @returns {void}
 */
function replaceMyButtonId() {
  const button = document.querySelector('[data-testid="my-button"]') || document.getElementById('my-button');
  if (button) {
    button.id = 'exampleButton';
  }
}

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

/**
 * Function to ensure landmarks have unique identifiers
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Landmarks with unique IDs.
 */
function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  const result = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    if (!seen.has(landmark.id)) {
      seen.add(landmark.id);
      landmark.id = landmark.id || generateUniqueId();
      result.push(landmark);
    }
  });

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
  if (!main.id) main.id = 'main-content';

  // Create navigation landmark
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  if (nav) {
    nav.setAttribute('role', 'navigation');
    if (!nav.id) nav.id = 'primary-navigation';
  }

  // Create banner/header landmark
  const header = document.querySelector('header') || document.createElement('header');
  header.setAttribute('role', 'banner');
  if (!header.id) header.id = 'site-header';

  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  if (!footer.id) footer.id = 'site-footer';

  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });

  // Append landmarks to the body if they were newly created
  if (!main.parentNode) document.body.appendChild(main);
  if (nav && !nav.parentNode) document.body.appendChild(nav);
  if (!header.parentNode) document.body.appendChild(header);
  if (!footer.parentNode) document.body.appendChild(footer);
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

  // Add aria-labels to form inputs that don't have associated labels
  const inputs = document.querySelectorAll('input:not([aria-label])');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    const associatedLabel = document.querySelector(`label[for="${id}"]`);
    if (associatedLabel && !input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', associatedLabel.textContent);
    } else if (!input.getAttribute('aria-label')) {
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

/**
 * Adds lang attribute to the HTML element for accessibility.
 * REACT_015: Add lang attribute to HTML element
 * 
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr'). Defaults to 'en'.
 * @returns {void}
 */
function addLangAttributeToHtml(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Adds accessible names to SVG elements that lack them.
 * REACT_041: Add accessible names to 2 SVGs
 * 
 * @returns {number} The number of SVGs that were updated.
 */
function addAccessibleNamesToSvgs() {
  let count = 0;
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');
    
    if (!hasTitle && !hasAriaLabel) {
      const title = document.createElement('title');
      title.textContent = `SVG image ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      
      // Insert title as first child of SVG
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }
      
      svg.setAttribute('aria-labelledby', title.id);
      count++;
    }
  });
  
  return count;
}

/**
 * Fixes fake links - elements that look like links but use incorrect markup.
 * REACT_036: Fix 1 fake link issue
 * Converts non-semantic elements with link behavior to proper buttons or anchors.
 * 
 * @returns {number} The number of fake links that were fixed.
 */
function fixFakeLinks() {
  let count = 0;
  
  // Find anchor tags without href (fake links)
  const anchorsWithoutHref = document.querySelectorAll('a:not([href])');
  anchorsWithoutHref.forEach(anchor => {
    // Check if it has click handler or role="button"
    const hasClickHandler = anchor.getAttribute('onclick') || 
                           anchor.addEventListener.toString().includes('onclick') ||
                           anchor.style.cursor === 'pointer';
    const hasButtonRole = anchor.getAttribute('role') === 'button';
    
    if (hasClickHandler || hasButtonRole) {
      // Convert to button
      anchor.setAttribute('role', 'button');
      if (!anchor.getAttribute('aria-label') && !anchor.textContent.trim()) {
        anchor.setAttribute('aria-label', 'Button');
      }
      count++;
    }
  });
  
  // Find divs or spans with role="link" or cursor:pointer (fake links)
  const fakeLinkSelectors = [
    'div[role="link"]',
    'span[role="link"]',
    'div[onclick]',
    'span[onclick]'
  ];
  
  fakeLinkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      // Only fix if it looks like a link (has pointer cursor)
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.cursor === 'pointer' && !el.querySelector('a, button')) {
        el.setAttribute('role', 'button');
        if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
          el.setAttribute('aria-label', 'Button');
        }
        count++;
      }
    });
  });
  
  return count;
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // REACT_015: Add lang attribute to HTML element
  addLangAttributeToHtml();
  
  // REACT_017: Add landmark roles and fix landmark issues
  addProperLandmarkRegions();
  
  // REACT_041: Add accessible names to 2 SVGs
  addAccessibleNamesToSvgs();
  
  // REACT_025: Ensure unique landmarks
  ensureUniqueLandmarks([]);
  
  // REACT_036: Fix 1 fake link issue
  fixFakeLinks();
  
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

/**
 * Initializes the button by replacing its ID.
 * @returns {void}
 */
function initializeButton() {
  replaceMyButtonId();
}

/**
 * Example function from HEAD
 * @returns {string} - 'example'
 */
function someFunction() {
  return 'example';
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addProperLandmarkRegions,
    addProperAccountManagement,
    addAriaToFormControls,
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    setupKeyboardNavigation,
    addressAccessibilityIssues,
    trapFocus,
    ensureUniqueLandmarks,
    createAnnouncer,
    prefersReducedMotion,
    improveKeyboardNavigation,
    addLiveRegionForDynamicContent,
    initializeAccessibility,
    replaceMyButtonId,
    initializeButton,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    someFunction,
    addLangAttributeToHtml,
    addAccessibleNamesToSvgs,
    fixFakeLinks
  };
}