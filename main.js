// Assuming main.js has a <html> tag, add the lang attribute based on your content

/**
 * Adds the lang attribute to the document's <html> tag based on content or user preference
 * @param {string} content - The text content to analyze (optional)
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(content) {
  let lang = getLangAttribute();
  if (content) {
    lang = detectAndSetLang(content);
  }
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Get the current lang attribute from the document's <html> element
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
  let lang = 'en'; // Default to English

  if (content) {
    // Simple language detection based on common patterns
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[éèêàâïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  if (navigator && navigator.language) {
    lang = navigator.language;
  }
  document.documentElement.setAttribute('lang', lang);
  return lang;
}

// The rest of the code remains the same as before...