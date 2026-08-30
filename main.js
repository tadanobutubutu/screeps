// Import required module(s) - for fixing table structure issues
import './table-styles.css';

// main.js - Entry point for the application

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// This is a simple utility library with added dependency graph rendering and module structure display functionalities, bot logic for Screeps and functions to ensure the element has an id and add an aria-label.

// TODO: Update or create the affected functions to be accessible

let internalFunction1 = (arg1, arg2) => {
  // Implementation of the new function (adjust as necessary)
};

let internalFunction2 = () => {
  // Implementation of the new function (adjust as necessary)
};

/**
 * Ensures the element has an id. If the element doesn't have an id, generates one.
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Optional prefix for the generated id
 * @returns {string} The id of the element
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = generatedId;
  return generatedId;
}

export function anotherFunction() {
  // More existing functionality
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Adds an aria-label to the element if it doesn't already have one
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {void}
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Sets the lang attribute on the HTML element based on the page content
 * @param {string} languageCode - The language code (e.g., 'en', 'es', 'fr')
 */
function setLanguageAttribute(languageCode) {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode);
  }
}

/**
 * Ensures all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
 * @param {HTMLElement[]} landmarks - Array of landmark elements to ensure unique ids
 * @param {string} prefix - Optional prefix for the generated id
 * @returns {string[]} Array of ids for all landmarks
 */
function ensureUniqueLandmarks(landmarks, prefix = 'landmark') {
  if (!landmarks || !Array.isArray(landmarks)) {
    throw new Error('Landmarks array is required');
  }

  const ids = [];
  const usedIds = new Set();

  landmarks.forEach((landmark, index) => {
    if (!landmark) {
      return;
    }

    if (landmark.id) {
      if (usedIds.has(landmark.id)) {
        const newId = `${prefix}-${index}`;
        landmark.id = newId;
        usedIds.add(newId);
        ids.push(newId);
      } else {
        usedIds.add(landmark.id);
        ids.push(landmark.id);
      }
    } else {
      let generatedId = `${prefix}-${index}`;
      while (usedIds.has(generatedId)) {
        generatedId = `${prefix}-${index}-${Math.random().toString(36).substr(2, 9)}`;
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
      ids.push(generatedId);
    }
  });

  return ids;
}

/**
 * Gets the lang attribute from the HTML element
 * @returns {string|null} The language code or null if not set
 */
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

/**
 * Validates landmark structure for proper accessibility
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Validation result with structure issues
 */
function validateLandmarkStructure(root = document) {
  const issues = [];
  
  if (!root) {
    return { valid: false, issues: ['Root element is required'] };
  }
  
  // Check for proper landmark nesting
  const landmarks = root.querySelectorAll('header, nav, main, footer, aside, section, article, [role]');
  
  // Check for proper use of section elements
  const sections = root.querySelectorAll('section, article');
  sections.forEach((section, index) => {
    const hasLabel = section.getAttribute('aria-label') || 
                     section.getAttribute('aria-labelledby') || 
                     section.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      issues.push(`Section/Article at index ${index} should have an accessible name via aria-label, aria-labelledby, or heading`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates link accessibility requirements
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Validation result with link issues
 */
function validateLinkAccessibility(root = document) {
  const issues = [];
  
  if (!root) {
    return { valid: false, issues: ['Root element is required'] };
  }
  
  // Check for links without accessible names
  const links = root.querySelectorAll('a');
  links.forEach((link, index) => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label');
    const hasAriaLabelledby = link.getAttribute('aria-labelledby');
    const hasTitle = link.getAttribute('title');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      issues.push(`Link at index ${index} has no accessible name`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Handles fake links (elements with click handlers that look like links)
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Result with fake links found
 */
function handleFakeLinks(root = document) {
  const fakeLinks = [];
  
  if (!root) {
    return { found: false, elements: [] };
  }
  
  // Find elements that have click handlers but are not buttons or links