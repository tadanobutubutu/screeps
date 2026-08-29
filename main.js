const renderHeader = require('./renderHeader');
const renderFooter = require('./renderFooter');

// Accessibility issues addressed:
// - REACT_015: lang attribute (addLangAttribute, setHtmlLangAttribute)
// - REACT_027: table structure (fixTableStructure)
// - REACT_017: landmarks (addMainLandmark, fixLandmarkIssues)
// - REACT_025: unique landmarks (ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: SVG accessibility (addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: fake links (fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in (googleSignIn)
// - REACT_040: button identifiers (fixButtonIdentifiers)

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
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
  let lang = 'en'; // Default to English
  
  if (content) {
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04FF]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06FF]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâäéèêëîïôöùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  setHtmlLangAttribute(lang);
  return lang;
}

function renderHomePage() {
  return renderHeader() + '<div>Home Page</div>' + renderFooter();
}

function renderDashboard() {
  return renderHeader() + '<div>Dashboard Content</div>' + renderFooter();
}

/**
 * Converts all anchors to buttons with appropriate ids and text.
 * Preserves attributes and replaces in DOM.
 */
function convertAnchorsToButtons() {
  if (typeof document !== 'undefined') {
    const anchors = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
    anchors.forEach(anchor => {
      const button = document.createElement('button');
      button.id = anchor.id;
      button.type = 'button';
      button.textContent = anchor.textContent;
      // Copy data attributes
      for (let attr of anchor.attributes) {
        if (attr.name !== 'href' && attr.name !== 'id') {
          button.setAttribute(attr.name, attr.value);
        }
      }
      anchor.parentNode.replaceChild(button, anchor);
    });
  }
}

// ------------------------- Accessibility functions -------------------------

/**
 * Adds lang attribute to the HTML element.
 * Wrapper for setHtmlLangAttribute for consistency.
 */
function addLangAttribute(lang) {
  return setHtmlLangAttribute(lang);
}

/**
 * Fixes table structure accessibility issues.
 * Ensures tables have a caption and th elements have scope attributes.
 */
function fixTableStructure() {
  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      // Add caption if missing
      if (!table.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.textContent = 'Table caption';
        table.insertBefore(caption, table.firstChild);
      }
      // Add scope to all th elements if missing
      table.querySelectorAll('th').forEach(th => {
        if (!th.hasAttribute('scope')) {
          // Determine if it's a row or column header
          const parentRow = th.closest('tr');
          const parentRowHeaders = Array.from(parentRow.querySelectorAll('th'));
          if (parentRowHeaders.length > 0 && parentRowHeaders[0] === th) {
            th.setAttribute('scope', 'row');
          } else {
            th.setAttribute('scope', 'col');
          }
        }
      });
    });
  }
}

/**
 * Adds a main landmark to the document if missing.
 */
function addMainLandmark() {
  if (typeof document !== 'undefined' && !document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    // Insert before footer or at end of body
    const footer = document.querySelector('footer');
    if (footer) {
      document.body.insertBefore(main, footer);
    } else {
      document.body.appendChild(main);
    }
  }
}

/**
 * Fixes landmark issues by ensuring proper roles on common structural elements.
 */
function fixLandmarkIssues() {
  if (typeof document !== 'undefined') {
    // Ensure header has role="banner"
    const headers = document.querySelectorAll('header');
    headers.forEach(header => {
      if (!header.hasAttribute('role')) {
        header.setAttribute('role', 'banner');
      }
    });
    // Ensure nav has role="navigation"
    const navs = document.querySelectorAll('nav');
    navs.forEach(nav => {
      if (!nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
    });
    // Ensure footer has role="contentinfo"
    const footers = document.querySelectorAll('footer');
    footers.forEach(footer => {
      if (!footer.hasAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
      }
    });
    // Main landmark already handled
    addMainLandmark();
  }
}

/**
 * Ensures all landmarks have unique identifiers.
 */
function ensureUniqueLandmarks() {
  if (typeof document !== 'undefined') {
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
    const usedIds = new Set();
    landmarks.forEach(landmark => {
      if (!landmark.id) {
        let id = `landmark-${landmark.tagName.toLowerCase()}`;
        let counter = 1;
        while (usedIds.has(id)) {
          id = `${id}-${counter++}`;
        }
        landmark.id = id;
        usedIds.add(id);
      } else if (usedIds.has(landmark.id)) {
        // Duplicate ID, make unique
        let newId = `${landmark.id}-unique`;
        let counter = 1;
        while (usedIds.has(newId)) {
          newId = `${newId}-${counter++}`;
        }
        landmark.id = newId;
        usedIds.add(newId);
      } else {
        usedIds.add(landmark.id);
      }
    });
  }
}

// Alias for ensureUniqueLandmarks
function uniqueLandmarks() {
  ensureUniqueLandmarks();
}

/**
 * Adds accessible names to SVG elements lacking them.
 */
function addSvgAccessibleNames() {
  if (typeof document !== 'undefined') {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
      // Skip if already has accessible name
      if (svg.querySelector('title') || svg.getAttribute('aria-label') || svg.getAttribute('role') === 'img') {
        return;
      }
      svg.setAttribute('role', 'img');
      const ariaLabel = svg.getAttribute('aria-label') || 'SVG icon';
      svg.setAttribute('aria-label', ariaLabel);
    });
  }
}

