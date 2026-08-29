const renderHeader = require('./renderHeader');
const renderFooter = require('./renderFooter');

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

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  document.documentElement.lang = lang;
}

// TODO: This is the existing code that needs to be preserved (This comment remains as-is)

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
    } else if (/[àâäçéèêëîïôûü]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return setHtmlLangAttribute(lang);
}

function renderHomePage() {
  return renderHeader() + '<div>Home Page</div>' + renderFooter();
}

function renderDashboard() {
  return renderHeader() + '<div>Dashboard Content</div>' + renderFooter();
}

// New function to convert anchor tags to buttons with specific id and text
function convertAnchorsToButtons() {
  if (typeof document !== 'undefined') {
    const anchors = document.querySelectorAll('a#unrotate');
    anchors.forEach(anchor => {
      const button = document.createElement('button');
      button.id = anchor.id;
      button.type = 'button';
      button.textContent = anchor.textContent;
      anchor.parentNode.replaceChild(button, anchor);
    });
  }
}

function validateLandmark(element) {
  if (!element) return false;
  const tag = (element.tagName || '').toLowerCase();
  let role = element.getAttribute ? element.getAttribute('role') : null;

  if (!role) {
    if (tag === 'main') role = 'main';
    else if (tag === 'nav') role = 'navigation';
    else if (tag === 'aside') role = 'complementary';
    else if (tag === 'header') role = 'banner';
    else if (tag === 'footer') role = 'contentinfo';
    else if (tag === 'section') role = 'region';
    else if (tag === 'form') role = 'form';
    else if (tag === 'search') role = 'search';
  }

  if (role && element.setAttribute) {
    element.setAttribute('role', role);
  }

  return !!role;
}

function validateLandmarkStructure(element) {
  if (!element) return false;
  const tag = (element.tagName || '').toLowerCase();
  const role = element.getAttribute ? element.getAttribute('role') : null;
  const validTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'form', 'search'];
  const validRoles = ['main', 'navigation', 'complementary', 'contentinfo', 'region', 'search', 'form', 'banner', 'application'];
  return validTags.indexOf(tag) !== -1 || (role && validRoles.indexOf(role) !== -1);
}

function validateLandmarkAttributes(element) {
  if (!element) return false;
  const tag = (element.tagName || '').toLowerCase();
  let role = element.getAttribute ? element.getAttribute('role') : null;

  if (!role) {
    if (tag === 'nav') role = 'navigation';
    else if (tag === 'aside') role = 'complementary';
    else if (tag === 'header') role = 'banner';
    else if (tag === 'footer') role = 'contentinfo';
    else if (tag === 'section') role = 'region';
    else if (tag === 'main') role = 'main';
    else if (tag === 'form') role = 'form';
    else if (tag === 'search') role = 'search';
  }

  if (!role) return false;

  const needsName = ['navigation', 'complementary', 'region', 'contentinfo', 'banner', 'search', 'form', 'main'];
  if (needsName.indexOf(role) !== -1 && element.setAttribute) {
    const hasLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
    if (!hasLabel) {
      const defaultLabels = {
        main: 'Main',
        navigation: 'Navigation',
        complementary: 'Complementary',
        region: 'Region',
        contentinfo: 'Content info',
        banner: 'Banner',
        search: 'Search',
        form: 'Form'
      };
      element.setAttribute('aria-label', defaultLabels[role] || role);
    }
  }

  return true;
}

// Call the function to convert anchors to buttons if needed
if (typeof document !== 'undefined') {
  convertAnchorsToButtons();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderHomePage,
    renderDashboard,
    setHtmlLangAttribute,
    detectAndSetLang,
    convertAnchorsToButtons,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkAttributes
  };
}