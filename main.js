// Assuming main.js has a <html> tag, add the lang attribute based on your content
import React, { useEffect } from 'react';

/**
 * Checks if text contains characters from a specific Unicode range
 * @param {string} text - The text to check
 * @param {number} start - Start of Unicode range
 * @param {number} end - End of Unicode range
 * @returns {boolean} Whether text contains characters in the range
 */
function containsUnicodeRange(text, start, end) {
  if (!text) return false;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= start && code <= end) return true;
  }
  return false;
}

/**
 * Checks if text contains Cyrillic characters
 * @param {string} text - The text to check
 * @returns {boolean} Whether text contains Cyrillic characters
 */
function containsCyrillic(text) {
  if (!text) return false;
  // Cyrillic Unicode range: \u0400-\u04FF
  return containsUnicodeRange(text, 0x0400, 0x04FF);
}

/**
 * Checks if text contains Arabic characters
 * @param {string} text - The text to check
 * @returns {boolean} Whether text contains Arabic characters
 */
function containsArabic(text) {
  if (!text) return false;
  // Arabic Unicode range: \u0600-\u06FF
  return containsUnicodeRange(text, 0x0600, 0x06FF);
}

/**
 * Checks if text contains Chinese characters
 * @param {string} text - The text to check
 * @returns {boolean} Whether text contains Chinese characters
 */
function containsChinese(text) {
  if (!text) return false;
  // CJK Unified Ideographs range: \u4E00-\u9FFF
  return containsUnicodeRange(text, 0x4E00, 0x9FFF);
}

/**
 * Checks if text contains Japanese characters (Hiragana, Katakana, or CJK)
 * @param {string} text - The text to check
 * @returns {boolean} Whether text contains Japanese characters
 */
function containsJapanese(text) {
  if (!text) return false;
  // Hiragana: \u3040-\u309F, Katakana: \u30A0-\u30FF, CJK: \u4E00-\u9FFF
  return containsUnicodeRange(text, 0x3040, 0x309F) ||
         containsUnicodeRange(text, 0x30A0, 0x30FF) ||
         containsUnicodeRange(text, 0x4E00, 0x9FFF);
}

/**
 * Checks if text contains French-specific characters
 * @param {string} text - The text to check
 * @returns {boolean} Whether text contains French characters
 */
function containsFrench(text) {
  if (!text) return false;
  // French uses Latin alphabet with accents (à, â, ç, é, è, ê, ë, î, ï, ô, ù, û, ü, ÿ)
  const frenchAccents = /[àâçéèêëîïôùûüÿ]/i;
  return frenchAccents.test(text);
}

/**
 * Checks if text contains German-specific characters
 * @param {string} text - The text to check
 * @returns {boolean} Whether text contains German characters
 */
function containsGerman(text) {
  if (!text) return false;
  // German uses Latin alphabet with umlauts (ä, ö, ü) and Eszett (ß)
  const germanChars = /[äöüß]/i;
  return germanChars.test(text);
}

/**
 * Checks if text contains Latin extended characters (common in Western European languages)
 * @param {string} text - The text to check
 * @returns {boolean} Whether text contains Latin extended characters
 */
function containsLatinExtended(text) {
  if (!text) return false;
  // Latin Extended-A and Latin Extended-B ranges: \u0100-\u024F
  return containsUnicodeRange(text, 0x0100, 0x024F);
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e. g., 'en', 'es', 'fr')
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
    if (containsChinese(content)) {
      lang = 'zh'; // Chinese
    } else if (containsJapanese(content)) {
      lang = 'ja'; // Japanese
    } else if (containsCyrillic(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (containsArabic(content)) {
      lang = 'ar'; // Arabic
    } else if (containsFrench(content)) {
      lang = 'fr'; // French
    } else if (containsGerman(content)) {
      lang = 'de'; // German
    } else if (containsLatinExtended(content)) {
      // Default to Spanish for Latin Extended if no other indicators
      lang = 'es'; // Spanish
    }
  }

  useEffect(() => {
    setHtmlLangAttribute(lang);
  }, [lang]);

  return lang;
}

/**
 * Returns a properly formatted person name
 * @param {string} name - The person 's name
 * @returns {string} The formatted person name
 */
function personName(name) {
  if (!name) return '';
  return String(name).trim();
}

/**
 * Creates an accessible in- page button and appends it to the given parent element.
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
  if (!table || typeof table !== 'object' || !(table instanceof HTMLElement)) return false;

  // Check if table has a caption
  if (!table.querySelector('caption')) {
    console.warn('Table is missing a caption');
    return false;
  }

  // Check if table has proper headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    console.warn('Table is missing header cells');
    return false;
  }

  // Check if table cells have proper scope attributes
  const cells = table.querySelectorAll('th');
  for (const cell of cells) {
    if (cell.tagName === 'TH' && !cell.getAttribute('scope')) {
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
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    console.warn('Table is missing required thead or tbody elements');
    return false;
  }

  // Check if table has at least one row
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
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
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const role = element.getAttribute('role') || element.tagName.toLowerCase();

  if (!validRoles.includes(role) && !validRoles.includes(element.tagName.toLowerCase())) {
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
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby') && !element.getAttribute('name')) {
        return false;
      }
      break;
    case 'search':
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        return false;
      }
      break;
    case 'complementary':
      if (!element.getAttribute