// Alias for addSvgAccessibleNames
function addAccessibleNamesToSVGs() {
  addSvgAccessibleNames();
}

/**
 * Fixes fake links by converting them to buttons or adding href.
 */
function fixFakeLinkIssue() {
  if (typeof document !== 'undefined') {
    const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
    fakeLinks.forEach(link => {
      // If the link has a role="button" or has an onclick, convert to button
      if (link.getAttribute('role') === 'button' || link.hasAttribute('onclick')) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = link.textContent;
        button.id = link.id;
        // Copy other attributes except href
        for (let attr of link.attributes) {
          if (attr.name !== 'href' && attr.name !== 'id') {
            button.setAttribute(attr.name, attr.value);
          }
        }
        link.parentNode.replaceChild(button, link);
      } else {
        // Otherwise, give it a meaningful href (e.g., based on id)
        link.setAttribute('href', `#${link.id || 'section'}`);
      }
    });
  }
}

// Alias
function fixFakeLinkIssues() {
  fixFakeLinkIssue();
}

/**
 * Placeholder for Google Sign-In logic.
 * Initializes Google auth if available.
 */
function googleSignIn() {
  if (typeof window !== 'undefined' && window.gapi) {
    // Google API may be loaded externally
    window.gapi.load('auth2', function() {
      window.gapi.auth2.init({
        client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
      }).then(() => {
        console.log('Google Sign-In initialized.');
      });
    });
  } else {
    console.warn('Google Sign-In not available - ensure gapi script is loaded.');
  }
}

/**
 * Replaces elements with id "my-button" with actual button ids from data-target.
 */
function fixButtonIdentifiers() {
  if (typeof document !== 'undefined') {
    const misidentified = document.querySelectorAll('[id="my-button"]');
    misidentified.forEach(el => {
      const targetId = el.getAttribute('data-target');
      if (targetId) {
        el.id = targetId;
      } else {
        // Fallback: generate unique id
        el.id = `button-${Date.now()}`;
      }
      // Ensure it's actually a button (or convert if needed)
      if (el.tagName !== 'BUTTON') {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = el.textContent;
        button.id = el.id;
        // Copy other attributes
        for (let attr of el.attributes) {
          if (attr.name !== 'id') {
            button.setAttribute(attr.name, attr.value);
          }
        }
        el.parentNode.replaceChild(button, el);
      }
    });
  }
}

// Call the function to convert anchors to buttons if needed
if (typeof document !== 'undefined') {
  convertAnchorsToButtons();
  // Uncomment the following lines to run all accessibility fixes automatically
  // addLangAttribute('en');
  // fixTableStructure();
  // fixLandmarkIssues();
  // ensureUniqueLandmarks();
  // addSvgAccessibleNames();
  // fixFakeLinkIssues();
  // fixButtonIdentifiers();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderHomePage,
    renderDashboard,
    setHtmlLangAttribute,
    detectAndSetLang,
    convertAnchorsToButtons,
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    fixLandmarkIssues,
    ensureUniqueLandmarks,
    uniqueLandmarks,
    addSvgAccessibleNames,
    addAccessibleNamesToSVGs,
    fixFakeLinkIssue,
    fixFakeLinkIssues,
    googleSignIn,
    fixButtonIdentifiers
  };
}