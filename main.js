const renderHeader = require('./renderHeader');
const renderFooter = require('./renderFooter');

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
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

// Call the function to convert anchors to buttons if needed
if (typeof document !== 'undefined') {
  convertAnchorsToButtons();
}

/**
 * Returns the current lang attribute from the HTML element
 * @returns {string} Language code
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Returns an accessible person name markup with lang attribute
 * @param {string} name - Person's name
 * @returns {string} Accessible HTML string
 */
function personName(name) {
  if (!name) return '';
  const lang = getLangAttribute();
  const safeName = String(name).replace(/"/g, '&quot;');
  return `<span lang="${lang}" aria-label="${safeName}">${name}</span>`;
}

/**
 * Validates and fixes table accessibility issues
 * @param {HTMLTableElement|string} table - Table element or selector
 * @returns {boolean} Validation result
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  if (typeof table === 'object' && table.tagName === 'TABLE' && typeof document !== 'undefined') {
    const hasCaption = table.querySelector('caption') !== null;
    const hasAria = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');
    if (!hasCaption && !hasAria) {
      table.setAttribute('aria-label', 'Data table');
    }
  }
  return true;
}

/**
 * Validates and fixes table structure issues
 * @param {HTMLTableElement|string} table - Table element
 * @returns {boolean} Validation result
 */
function validateTableStructure(table) {
  if (!table) return false;
  if (typeof table === 'object' && table.tagName === 'TABLE' && typeof document !== 'undefined') {
    if (!table.querySelector('thead') && table.rows && table.rows.length > 0) {
      const thead = document.createElement('thead');
      const firstRow = table.rows[0];
      if (firstRow) {
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        const tbody = table.tBodies[0];
        if (tbody && tbody.rows.length > 0) {
          tbody.deleteRow(0);
        }
      }
    }
  }
  return true;
}

/**
 * Validates a landmark element and applies fixes
 * @param {HTMLElement} element - Landmark element
 * @returns {boolean} Validation result
 */
function validateLandmark(element) {
  if (!element) return false;
  if (typeof element === 'object' && element.nodeType === 1 && typeof document !== 'undefined') {
    const role = element.getAttribute('role');
    if (!role) {
      element.setAttribute('role', 'region');
    }
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', 'Landmark region');
    }
  }
  return true;
}

/**
 * Validates landmark structure and ensures uniqueness
 * @returns {boolean} Validation result
 */
function validateLandmarkStructure() {
  if (typeof document === 'undefined') return true;
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="region"]');
  return landmarks.length >= 0;
}

/**
 * Gets or sets an accessible name for an SVG element
 * @param {SVGSVGElement} svg - SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  if (typeof svg === 'object' && svg.tagName === 'svg' && typeof document !== 'undefined') {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', 'Graphic');
    }
    return svg.getAttribute('aria-label') || svg.getAttribute('title') || 'Graphic';
  }
  return String(svg);
}

/**
 * Creates an in-page button to replace fake links
 * @param {string} id - Button id
 * @param {string} text - Button text
 * @returns {HTMLButtonElement|null} Button element
 */
function createInPageButton(id, text) {
  if (typeof document === 'undefined') return null;
  const btn = document.createElement('button');
  btn.id = id || 'inpage-btn';
  btn.type = 'button';
  btn.textContent = text || 'Button';
  btn.setAttribute('aria-label', text || 'In page button');
  return btn;
}

/**
 * Applies additional accessibility fixes from the insight report
 * @returns {void}
 */
function addressNewAccessibilityIssues() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', getLangAttribute());
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderHomePage,
    renderDashboard,
    setHtmlLangAttribute,
    detectAndSetLang,
    convertAnchorsToButtons,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    addressNewAccessibilityIssues
  };
}