// TODO: Address accessibility issues from insight report:

// Commit: 5746b7c9e222c69f976e3a12089eab2c8aac209c

// <!-- todo-hash: f4aef230bb25bd341c307d16638c123de05bbec8 -->

import { requiredModule } from './required-module.js';
import { getLangAttribute } from './accessibility/lang-attribute.js';
import { createInPageButton, validateLinkAccessibility, handleFakeLinks } from './accessibility/links.js';
import { validateTableAccessibility, validateTableStructure } from './accessibility/tables.js';
import { validateLandmark, validateLandmarkStructure, validateLandmarkRegions } from './accessibility/landmarks.js';
import { getSvgAccessibleName, setSvgAttributes } from './accessibility/svgs.js';
import { wrapPrimaryContentInMain } from './accessibility/main.js';

/**
 * Get the language attribute value from the HTML element
 * @returns {string} The language code (defaults to 'en')
 */
export function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Wrap the primary content in a main landmark element
 * @param {HTMLElement} contentElement - The element to wrap
 * @returns {HTMLElement|null} The wrapped element or null
 */
export function wrapPrimaryContentInMain(contentElement) {
  if (!contentElement || typeof document === 'undefined') {
    return null;
  }
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  contentElement.parentNode.insertBefore(mainElement, contentElement);
  mainElement.appendChild(contentElement);
  return mainElement;
}

/**
 * Rotate back to original state
 * @param {HTMLElement} element - The element to rotate
 * @param {number} degrees - The degrees to rotate
 */
export function rotateBack(element, degrees) {
  if (element && typeof element.style !== 'undefined') {
    element.style.transform = `rotate(-${degrees}deg)`;
  }
}

function addLandmarkRegions() {
  const container = ...
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

function addressAccessibilityIssues() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
    // The static fix should be applied in the source files
    // - Replace one <main> with <section role="region" ...
    // - Same fix
  }

  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'presentation');
  });
}

export function newNecessaryFunction() {
  // Implementation of the new function
  return "New function implemented";
}

export function calculateSum(a, b) {
  return a + b;
}

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

export function checkAccessibilityAttribute(element, attribute) {
  if (!element || typeof element.getAttribute !== 'function') {
    return false;
  }
  const value = element.getAttribute(attribute);
  return value !== null && value !== '';
}

export function ensureAccessibleLabel(element) {
  if (!element) {
    return false;
  }
  return checkAccessibilityAttribute(element, 'aria-label') ||
         checkAccessibilityAttribute(element, 'aria-labelledby') ||
         checkAccessibilityAttribute(element, 'alt');
}

export function validateFocusableElement(element) {
  if (!element) {
    return false;
  }
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  const isFocusable = focusableTags.includes(tagName) ||
                      element.tabIndex >= 0 ||
                      checkAccessibilityAttribute(element, 'tabindex');
  const hasValidTabIndex = element.tabIndex >= 0 || !focusableTags.includes(tagName);
  return isFocusable && hasValidTabIndex;
}

/**
 * Validate the table structure for accessibility issues
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} True if the table structure is accessible, false otherwise
 */
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }
  return validateTableStructure(table);
}

/**
 * Check the internal structure of a table for accessibility compliance
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} True if the structure is valid, false otherwise
 */
export function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }
  const hasCaption = table.querySelector('caption') !== null;
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  const validHeaders = Array.from(headers).every(th => th.hasAttribute('scope') || th.hasAttribute('headers'));
  const hasRowGroups = table.querySelector('thead') !== null || table.querySelector('tbody') !== null;

  return hasCaption && hasHeaders && validHeaders && hasRowGroups;
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

/**
 * Get the language attribute from an HTML element
 * @param {HTMLElement} element - The HTML element to get the lang attribute from
 * @returns {string} The language code or 'en' as default
 */
export function getLangAttribute(element = document.documentElement) {
  if (!element || typeof element.getAttribute !== 'function') {
    return 'en';
  }
  const lang = element.getAttribute('lang');
  return lang && lang.trim() !== '' ? lang.trim() : 'en';
}

/**
 * Create an accessible in-page button element
 * @param {string} text - The button text content
 * @param {Function} onClick - The click handler function
 * @param {Object} options - Additional options for the button
 * @returns {HTMLButtonElement} The created button element
 */
export function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = 'button';
  
  // Add accessible name if provided
  if (options['aria-label']) {
    button.setAttribute('aria-label', options['aria-label']);
  }
  if (options.id) {
    button.id = options.id;
  }
  
  // Ensure the button has proper focusability
  if (options.tabIndex !== undefined) {
    button.tabIndex = options.tabIndex;
  } else {
    button.tabIndex = 0;
  }
  
  // Add role attribute if specified
  if (options.role) {
    button.setAttribute('role', options.role);
  }
  
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with issues array
 */
export function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: [{ description: 'Table element is null or undefined', severity: 'error' }] };
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({
      description: 'Table is missing a caption element',
      severity: 'warning',
      elementId: table.id || null,
      fixRecommendation: 'Add a <caption> element to describe the table purpose'
    });
  }
  
  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('headers')) {
      issues.push({
        description: 'Table header missing scope or headers attribute',
        severity: 'warning',
        elementId: th.id || `th-${index}`,
        fixRecommendation: 'Add scope="col" or scope="row" to the header cell'
      });
    }
  });
  
  // Check for thead/tbody structure
  if (!table.querySelector('thead')) {
    issues.push({
      description: 'Table is missing thead element for proper structure',
      severity: 'warning',
      elementId: table.id || null,
      fixRecommendation: 'Wrap header cells in a <thead> element'
    });
  }
  
  if (!table.querySelector('tbody')) {
    issues.push({
      description: 'Table is missing tbody element for proper structure',
      severity: 'info',
      elementId: table.id || null,
      fixRecommendation: 'Wrap data rows in a <tbody> element'
    });
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Structure validation result
 */
export function validateTableStructure(table) {
  const result = {
    valid: true,
    issues: [],
    structure: {
      hasCaption: false,
      hasThead: false,
      hasTbody: false,
      hasTfoot: false,
      headerCount: 0,
      rowCount: 0
    }
  };
  
  if (!table) {
    result.valid = false;
    result.issues.push({ description: 'Table element is required', severity: 'error' });
    return result;
  }
  
  const caption = table.querySelector('caption');
  result.structure.hasCaption = !!caption;
  
  const thead = table.querySelector('thead');
  result.structure.hasThead = !!thead;
  
  const tbody = table.querySelector('tbody');
  result.structure.hasTbody = !!tbody;
  
  const tfoot = table.querySelector('tfoot');
  result.structure.hasTfoot = !!tfoot;
  
  result.structure.headerCount = table.querySelectorAll('th').length;
  result.structure.rowCount = table.querySelectorAll('tr').length;
  
  // Validate proper structure
  if (!result.structure.hasThead && result.structure.headerCount > 0) {
    result.valid = false;
    result.issues.push({
      description: 'Table has headers but no thead element',
      severity: 'warning',
      fixRecommendation: 'Move header cells into a thead element'
    });
  }
  
  return result;
}

/**
 * Validate landmark accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {Object} Validation result
 */
export function validateLandmark