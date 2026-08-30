// Import required modules
import { union } from 'lodash'; // You'll need to install lodash if it's not already installed

// Import graph rendering functions
import { renderGraph } from ... // Assuming you have a separate file for the new functions

/**
 * Check and ensure accessibility attributes for links and buttons
 */
export function checkLinksAndButtons(container = document) {
  const links = container.querySelectorAll('a');
  const buttons = container.querySelectorAll('button');

  links.forEach(link => {
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'link');
    }
    if (!link.hasAttribute('href') && !link.getAttribute('href')) {
      console.error('Accessibility Error: Link without href attribute', link);
    }
  });

  buttons.forEach(button => {
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
    // Check for accessible name for buttons
    const hasText = button.textContent.trim().length > 0;
    const hasAriaLabel = button.hasAttribute('aria-label') && button.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledby = button.hasAttribute('aria-labelledby') && button.getAttribute('aria-labelledby').trim() !== '';
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
      console.error('Accessibility Error: Button without accessible name', button);
    }
  });
}

// Function to render graph/index using new functions
function renderGraphIndex() {
  // JavaScript code to prepare data for the graph
  const data = prepareDataForGraph();

  // Render the graph using the new functions
  renderGraph(data);
}

// Update the existing rotateBack function to call renderGraphIndex
export function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');

  // Call renderGraphIndex before rotating back
  renderGraphIndex();
}

// ... Existing functions from current main.js ...

/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
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

/**
 * Check if an element has the specified accessibility attribute
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} attribute - The accessibility attribute to check for
 * @returns {boolean} True if the attribute is present and non-empty, false otherwise
 */
export function checkAccessibilityAttribute(element, attribute) {
  if (!element || typeof element.getAttribute !== 'function') {
    return false;
  }
  const value = element.getAttribute(attribute);
  return value !== null && value !== '';
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
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  const isFocusable = focusableTags.includes(tagName) ||
                      element.tabIndex >= 0 ||
                      checkAccessibilityAttribute(element, 'tabindex');
  return isFocusable && ensureAccessibleLabel(element);
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
  }
};

const a11yStore = {
  // ... existing code (from both conflicting branches)

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    landmarkElements.forEach((landmark, index) => {
      // Ensure landmark has a unique ID
      if (landmark.id === '') {
        landmark.id = `landmark-${index + 1}`;
      }

      // Ensure unique accessible names for duplicate landmarks
      if (landmarkElements.filter(l => l.tagName === landmark.tagName).length > 1) {
        landmark.setAttribute('aria-label', landmark.tagName + '-' + (index + 1));
      }
    });
  },

  // ... existing code (from both conflicting branches)
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

/**
 * Get language attribute for HTML element
 * @returns {string} The language attribute value
 */
export function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') || 'en' : 'en';
}

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with issues array
 */
export function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }

  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td, th');
  
  // Check if table has headers
  if (headers.length === 0) {
    issues.push({
      code: 'REACT_027',
      description: 'Table should have proper header cells (th elements)',
      element: table
    });
  }

  // Check table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  
  if (!thead) {
    issues.push({
      code: 'REACT_027',
      description: 'Table should have a thead section',
      element: table
    });
  }

  if (!tbody) {
    issues.push({
      code: 'REACT_027',
      description: 'Table should have a tbody section',
      element: table
    });
  }

  // Check for proper scope attributes on headers
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      issues.push({
        code: 'REACT_027',
        description: 'Table header should have a scope attribute',
        element: th
      });
    }
  });

  return { valid: issues.length === 0, issues };
}

/**
 * Validate table structure
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result
 */
export function validateTableStructure(table) {
  const result = validateTableAccessibility(table);
  
  if (!table) return result;

  // Additional table structure checks
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      result.issues.push({
        code: 'REACT_027',
        description: `Row ${rowIndex + 1} has no cells`,
        element: row
      });
    }
  });

  return result;
}

/**
 * Validate landmark accessibility
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {Object} Validation result
 */
export function validateLandmark(landmark) {
  const issues = [];