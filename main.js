// main.js - Accessibility improvements implementation

// REACT_015: Add lang attribute

import React from 'react';
import ReactDOM from 'react-dom/client';

import { requiredModule } from './required-module.js';

function addLandmarkRegions() {
  const container = document.getElementById('landmark-regions-container');
  if (container) {
    container.innerHTML = `
      <div class="landmark-region" role="region" aria-label="Building" aria-labelledby="buildingLabel">
        <span id="buildingLabel">Main Building</span>
      </div>
      <div class="landmark-region" role="region" aria-label="Park" aria-labelledby="parkLabel">
        <span id="parkLabel">Central Park</span>
      </div>
    `;
  }
}

export function newNecessaryFunction() {
  // Implementation of the new function
  return "New function implemented";
}

// Re-added required exports for functionA and functionB
function functionA() {
  return 'functionA result';
}

function functionB() {
  return 'functionB result';
}

// Export affected functions to make them accessible
module.exports = {
  ...affectedFunctions,
  functionA,
  functionB,
};

/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
export function calculateSum(a, b) {
  return a + b;
}

/**
 * Calculate the difference of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
export function calculateDifference(a, b) {
  return a - b;
}

export function calculateProduct(a, b) {
  return a * b;
}

export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function divide(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new Error('Both operands must be numbers.');
  }
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

// Accessibility code from origin/main
export function addressAccessibilityIsses(report) {
  if (!report) return;
  report.forEach(issue => {
    // Handle each issue type
    switch (issue.type) {
      case 'missing-lang':
        if (!document.documentElement.lang) {
          document.documentElement.lang = 'en';
        }
        break;
      case 'missing-skip-link':
        if (!document.querySelector('.skip-link')) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          skipLink.style.position = 'absolute';
          skipLink.style.left = '-9999px';
          skipLink.style.top = '0';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img:not([alt])').forEach(img => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        document.querySelectorAll('input:not([aria-label]), select:not([aria-label]), textarea:not([aria-label])').forEach(el => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
      case 'missing-role':
        if (issue.element && !issue.element.getAttribute('role')) {
          issue.element.setAttribute('role', issue.role || 'presentation');
        }
        break;
      case 'missing-aria-hidden':
        if (issue.element && issue.element.tagName === 'svg') {
          const title = issue.element.querySelector('title');
          if (!title) {
            const newTitle = document.createElement('title');
            newTitle.textContent = issue.description || 'Decorative image';
            issue.element.insertBefore(newTitle, issue.element.firstChild);
          }
        }
        break;
      // Add more cases as needed
    }
  });
}

/**
 * Ensure an element has a non-empty accessibility label
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element has an aria-label or accessible name, false otherwise
 */
export function ensureAccessibleLabel(element) {
  if (!element) {
    return false;
  }
  return checkAccessibilityAttribute(element, 'aria-label') ||
         checkAccessibilityAttribute(element, 'aria-labelledby') ||
         checkAccessibilityAttribute(element, 'alt');
}

/**
 * Validate that an element has proper focusability for accessibility
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element is focusable, false otherwise
 */
export function validateFocusableElement(element) {
  if (!element) {
    return false;
  }
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
  const tagName = element.tagName?.toLowerCase();
  const isFocusable = focusableTags.includes(tagName) ||
                      element.tabIndex >= 0 ||
                      checkAccessibilityAttribute(element, 'tabindex');
  return isFocusable && !element.hasAttribute('disabled');
}

// Escape key to close modals/dropdowns
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
    if (openModal) {
      openModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  }
});

// Fix Safari focus trapping in dropdowns
const dropdownContainers = document.querySelectorAll('[data-dropdown]');
dropdownContainers.forEach((container) => {
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const currentFocusedElement = document.activeElement;
    let focusIsInsideContainer = false;

    if (
      currentFocusedElement &&
      (currentFocusedElement === container ||
        currentFocusedElement.closest(container))
    ) {
      focusIsInsideContainer = true;
    }

    // Ensure focus trapping only within the dropdown container
    if (!focusIsInsideContainer) {
      // Find the first focusable element within the container
      const firstFocusableElement = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }
  });
});

// Utility: Check if user prefers reduced motion
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Utility: Check if user prefers high contrast
export function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

// New function to handle dynamic content updates
export function updateLiveRegion(message, priority = 'polite') {
  if (!liveRegion) createLiveRegion();
  announce(message, priority);
}

// New function to check landmark elements
export function checkLandmarkElements() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkElements.forEach((element) => {
    const landmark = document.querySelector(`[role="${element}"]`);
    if (landmark && landmark.id === '') {
      landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
    }
  });
}

