// TODO: Identify and update specific functions that render dependency graphs or
//       index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks
// - REACT_036: Fix 1 fake link issue
// - ADD: Address new accessibility issues from insight report

const main = require('./utilities');

const {
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName,
  validateLandmarkStructure,
} = require('./AccessibilityHelpers');

function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

async function detectAndSetLang(content) {
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (content.match(/[\u4E00-\u9FFF]/)) { // Chinese
      lang = 'zh';
    } else if (content.match(/[ｦ-ヺ]/)) { // Japanese
      lang = 'ja';
    } else if (content.match(/[А-Яа-я]/)) { // Russian/Cyrillic
      lang = 'ru';
    } else if (content.match(/[\u0600-\u06FF]/)) { // Arabic
      lang = 'ar';
    } else if (content.match(/[À-ÿ]/)) { // French
      lang = 'fr';
    } else if (content.match(/[á-ú]/)) { // German
      lang = 'de';
    }
  }

  return setHtmlLangAttribute(lang);
}

function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

function addAccessibleName(svgString) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', getSvgAccessibleName(svgElement));
  }

  if (!main.validateTableAccessibility || !main.validateTableStructure) {
    console.warn('validateTableAccessibility and validateTableStructure functions not found in utilities. For comprehensive accessibility checks, consider integrating external helpers.');
  }

  return svgString;
}

function affectedFunction() {
  return main.affectedFunction();
}

export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName,
  validateLandmarkStructure,
  affectedFunction,
};

const main = require('./utilities');

const {
  validateSession,
  handleCredentialResponse,
  checkAccessibilityForReport,
  renderAdditionalContent,
} = require('./AccessibilityHelpers');