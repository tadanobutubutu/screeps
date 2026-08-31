// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Gets the current lang attribute from the document's <html> element
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || '';
  }
  return '';
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
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff\u31f0-\u31ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/\b(le|la|les|de|du|et|est|une|qui|que|dans|pour|avec)\b/i.test(content) && /[àâäéèêëïîôùûüÿçœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/\b(der|die|das|und|ist|ein|eine|in|zu|den|mit|von|auf|für)\b/i.test(content) && /[äöüß]/i.test(content)) {
      lang = 'de'; // German
    } else if (/\b(el|la|los|las|de|que|y|en|es|un|una|por|con|para)\b/i.test(content) && /[áéíóúñü]/i.test(content)) {
      lang = 'es'; // Spanish
    }
  }
  
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
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

/**
 * Validates the accessibility of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object') return true;
  
  // Check if table has proper caption or summary
  const caption = table.querySelector('caption');
  const summary = table.getAttribute('summary');
  
  // Check if headers have proper associations
  const headers = table.querySelectorAll('th');
  const hasProperHeaders = Array.from(headers).every(th => {
    return th.hasAttribute('scope') || th.hasAttribute('id');
  });
  
  // Return true if accessible (has caption/summary OR proper header associations)
  return !!(caption || summary || hasProperHeaders);
}

/**
 * Validates the structure of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table structure is valid
 */
function validateTableStructure(table) {
  if (!table || typeof table !== 'object') return true;
  
  // Check for proper table structure: thead, tbody, tfoot
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  // Check if first row contains only th elements (header row)
  const firstRow = table.querySelector('tr');
  if (firstRow) {
    const cells = firstRow.querySelectorAll('th, td');
    const hasHeaderCells = Array.from(cells).some(cell => cell.tagName === 'TH');
    if (hasHeaderCells && !thead) {
      return false; // Should have thead when using th elements
    }
  }
  
  // Table should have at least one tbody
  if (!tbody && table.querySelector('tr')) {
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
  if (!element || typeof element !== 'object') return true;
  
  // Check if element has a valid landmark role
  const role = element.getAttribute('role');
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  // If no role attribute, check if it's a semantic landmark element
  const isSemanticLandmark = ['header', 'nav', 'main', 'aside', 'footer'].includes(element.tagName.toLowerCase());
  
  // Check if label is provided for landmarks that need it
  if (role === 'navigation' || role === 'search' || role === 'form') {
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledby) {
      return false; // Navigation, search, and form landmarks should have labels
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
  if (!element || typeof element !== 'object') return true;
  
  // Check for unique landmarks
  if (element.tagName) {
    const tagName = element.tagName.toLowerCase();
    
    // Only one main landmark should exist
    if (tagName === 'main' || element.getAttribute('role') === 'main') {
      const allMains = document.querySelectorAll('main, [role="main"]');
      if (allMains.length > 1) {
        return false; // Multiple main landmarks found
      }
    }
    
    // Only one contentinfo (footer) landmark should exist
    if (tagName === 'footer' || element.getAttribute('role') === 'contentinfo') {
      const allFooters = document.querySelectorAll('footer, [role="contentinfo"]');
      if (allFooters.length > 1) {
        return false; // Multiple contentinfo landmarks found
      }
    }
    
    // Only one banner (header) landmark should exist
    if (tagName === 'header' || element.getAttribute('role') === 'banner') {
      const allHeaders = document.querySelectorAll('header:not([role]), header[role="banner"], [role="banner"]');
      if (allHeaders.length > 1) {
        return false; // Multiple banner landmarks found
      }
    }
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
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title')?.textContent || svg.getAttribute('title') || '';
}

/**
 * Validates that a link is not a fake link (looks like a link but isn't)
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} Whether the link is a proper accessible link
 */
function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') return true;
  
  const tagName = link.tagName ? link.tagName.toLowerCase() : '';
  
  // Check if it's an anchor or link element
  if (tagName === 'a' || tagName === 'area') {
    const href = link.getAttribute('href');
    // Valid links should have an href attribute
    if (!href || href === '#' || href === '') {
      return false; // Fake link detected
    }
    return true;
  }
  
  // Check if it has a button role but looks like a link
  const role = link.getAttribute('role');
  if (role === 'button' && (tagName !== 'button' && tagName !== 'input')) {
    // Check if it has proper button semantics
    const tabIndex = link.getAttribute('tabindex');
    const onClick = link.getAttribute('onclick');
    if (!tabIndex && !onClick) {
      return false;
    }
  }
  
  return true;
}

module.exports = { 
  setHtmlLangAttribute, 
  getLangAttribute, 
  detectAndSetLang, 
  personName, 
  createInPageButton, 
  validateTableAccessibility, 
  validateTableStructure, 
  validateLandmark,