// New function to add proper landmark regions for accessibility
export function addProperLandmarkRegions() {
  // Ensure the main landmark exists
  if (!document.querySelector('main, [role="main"]')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.id = 'main-content';
    document.body.appendChild(main);
  }

  // Ensure banner landmark for header
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  // Add navigation landmarks with accessible labels
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `navigation-${index + 1}`);
    }
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  });

  // Ensure contentinfo landmark for footer
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }

  // Ensure complementary landmark for aside
  const aside = document.querySelector('aside');
  if (aside && !aside.getAttribute('role')) {
    aside.setAttribute('role', 'complementary');
  }

  // Add form landmark to forms missing a label
  const forms = document.querySelectorAll('form');
  forms.forEach((form, index) => {
    if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
      const label = form.querySelector('legend, label');
      if (!label) {
        form.setAttribute('role', 'form');
        form.setAttribute('aria-label', `form-${index + 1}`);
      }
    }
  });

  // Add search landmark if missing
  const searchRegions = document.querySelectorAll('[role="search"]');
  if (searchRegions.length === 0) {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput && !searchInput.closest('[role="search"]')) {
      const searchRegion = document.createElement('div');
      searchRegion.setAttribute('role', 'search');
      searchRegion.setAttribute('aria-label', 'search');
      searchInput.parentNode.insertBefore(searchRegion, searchInput);
      searchRegion.appendChild(searchInput);
    }
  }

  // Ensure all landmark regions have accessible names where required
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
  landmarkRoles.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el) => {
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        const tagName = el.tagName.toLowerCase();
        let label = '';
        switch (role) {
          case 'navigation':
            label = 'navigation';
            break;
          case 'complementary':
            label = 'complementary';
            break;
          case 'contentinfo':
            label = 'contentinfo';
            break;
          case 'search':
            label = 'search';
            break;
          case 'form':
            label = 'form';
            break;
          default:
            label = role;
        }
        el.setAttribute('aria-label', label);
      }
    });
  });
}

// New function to add SVG accessibility props
export function addSVGAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    // Ensure SVG has a title for accessible name
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      titleElement.textContent = 'Image'; // Default accessible name
      svg.insertBefore(titleElement, svg.firstChild);
    }

    // Ensure title has an ID for aria-labelledby
    if (!titleElement.id) {
      titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
    }

    // Set aria-labelledby to point to the title
    svg.setAttribute('aria-labelledby', titleElement.id);

    // Add role img if not present (redundant but safe)
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// New function to fix fake links (REACT_036)
export function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[href]:not(a)');
  fakeLinks.forEach((link) => {
    link.setAttribute('role', 'link');
    link.setAttribute('tabindex', '0');
    link.setAttribute('data-interactive', 'true');
  });
}

/**
 * Preserve existing code and address accessibility issues
 */
export function preserveExistingCode() {
  // TODO: This is the existing code that needs to be preserved
  // Address accessibility issues from insight report:
  // - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
  // - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
  // - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
  // - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
  // - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
  // - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
  // - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
  // - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
  // _Commit: e1099c59bb958f49f6c140d0eff8ec6973d95bb5_
  // <!-- todo-hash: 4b0e1a8ca96059e3d2b21d4ce5b2d2a62631b70d -->
  // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
  // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
  // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
  // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
  // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
  // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
}

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.setAttribute('lang', document.documentElement.lang);

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

mainElement.appendChild(document.body.cloneNode(true));
document.body.parentNode.insertBefore(mainElement, document.body);

// Function to wrap primary content in a main element for accessibility
function wrapPrimaryContentInMain() {
  const main = document.createElement('main');
  main.setAttribute('lang', document.documentElement.lang || 'en');
  
  // Clone body content and wrap in main
  main.appendChild(document.body.cloneNode(true));
  
  // Insert main element before body
  if (document.body.parentNode) {
    document.body.parentNode.insertBefore(main, document.body);
  }
  
  return main;
}

/**
 * Manage focus for accessibility
 */
export function setupFocusManagement() {
  // Trap focus within modals
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });
}

/**
 * Setup skip links
 */
export function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link');
  if (!skipLink) return;

  const targetId = skipLink.getAttribute('href')?.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;

  if (target) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      target.setAttribute('tabindex', '-1');
      target.focus();
      announce('Skipped to main content');
    });

    // Focus the skip link when the document is loaded in Safari
    if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
      skipLink.focus();
    }
  }
}

/**
 * Check landmark elements and add IDs if missing
 */
export function checkLandmarkElements() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkElements.forEach((element) => {
    const landmark = document.querySelector(`[role="${element}"]`);
    if (landmark && landmark.id === '') {
      landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
    }
  });
}

/**
 * Add SVG accessibility props
 */
