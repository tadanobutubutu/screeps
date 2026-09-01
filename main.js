// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
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
    if (/[一-鿿]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[぀-ヿ]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[Ѐ-ӿ]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[؀-ۿ]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôùûüÿœæ]+/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]+/i.test(content)) {
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
  const thElements = thead ? thead.querySelectorAll('th') : [];
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
  const hasSummary = tableElement.getAttribute('aria-describedby');
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
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
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
      const prevCells = prevRow.querySelectorAll('td, th');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length} in previous row)`);
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
  
  if (role && !validLandmarks.includes(role) && !validLandmarks.includes(role.toLowerCase())) {
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
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName ? parent.tagName.toLowerCase() : '';
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName && landmark.tagName.toLowerCase() === 'footer') {
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
      errors.push(`SVG ${index + 1} is missing accessible name`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
/**
 * Creates a button element with correct accessibility properties for in-page linking
 * @param {string} text - The visible text content of the button
 * @param {string} targetId - The id of the target element to scroll/link to
 * @param {object} [options] - Additional options
 * @param {string} [options.ariaLabel] - Custom aria-label for the button
 * @param {string} [options.className] - CSS class name(s) to apply to the button
 * @param {function} [options.onClick] - Custom click handler
 * @returns {HTMLButtonElement|null} The created button element, or null if document is unavailable
 */
function createInPageButton(text, targetId, options) {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const opts = options || {};
  const button = document.createElement('button');
  
  // Set the type explicitly to avoid form submission side effects
  button.type = 'button';
  
  // Set the accessible name
  button.setAttribute('aria-label', opts.ariaLabel || text);
  
  // Use aria-controls to indicate the element the button controls/links to
  if (targetId) {
    button.setAttribute('aria-controls', targetId);
    button.setAttribute('data-target-id', targetId);
    
    // Attach a click handler that scrolls to the target and updates the URL hash
    button.addEventListener('click', function(event) {
      // Execute custom onClick if provided
      if (typeof opts.onClick === 'function') {
        opts.onClick(event);
      }
      
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Prevent default to allow smooth scrolling behavior to be controlled
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update the URL hash without jumping
        if (history && typeof history.pushState === 'function') {
          history.pushState(null, '', '#' + targetId);
        } else {
          window.location.hash = targetId;
        }
        // Move focus to the target element if it's focusable, otherwise set tabindex
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
        }
        targetElement.focus({ preventScroll: true });
      }
    });
  }
  
  // Apply optional className
  if (opts.className) {
    button.className = opts.className;
  }
  
  return button;
}

// New function to address REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  
  landmarkTypes.forEach((type) => {
    const elements = document.querySelectorAll(type);
    const labeledElements = document.querySelectorAll(`[role="${type}"]`);
    const total = elements.length + labeledElements.length;
    
    if (total > 1 && type !== 'nav' && type !== 'aside') {
      errors.push(`Multiple ${type} landmarks found (${total}). Consider using unique aria-labels to differentiate them.`);
    } else if (total > 1) {
      // For nav and aside, multiple are allowed but must have unique labels
      const allElements = [...elements, ...labeledElements];
      const labels = allElements.map(el => el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'));
      const uniqueLabels = new Set(labels.filter(l => l));
      if (uniqueLabels.size < total) {
        errors.push(`Multiple ${type} landmarks found without unique aria-labels`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix fake link issues
function createInPageButton(text, onClick) {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
}

function personName(name) {
  if (typeof name !== 'string') {
    return '';
  }
  return name.trim();
}

// Export all functions to make them available as module exports
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
  createInPageButton,
  personName
};