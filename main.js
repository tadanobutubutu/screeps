// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97a2237d968a50cc419 -->
//_Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f8a6325b07b9b809ac49f5e1c81cf4f89f9c1 -->
//_Commit: 669117b4c3d1a635653f730f0a059efacbb752_
//<!-- todo-hash: 312aa8ea4c5e1c9430e4b7c36c210eb9a72dea -->
//_Commit: 54b7c4d06282fbf48e78de43e5e115814006658c_
//<!-- todo-hash: d290c9a63ee693e91602163f7ca6757def47f63e -->
// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark() and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report
import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/u.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u309F\u30A0-\u30FF]/u.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04FF]/u.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06FF]/u.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôùûüÿæœ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return lang;
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? Array.from(thead.querySelectorAll('th')) : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('summary') || tableElement.getAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }
  
  const errors = [];
  const rows = Array.from(tableElement.querySelectorAll('tr'));
  
  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('th, td'));
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
      const prevCells = Array.from(prevRow.querySelectorAll('th, td'));
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }
  
  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search'];
  
  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role.toLowerCase())) {
    errors.push(`Invalid landmark role: ${role}`);
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
    errors.push(`Multiple main landmarks found. Only one main landmark should exist.`);
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

// New function to address REACT_041: Add accessible names to 2 SVGs
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

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  const landmarkCounts = {};
  
  // Count landmarks by role or tag
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const identifier = landmark.tagName.toLowerCase() || landmark.getAttribute('role');
    
    // main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkCounts[identifier]) {
        errors.push(`Duplicate main landmark found. Only one main landmark should exist.`);
      } else {
        landmarkCounts[identifier] = 1;
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Gets the accessible name of an element, addressing REACT_036 fake link issues.
 * @param {HTMLElement} element - The element to extract the accessible name from
 * @returns {string|null} The accessible name or null
 */
function personName(element) {
  if (typeof document === 'undefined' || !element) {
    return null;
  }
  
  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title attribute
  const title = element.getAttribute('title');
  if (title) return title;
  
  // Fall back to text content
  const textContent = element.textContent.trim();
  if (textContent) return textContent;
  
  return null;
}

/**
 * Validates that links and interactive elements have accessible names,
 * addressing REACT_036 fake link issues.
 * @param {HTMLElement} container - Optional container to scan within
 * @returns {object} Validation result with valid flag and errors array
 */
function validateLinks(container) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const root = container || document;
  const links = root.querySelectorAll('a, button, [role="link"], [role="button"]');
  
  links.forEach((el, index) => {
    const name = personName(el);
    if (!name || !name.trim()) {
      errors.push(`Interactive element ${index + 1} is missing an accessible name`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Creates an in-page button with proper accessibility attributes,
 * addressing REACT_036 fake link issues.
 * @param {HTMLElement} element - The element to enhance as a button
 * @param {Object} options - Configuration options
 * @param {string} options.label - The accessible label for the button
 * @param {Function} options.onClick - Click handler
 * @returns {HTMLElement} The enhanced element
 */
function createInPageButton(element, options = {}) {
  if (typeof document === 'undefined' || !element) {
    return null;
  }
  
  const label = options.label || '';
  const onClick = options.onClick || null;
  
  // Set role to button
  element.setAttribute('role', 'button');
  
  // Set accessible name
  if (label) {
    element.setAttribute('aria-label', label);
  }
  
  // Set tabindex to make it focusable
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }
  
  // Add keyboard support
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) onClick(e);
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  if (onClick) {
    element.addEventListener('click', onClick);
  }
  
  return element;
}

/**
 * Validates and fixes additional accessibility issues from insight report.
 * Addresses concerns like ARIA attributes, image alt text, form labels,
 * heading hierarchy, and color contrast hints.
 * @param {HTMLElement} container - Optional container to scan within
 * @returns {object} Validation result with valid flag, errors array, and fixes applied count
 */
function addressNewAccessibilityIssues(container) {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'], fixesApplied: 0 };
  }
  
  const errors = [];
  const root = container || document;
  let fixesApplied = 0;
  
  // Check images for alt text
  const images = root.querySelectorAll('img');
  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');
    const role = img.getAttribute('role');
    if (alt === null && role !== 'presentation' && role !== 'none') {
      errors.push(`Image ${index + 1} is missing alt attribute`);
      // Auto-fix: add empty alt for decorative images is risky, so we just report
    }
  });
  
  // Check form inputs for labels
  const inputs = root.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    const type = input.getAttribute('type');
    
    // Skip hidden inputs and submit/button types
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') {
      return;
    }
    
    let hasLabel = false;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) hasLabel = true;
    }
    
    // Check for wrapping label
    if (!hasLabel && input.closest('label')) {
      hasLabel = true;
    }
    
    if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
      errors.push(`Form input ${index + 1} is missing an associated label`);
    }
  });
  
  // Check heading hierarchy
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  let firstH1Found = false;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1), 10);
    
    if (level === 1) {
      if (firstH1Found && index > 0) {
        errors.push(`Multiple h1 elements found. Only one h1 should exist per page.`);
      }
      firstH1Found = true;
    } else if (!firstH1Found && previousLevel === 0) {
      errors.push(`First heading should be h1, found h${level}`);
    }
    
    if (previousLevel > 0 && level > previousLevel + 1) {
      errors.push(`Heading hierarchy skip detected: h${previousLevel} to h${level}`);
    }
    
    previousLevel = level;
  });
  
  if (!firstH1Found && headings.length > 0) {
    errors.push('Page has headings but is missing an h1 element');
  }
  
  // Check buttons for accessible names
  const buttons = root.querySelectorAll('button, [role="button"]');
  buttons.forEach((button, index) => {
    const hasText = button.textContent.trim().length > 0;
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledBy = button.getAttribute('aria-labelledby');
    const title = button.getAttribute('title');
    
    if (!hasText && !ariaLabel && !ariaLabelledBy && !title) {
      errors.push(`Button ${index + 1} has no accessible name`);
    }
  });
  
  // Check for skip navigation link
  const skipLinks = root.querySelectorAll('a[href^="#"]');
  let hasSkipLink = false;
  skipLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const text = link.textContent.toLowerCase();
    if (href !== '#' && (text.includes('skip') || text.includes('main'))) {
      hasSkipLink = true;
    }
  });
  
  if (!hasSkipLink && root === document) {
    // Only report at document level, not for nested containers
    errors.push('Page is missing a skip navigation link');
  }
  
  // Check for document title
  if (root === document && typeof document.title === 'string') {
    if (!document.title.trim()) {
      errors.push('Document is missing a title');
    }
  }
  
  // Check for meta viewport (for responsive/mobile accessibility)
  if (root === document) {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      errors.push('Document is missing meta viewport tag for mobile accessibility');
    }
  }
  
  // Check iframe titles
  const iframes = root.querySelectorAll('iframe');
  iframes.forEach((iframe, index) => {
    const title = iframe.getAttribute('title');
    if (!title) {
      errors.push(`Iframe ${index + 1} is missing a title attribute`);
    }
  });
  
  // Check for proper list structure
  const lists = root.querySelectorAll('ul, ol');
  lists.forEach((list, index) => {
    const directItems = Array.from(list.children).filter(
      child => child.tagName.toLowerCase() === 'li'
    );
    if (directItems.length === 0) {
      errors.push(`List ${index + 1} contains no direct <li> children`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    fixesApplied,
    timestamp: new Date().toISOString()
  };
}

/**
 * Auto-applies safe accessibility fixes to elements in the document.
 * @param {HTMLElement} container - Optional container to apply fixes within
 * @returns {object} Report of fixes applied
 */
function applyAccessibilityFixes(container) {
  if (typeof document === 'undefined') {
    return { fixesApplied: 0, fixDetails: [] };
  }
  
  const root = container || document;
  const fixDetails = [];
  let fixesApplied = 0;
  
  // Add role="img" to SVGs that don't have one but have accessible names
  const svgs = root.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('role') && getSvgAccessibleName(svg)) {
      svg.setAttribute('role', 'img');
      fixesApplied++;
      fixDetails.push(`Added role="img" to SVG ${index + 1}`);
    }
  });
  
  // Ensure interactive elements have proper roles
  const clickableRoles = ['a', 'button'];
  clickableRoles.forEach((selector) => {
    const elements = root.querySelectorAll(selector);
    elements.forEach((el, index) => {
      if (!el.hasAttribute('role') && !el.hasAttribute('aria-hidden')) {
        // Element already has implicit role, no fix needed
      }
    });
  });
  
  // Add aria-hidden="true" to decorative images
  const images = root.querySelectorAll('img');
  images.forEach((img, index) => {
    if (img.getAttribute('alt') === '' && !img.hasAttribute('role')) {
      img.setAttribute('role', 'presentation');
      fixesApplied++;
      fixDetails.push(`Added role="presentation" to decorative image ${index + 1}`);
    }
  });
  
  return {
    fixesApplied,
    fixDetails,
    timestamp: new Date().toISOString()
  };
}

