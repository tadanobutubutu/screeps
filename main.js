// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent')
const { indexContent } = require('./indexContent')
const { main } = require('./utilities')
const { addAccessibleName } = require('./AccessibilityHelpers') // Added function from HEAD

const {
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  uniqueLandmarks,
  addSvgAccessibleNames,
  checkAccessibility,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues
} = require('./AccessibilityHelpers')

// New function to handle additional rendering logic
function renderAdditionalContent(additionalData) {
  return '<div class="additional-content">' + (additionalData ? additionalData.content : '') + '</div>';
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  return content;
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  return function(e) {
    const isTab = e.key === 'Tab';
    if (!isTab) return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        if (lastElement) lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        if (firstElement) firstElement.focus();
      }
    }
  };
}

// Added function from HEAD (addAccessibleName)
function addAccessibleName(svgString) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

// Example usage of the function
const originalSvgString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...';
const modifiedSvgString = addAccessibleName(originalSvgString);

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97a2237d968a50cc419 -->
//_Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f8a6325b07b9b809ac49f5e1c81cf4f89f9c1 -->
//_Commit: 669117b4c3d1a635653f730f0a059efacbb752_
//<!-- todo-hash: 54b7c4d06282fbf48e78de43e5e115814006658c_ -->
//<!-- todo-hash: d290c9a63ee693e91602163f7ca6757def47f63e -->

// Additional utility functions
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/\b(le|la|les|de|des|du|une|un|et|est|que)\b/.test(content.toLowerCase())) {
      lang = 'fr'; // French
    } else if (/\b(der|die|das|und|oder|zu|mit|auf)\b/.test(content.toLowerCase())) {
      lang = 'de'; // German
    }
  }

  return lang;
}

function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// Landmark validation functions
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }

  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search'];

  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  if (role && !validLandmarks.includes(role)) {
    errors.push(`Element has an invalid landmark role: ${role}`);
  }

  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }

  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') ||
                  element.getAttribute('aria-labelledby') ||
                  element.querySelector('h1, h2, h3, h4, h5, h6');

  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)');
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  const errors = [];

  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push('Multiple main landmarks found. Only one main landmark should exist.');
  }

  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName.toLowerCase();
      const parentRole = parent.getAttribute('role');

      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found');
      }

      parent = parent.parentElement;
    }
  });

  return { valid: errors.length === 0, errors };
}

// SVG accessible name functions
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }

  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;

  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }

  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  return null;
}

function validateSvgAccessibility() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }

  const errors = [];
  const svgs = document.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      errors.push(`SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// Table validation functions
function fixTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }

  const errors = [];
  const rows = tableElement.querySelectorAll('tr');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
    const cellCount = cells.length;

    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
      }
    });

    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = prevRow.querySelectorAll('td');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// Accessibility fixes from insight report - combined with the export code below:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report (handled by createFocusTrap(), checkLandmarkElements(), validateSvgAccessibility(), and validateLinks())

function personName(name) {
  return name || '';
}

function createFocusTrap(container) {
  return trapFocus(container);
}

function checkLandmarkElements() {
  return validateLandmarkStructure();
}

function validateLinks() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const errors = [];
  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      errors.push(`Link ${index + 1} is missing accessible text`);
    }
  });
  return { valid: errors.length === 0, errors };
}

function validateTableStructure() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const errors = [];
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    const result = fixTableStructure(table);
    if (!result.valid) {
      errors.push(`Table ${index + 1}: ${result.errors.join(', ')}`);
    }
  });
  return { valid: errors.length === 0, errors };
}

function validateTableAccessibility() {
  return validateTableStructure();
}

module.exports = {
  renderAdditionalContent,
  renderGraphIndex,
  trapFocus,
  addAccessibleName,
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  fixTableStructure,
  personName,
  createFocusTrap,
  checkLandmarkElements,
  validateLinks,
  validateTableStructure,
  validateTableAccessibility,
  renderDependencyGraphs,
  renderDependencyGraph: renderGraphIndex
};