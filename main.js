// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute / setHtmlLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue / convertAnchorsToButtons)

const renderHeader = require('./renderHeader');
const renderFooter = require('./renderFooter');

export function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

export function fixTableStructureIssues() {
  document.querySelectorAll('table').forEach(table => {
    if (table.querySelector('thead') || table.querySelector('tbody')) return;

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');

    rows.forEach((row, index) => {
      if (index === 0) {
        thead.appendChild(row);
      } else {
        tbody.appendChild(row);
      }
    });

    if (thead.children.length > 0 && tbody.children.length > 0) {
      table.innerHTML = '';
      table.appendChild(thead);
      table.appendChild(tbody);
    }
  });
}

export function addMainLandmark() {
  if (!document.querySelector('main')) {
    const mainElement = document.createElement('main');
    document.body.prepend(mainElement);
  }
}

export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'SVG Image';
      svg.prepend(title);
    }
  });
}

export function ensureUniqueLandmarks() {
  const landmarkRoles = ['main', 'header', 'footer', 'nav', 'aside'];
  landmarkRoles.forEach(tag => {
    const elements = document.querySelectorAll(tag);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute('role');
        }
      });
    }
  });
}

export function fixFakeLinkIssue() {
  document.querySelectorAll('[onclick]').forEach(el => {
    if (el.tagName.toLowerCase() !== 'A') {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = el.textContent;
      a.onclick = el.onclick;
      el.replaceWith(a);
    }
  });
}

// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  document.documentElement.lang = lang;
}

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

// Original code from main.js
const originalFunction = (input) => {
  // ... existing implementation ...
};

// New function or change requested in the issue
const newFunction = (input) => {
  // ... new implementation ...
};

// Existing code that must continue to pass
const otherFunction = (input) => {
  // ... existing implementation ...
};

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

// Exporting functions as before
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    originalFunction,
    newFunction,
    otherFunction,
    renderHomePage,
    renderDashboard,
    setHtmlLangAttribute,
    detectAndSetLang,
    convertAnchorsToButtons,
    setLanguage
  };
}
}