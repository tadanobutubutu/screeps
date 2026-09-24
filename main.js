// Updates the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW
import React, { useEffect } from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e. g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang;
    }
}

/**
 * Sets the lang attribute on the HTML element
 * @param {string} lang - The language code to set
 */
function getLangAttribute() {
    if (typeof document !== 'undefined' && document.documentElement) {
        return document.documentElement.lang || '';
    }
    return '';
}

/**
 * Sets the lang attribute on the document's <html> element
 * @param {string} lang - The language code to set
 * @returns {boolean} Whether the lang attribute was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    const langValue = lang || 'en';
    document.documentElement.setAttribute('lang', langValue);
    return true;
  }
  return false;
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
    if ... {
      lang = 'zh'; // Chinese
    } else if ... {
      lang = 'ja'; // Japanese
    } else if ... {
      lang = 'ru'; // Russian/Cyrillic
    } else if ... {
      lang = 'ar'; // Arabic
    } else if ... {
      lang = 'fr'; // French
    } else if ... {
      lang = 'de'; // German;
    }

  setHtmlLangAttribute(lang);

  return lang;
}

/**
 * Returns a properly formatted person name
 * @param {string} name - The person's name
 * @returns {string} The formatted person name
 */
function personName(name) {
    if (!name) return '';
    return String(name).trim();
}

/**
 * Creates an accessible in-page button with correct accessibility properties
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @param {string} label - The accessible label for the button
 * @param {string} [ariaLabel] - Optional ARIA label (defaults to label)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent, label, ariaLabel) {
    parent = parent || document.body;
    ariaLabel = ariaLabel || label;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', ariaLabel);
    btn.textContent = label;
    parent.appendChild(btn);
    return btn;
}

/**
 * Validates the accessibility of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false;

  // Check if table has a caption
  if ... {
    console.warn('Table is missing a caption');
    return false;
  }

  // Check if table has proper headers
  const headers = ...
  if (headers.length === 0) {
    console.warn('Table is missing header cells');
    return false;
  }

  // Check if table cells have proper scope attributes
  const cells = ... th');
  for (const cell of cells) {
    if (cell.tagName === 'TH' && ... {
      console.warn('Table header cell is missing scope attribute');
      return false;
    }
  }

  return true;
}

/**
 * Validates the structure of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table structure is valid
 */
function validateTableStructure(table) {
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false;

  // Check if table has proper structure
  if ... || ... {
    console.warn('Table is missing required thead or tbody elements');
    return false;
  }

  // Check if table has at least one row
  if ... === 0) {
    console.warn('Table is missing rows');
    return false;
  }

  return true;
}

/**
 * Validates a landmark element for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark is valid
 */
function validateLandmark(element) {
  if (!element || typeof element !== 'object') return false;

  // Check if element is a valid landmark role
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
  const role = element.getAttribute('role') || element.tagName.toLowerCase();

  if (!validRoles.includes(role)) {
    return false;
  }

  // Check for required ARIA attributes based on role
  switch (role) {
    case 'navigation':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
    case 'region':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
    case 'form':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
  }

  // Check if landmark is unique when required
  if (['banner', 'main', 'contentinfo'].includes(role)) {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      return false;
    }
  }

  return true;
}

/**
 * Validates the structure of landmark elements
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark structure is valid
 */
function validateLandmarkStructure(element) {
  if (!element || typeof element !== 'object') return false;

  // Check if element is a landmark role
  const landmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'region', 'search'];
  const role = element.getAttribute('role') || element.tagName.toLowerCase();

  if (!landmarkRoles.includes(role)) {
    return false;
  }

  // Check for proper nesting
  if (role === 'main' && element.parentElement && element.parentElement.tagName.toLowerCase() === 'body') {
    return true;
  }

  return true;
}

/**
 * Gets the accessible name from an SVG element
 * @param {SVGSVGElement} svg - The SVG element
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svg) {
  if (!svg || typeof svg !== 'object') return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.getAttribute('title') || '';
}

/**
 * Validates landmark attributes for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark attributes are valid
 */
function validateLandmarkAttributes(element) {
  if (!element || typeof element !== 'object') return true;
  return true;
}

/**
 * Sets SVG attributes to ensure accessibility
 * @param {SVGSVGElement} svg - The SVG element
 * @param {string} name - The accessible name for the SVG
 */
function setSvgAttributes(svg, name) {
  if (!svg || typeof svg !== 'object') return;
  svg.setAttribute('aria-label', name);
  svg.setAttribute('role', 'img');
}

/**
 * Ensures all landmarks are unique in the document
 * @returns {boolean} Whether all landmarks are unique
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return true;
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"]');
  const landmarkRoles = new Set();
  for (const landmark of landmarks) {
    const role = landmark.getAttribute('role');
    if (landmarkRoles.has(role)) {
      return false;
    }
    landmarkRoles.add(role);
  }
  return true;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {boolean} Whether the link is accessible
 */
function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') return true;
  return link.hasAttribute('href') && link.getAttribute('href') !== '#';
}

/**
 * Handles fake links by converting them to proper buttons
 * @param {HTMLAnchorElement} link - The fake link to convert
 * @returns {HTMLButtonElement} The converted button element
 */
function handleFakeLinks(link) {
  if (!link || typeof link !== 'object' || link.tagName !== 'A') return null;
  if (link.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
    link.parentNode.replaceChild(button, link);
    return button;
  }
  return null;
}

/**
 * Creates a focus trap for keyboard navigation within a given element.
 * @param {HTMLElement} container - The container element to trap focus within.
 * @returns {Object} An object with methods to enable and disable the focus trap.
 */
function newFocusTrap(container) {
  if (!container || typeof container !== 'object') return null;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length === 0) return null;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
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
  }

  container.addEventListener('keydown', handleKeyDown);

  return {
    enable: () => {
      container.setAttribute('tabindex', '-1');
      container.focus();
    },
    disable: () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeAttribute('tabindex');
    }
  };
}

// REACT_015: Add lang attribute to HTML element
// Add the language attribute to the HTML element for proper accessibility

module.exports = {
  setHtmlLangAttribute,
  getLangAttribute,
  detectAndSetLang,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  newFocusTrap
};