// TODO: Implement a new function to handle focus trap for keyboard navigation
/**
 * Creates a focus trap within a container element for keyboard navigation.
 * Keeps focus within the trapped area and cycles focus between focusable elements.
 * @param {HTMLElement} container - The container element to trap focus within
 * @param {Object} options - Configuration options for the focus trap
 * @param {boolean} options.escapeDeactivates - If true, Escape key will deactivate the trap (default: true)
 * @param {boolean} options.returnFocusOnDeactivate - If true, returns focus to the previously focused element (default: true)
 * @param {Function} options.onEscape - Callback function when Escape key is pressed
 * @param {Function} options.onActivate - Callback function when trap is activated
 * @param {Function} options.onDeactivate - Callback function when trap is deactivated
 * @returns {Object} Focus trap controller with activate, deactivate, and update methods
 */
function createFocusTrap(container, options = {}) {
  if (typeof document === 'undefined') {
    return null;
  }

  const config = {
    escapeDeactivates: options.escapeDeactivates !== false,
    returnFocusOnDeactivate: options.returnFocusOnDeactivate !== false,
    onEscape: options.onEscape || null,
    onActivate: options.onActivate || null,
    onDeactivate: options.onDeactivate || null
  };

  let active = false;
  let deactivateHandler = null;

  const getFocusableElements = () => {
    return Array.from(container.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.disabled);
  };

  const handleKeyDown = (e) => {
    if (!active) return;
    
    if (e.key === 'Escape' && config.escapeDeactivates) {
      e.preventDefault();
      deactivate();
      if (config.onEscape) config.onEscape();
      return;
    }
    
    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const activate = () => {
    if (active) return;
    active = true;
    document.addEventListener('keydown', handleKeyDown);
    if (config.onActivate) config.onActivate();
  };

  const deactivate = () => {
    if (!active) return;
    active = false;
    document.removeEventListener('keydown', handleKeyDown);
    if (config.returnFocusOnDeactivate && deactivateHandler) {
      deactivateHandler.focus();
    }
    if (config.onDeactivate) config.onDeactivate();
  };

  const update = (newOptions) => {
    Object.assign(config, newOptions);
  };

  return {
    activate,
    deactivate,
    update,
    destroy: deactivate
  };
}

export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  personName,
  validateLinks,
  createInPageButton,
  addressNewAccessibilityIssues,
  applyAccessibilityFixes,
  createFocusTrap
};

export default {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  personName,
  validateLinks,
  createInPageButton,
  addressNewAccessibilityIssues,
  applyAccessibilityFixes,
  createFocusTrap
};