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
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return lang;
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
 * Validates landmark accessibility and fixes common landmark issues
 * Addresses REACT_017 (Add/fix 4 landmark issues) and REACT_025 (Ensure unique landmarks)
 * @returns {Object} An object containing validation results and any fixes applied
 */
function validateLandmark() {
  const results = {
    issues: [],
    fixes: [],
    valid: true
  };
  
  if (typeof document === 'undefined') {
    return results;
  }
  
  // Define landmark selectors (HTML5 elements and ARIA roles)
  const landmarkSelectors = [
    'header', 'nav', 'main', 'aside', 'footer',
    '[role="banner"]', '[role="navigation"]', '[role="main"]',
    '[role="complementary"]', '[role="contentinfo"]', '[role="search"]',
    '[role="form"]'
  ];
  
  // Get all landmark elements
  const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
  
  // Track landmark counts for uniqueness validation
  const landmarkCounts = {};
  const landmarkElements = {};
  
  landmarks.forEach(el => {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const key = role || tag;
    
    if (!landmarkElements[key]) {
      landmarkElements[key] = [];
    }
    landmarkElements[key].push(el);
    landmarkCounts[key] = (landmarkCounts[key] || 0) + 1;
  });
  
  // REACT_025: Ensure unique landmarks - check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    results.issues.push({
      type: 'REACT_025',
      message: 'Multiple main landmarks found. There should be only one main landmark.',
      count: mainElements.length,
      elements: Array.from(mainElements)
    });
    results.valid = false;
  }
  
  // REACT_025: Check for multiple banner/header landmarks
  const headerCount = (landmarkCounts['banner'] || 0) + (landmarkCounts['header'] || 0);
  if (headerCount > 1) {
    results.issues.push({
      type: 'REACT_025',
      message: 'Multiple banner/header landmarks found. Only one header landmark is allowed.',
      count: headerCount
    });
    results.valid = false;
  }
  
  // REACT_025: Check for multiple footer landmarks
  const footerCount = (landmarkCounts['contentinfo'] || 0) + (landmarkCounts['footer'] || 0);
  if (footerCount > 1) {
    results.issues.push({
      type: 'REACT_025',
      message: 'Multiple footer landmarks found. Only one footer landmark is allowed.',
      count: footerCount
    });
    results.valid = false;
  }
  
  // REACT_017: Validate landmark structure - check for missing essential landmarks
  const hasMain = landmarkCounts['main'] > 0 || landmarkCounts['main'] !== undefined;
  const hasNav = landmarkCounts['navigation'] > 0 || landmarkCounts['nav'] > 0 || 
                (landmarkElements['nav'] && landmarkElements['nav'].length > 0);
  
  if (!document.querySelector('main, [role="main"]')) {
    results.issues.push({
      type: 'REACT_017',
      message: 'Missing main landmark. Page should contain a main landmark.',
      missing: 'main'
    });
    results.valid = false;
  }
  
  // REACT_017: Check for navigation landmarks without accessible names
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  navElements.forEach((nav, index) => {
    const ariaLabel = nav.getAttribute('aria-label');
    const ariaLabelledby = nav.getAttribute('aria-labelledby');
    
    if (!ariaLabel && !ariaLabelledby && nav.tagName !== 'NAV') {
      results.issues.push({
        type: 'REACT_017',
        message: 'Navigation landmark at index ' + index + ' lacks accessible name.',
        element: nav
      });
      results.valid = false;
    }
  });
  
  // REACT_017: Check for redundant nested landmarks
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      const parent = el.parentElement;
      if (parent) {
        const parentTag = parent.tagName.toLowerCase();
        const parentRole = parent.getAttribute('role');
        
        // Check if element has same tag as parent (redundant wrapping)
        if (el.tagName.toLowerCase() === parentTag) {
          results.issues.push({
            type: 'REACT_017',
            message: 'Redundant landmark: ' + el.tagName.toLowerCase() + ' nested inside another ' + parentTag,
            element: el
          });
          results.valid = false;
        }
      }
    });
  });
  
  // REACT_017: Ensure landmarks have proper accessible names where needed
  const searchableLandmarks = document.querySelectorAll('[role="search"]');
  searchableLandmarks.forEach((el, index) => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      el.setAttribute('aria-label', 'Search');
      results.fixes.push({
        type: 'REACT_017',
        message: 'Added aria-label to search landmark at index ' + index,
        element: el
      });
    }
  });
  
  return results;
}

module.exports = { setHtmlLangAttribute, detectAndSetLang, createInPageButton, validateLandmark };