const renderHeader = require('./renderHeader');
const renderFooter = require('./renderFooter');

// Accessibility helper function for addressing new accessibility issues from the insight report
function checkAccessibilityCompliance(element) {
  const issues = [];
  
  // REACT_015: Add lang attribute to HTML element
  if (element.tagName === 'HTML' && !element.hasAttribute('lang')) {
    issues.push('HTML element missing lang attribute');
  }
  
  // REACT_017: Add/fix 4 landmark issues
  if (element.hasAttribute('role') && !element.getAttribute('role').includes(' ')) {
    issues.push('Landmark element should have proper labeling');
  }
  
  // REACT_025: Ensure unique landmarks (2 issues)
  if (element.hasAttribute('role') && ['banner', 'navigation', 'main', 'contentinfo', 'complementary'].includes(element.getAttribute('role'))) {
    const sameRoleElements = document.querySelectorAll(`[role="${element.getAttribute('role')}"]`);
    if (sameRoleElements.length > 1) {
      issues.push('Duplicate landmark role found');
    }
  }
  
  // REACT_036: Fix 1 fake link issue
  if ((element.tagName === 'DIV' || element.tagName === 'SPAN') && element.getAttribute('role') === 'link') {
    issues.push('Fake link detected: use an anchor element instead');
  }
  
  if (element.tagName === 'A' && !element.hasAttribute('href') && element.getAttribute('role') !== 'button') {
    issues.push('Anchor element missing href attribute');
  }
  
  if (element.hasAttribute('onclick') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
    issues.push('Clickable element should be a button or link');
  }
  
  if (element.getAttribute('role') === 'button' && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
    issues.push('Button role should be on a semantic button or link element');
  }
  
  return {
    compliant: issues.length === 0,
    issues: issues
  };
}

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  document.documentElement.lang = lang;
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderHomePage,
    renderDashboard,
    setHtmlLangAttribute,
    detectAndSetLang,
    convertAnchorsToButtons
  };
}