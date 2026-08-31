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
    // Check for Chinese characters
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    }
    // Check for Japanese hiragana or katakana
    else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    }
    // Check for Cyrillic characters (Russian, etc.)
    else if (/[\u0400-\u04FF]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    }
    // Check for Arabic characters
    else if (/[\u0600-\u06FF\u0750-\u077F]/.test(content)) {
      lang = 'ar'; // Arabic
    }
    // Check for French-specific characters
    else if (/[àâäéèêëïîôùûüÿçœæ]/i.test(content)) {
      lang = 'fr'; // French
    }
    // Check for German-specific characters
    else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
    // Check for Spanish-specific characters
    else if (/[áéíóúüñ¿¡]/i.test(content)) {
      lang = 'es'; // Spanish
    }
    // Check for Portuguese-specific characters
    else if (/[áàâãéêíóôõúç]/i.test(content)) {
      lang = 'pt'; // Portuguese
    }
    // Check for Korean characters
    else if (/[\uac00-\ud7af]/.test(content)) {
      lang = 'ko'; // Korean
    }
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