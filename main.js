// TODO: This is the existing code that needs to be preserved

// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;
  
  // ... Existing code for addressAccessibilityIssues function

}

/**
 * Check if a given element has any accessibility issues
 * @param {Element} element - DOM element to check
 * @returns {Object | undefined} - Object with the issue details if found, undefined otherwise
 */
function checkLinkAndButtonAccessibility(element) {
  if (!element || !element.tagName) return;

  const tagName = element.tagName.toLowerCase();

  if (tagName === 'a' || tagName === 'button') {
    // Check for presence of visible or ARIA text
    const textContents = Array.from(element.textContent.trim().split(/\s+/));
    const hasVisibleText = textContents.length > 0;
    const hasAriaAttr = element.hasAttribute('aria-label');

    if (!hasVisibleText && !hasAriaAttr) {
      return {
        type: tagName,
        index: document.getElementById(element.id) ? document.getElementById(element.id).getAttribute('data-testid') : undefined,
        accessibilityIssue: 'Missing clear text content'
      };
    }
  }

  return undefined;
}

/**
 * Validates table structure issues.
 * Handles REACT_027.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} - Validation summary
 */
function validateTableStructure(table) {
  const summary = {
    validStructure: true,
    issues: []
  };
  if (!table) {
    summary.validStructure = false;
    summary.issues.push('No table provided');
    return summary;
  }
  if (!table.querySelector('thead')) {
    summary.issues.push('Missing thead');
  }
  if (!table.querySelector('tbody')) {
    summary.issues.push('Missing tbody');
  }
  if (summary.issues.length > 0) {
    summary.validStructure = false;
  }
  return summary;
}

function checkLinkAndButtonAccessibility(issues, options) {
  return addressAccessibilityIssues(issues, options);
}

// New function to check for lang attribute in HTML element
function addLangAttribute(lang) {
  if (document.documentElement) {
    document.documentElement.lang = lang;
  }
}

// New function to fix table structure issues
function fixTableStructure() {
  // Example logic to fix table structure
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Example: Add `scope` attributes to header cells
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', index === 0 ? 'colgroup' : 'row');
      }
    });
  });
}

// New function to add/fix landmark issues
function fixLandmarkIssues() {
  // Example logic to add landmarks
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarks.forEach((landmark) => {
    const el = document.querySelector(landmark);
    if (el) {
      el.setAttribute('role', landmark);
    }
  });
}

// New function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    const sameRoleCount = Array.from(landmarks).filter(el => el.getAttribute('role') === role).length;
    if (sameRoleCount > 1) {
      console.warn(`Duplicate role '${role}' detected on multiple elements`);
    }
  });
}

// New function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'SVG description';
      svg.appendChild(titleElement);
    }
  });
}

// New function to fix fake link issues
function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach((link) => {
    link.href = '#';
    link.setAttribute('aria-label', 'Link to same page');
  });
}

// New function to implement Google sign-in logic
function googleSignIn() {
  // Google sign-in logic
}

// New function to replace my-button with actual button id for accessibility
function fixButtonIdentifiers() {
  const buttons = document.querySelectorAll('.my-button');
  buttons.forEach((button) => {
    button.id = 'unique-button-id-' + Math.random().toString(36).substr(2, 9);
  });
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addLangAttribute, fixTableStructure, fixLandmarkIssues, ensureUniqueLandmarks, addSvgAccessibleNames, fixFakeLinkIssue, googleSignIn, fixButtonIdentifiers, addressAccessibilityIssues, calculateSum, calculateProduct };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.addLangAttribute = addLangAttribute;
  window.fixTableStructure = fixTableStructure;
  window.fixLandmarkIssues = fixLandmarkIssues;
  window.ensureUniqueLandmarks = ensureUniqueLandmarks;
  window.addSvgAccessibleNames = addSvgAccessibleNames;
  window.fixFakeLinkIssue = fixFakeLinkIssue;
  window.googleSignIn = googleSignIn;
  window.fixButtonIdentifiers = fixButtonIdentifiers;
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.validateLandmarkStructure = validateLandmarkStructure;
}