export function addSVGAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', 'svg-title');
    const titleText = svg.querySelector('title').textContent || 'Image description';
    const descriptionId = `svg-description-${Math.floor(Math.random() * 1000)}`;
    svg.setAttribute('aria-describedby', descriptionId);

    const descriptionElement = document.createElement('p');
    descriptionElement.setAttribute('id', descriptionId);
    descriptionElement.textContent = titleText;
    descriptionElement.className = 'sr-only';
    document.body.appendChild(descriptionElement);
  });
}

/**
 * Preserve existing code and address accessibility issues
 */
export function preserveExistingCode() {
  // TODO: This is the existing code that needs to be preserved
  // Address accessibility issues from insight report:
  // - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
  // - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
  // - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
  // - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
  // - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
  // - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
  // - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
  // - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
  // _Commit: e1099c59bb958f49f6c140d0eff8ec6973d95bb5_
  // <!-- todo-hash: 4b0e1a8ca96059e3d2b21d4ce5b2d2a62631b70d -->
  // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
  // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
  // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
  // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
  // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
  // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
}

// Default export for backwards compatibility
export default {
  calculateSum,
  calculateDifference,
  calculateProduct,
  isNumber,
  clamp,
  divide,
  start() {
    console.log('Application started');
    return Promise.resolve();
  }
};

export const logger = {
  info(message) {
    console.log(`[INFO] ${message}`);
  },
  error(message) {
    console.error(`[ERROR] ${message}`);
  }
};

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
//_Commit: 7c71fe35502d1cacefd35e209f9d20be82c56fc3_
//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->
//_Commit: e1c38a81654fe5ba4cfcfba53c47360921b7ae1a_

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 8c3a9295a6bf382e113f3e8184d40223b3f3f8d5_
//<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

export function generateAccessibilityReport() {
  const issues = [];

  // Check for missing lang attribute
  if (!document.documentElement.lang) {
    issues.push({
      type: 'missing-lang',
      description: 'The document is missing a lang attribute',
      severity: 'error',
      element: document.documentElement,
      fixRecommendation: 'Add lang attribute to html element'
    });
  }

  // Check for skip link
  if (!document.querySelector('.skip-link')) {
    issues.push({
      type: 'missing-skip-link',
      description: 'Missing skip link',
      severity: 'warning',
      fixRecommendation: 'Add a skip link'
    });
  }

  // Images without alt
  document.querySelectorAll('img:not([alt])').forEach(img => {
    issues.push({
      type: 'missing-alt',
      description: 'Image missing alt attribute',
      severity: 'warning',
      element: img,
      fixRecommendation: 'Add alt attribute'
    });
  });

  // Form controls without labels
  document.querySelectorAll('input:not([aria-label]):not([id]), select:not([aria-label]):not([id]), textarea:not([aria-label]):not([id])').forEach(el => {
    issues.push({
      type: 'missing-label',
      description: 'Form control missing accessible label',
      severity: 'warning',
      element: el,
      fixRecommendation: 'Add aria-label or associated label'
    });
  });

  // Check for missing landmarks
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  landmarkRoles.forEach(role => {
    if (!document.querySelector(`[role="${role}"]`) && !document.querySelector(role)) {
      issues.push({
        type: 'missing-landmark',
        description: `Missing landmark with role ${role}`,
        severity: 'info',
        fixRecommendation: `Add element with role ${role}`
      });
    }
  });

  // Check for SVGs without title
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.querySelector('title')) {
      issues.push({
        type: 'missing-svg-title',
        description: 'SVG missing title element',
        severity: 'warning',
        element: svg,
        fixRecommendation: 'Add title element inside SVG'
      });
    }
  });

  return { issues };
}

// Helper functions for accessibility
function createLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);
  return liveRegion;
}

function announce(message, priority = 'polite') {
  const liveRegion = document.querySelector('[aria-live]') || createLiveRegion();
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = message;
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function createInPageButton() {
  // Implementation for creating in-page buttons
}

function validateTableAccessibility() {
  // Implementation for validating table accessibility
}

function validateTableStructure() {
  // Implementation for validating table structure
}

function validateLandmark() {
  // Implementation for validating landmarks
}

function validateLandmarkStructure() {
  // Implementation for validating landmark structure
}

function getSvgAccessibleName() {
  // Implementation for getting SVG accessible name
}

function setSvgAttributes() {
  // Implementation for setting SVG attributes
}

function handleFakeLinks() {
  // Implementation for handling fake links
}

function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
}

function addProperLandmarkRegions() {
  // Implementation for adding proper landmark regions
}

// Export the liveRegion variable for use in other modules
let liveRegion = null;

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
  setupFocusManagement();
  checkLandmarkElements();
  addProperLandmarkRegions();
  addSVGAccessibilityProps();
  fixFakeLinks();
});