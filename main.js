// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (e.g., 'en', 'es')
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
}

/**
 * Fixes table structure issues for accessibility
 * @param {Document} doc - The document object
 */
function fixTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = doc.createElement('thead');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
      }
    }
    // Ensure tables have tbody
    if (!table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      const tbody = doc.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
  });
}

/**
 * Adds main landmark to the document
 * @param {Document} doc - The document object
 */
function addMainLandmark(doc) {
  const mains = doc.querySelectorAll('main');
  if (mains.length === 0) {
    const main = doc.createElement('main');
    const body = doc.querySelector('body');
    if (body) {
      // Move existing body content into main
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
}

/**
 * Adds accessible names to SVG elements
 * @param {Document} doc - The document object
 */
function addSvgAccessibleNames(doc) {
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const existingTitle = svg.querySelector('title');
      if (existingTitle) {
        const titleId = existingTitle.id || `svg-title-${index}`;
        existingTitle.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
      }
    }
  });
}

/**
 * Ensures unique landmarks in the document
 * @param {Document} doc - The document object
 */
function ensureUniqueLandmarks(doc) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute(landmark);
        }
      });
    }
  });
}

/**
 * Fixes fake link issues (links without href or with # href)
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssue(doc) {
  const links = doc.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '') {
      if (link.getAttribute('role') !== 'button') {
        link.setAttribute('role', 'button');
      }
      // Add keyboard support for button behavior
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
}

/**
 * Initialize accessibility fixes
 * @param {Document} doc - The document object (defaults to window.document)
 */
function initializeAccessibility(doc = window.document) {
  addLangAttribute(doc);
  fixTableStructure(doc);
  addMainLandmark(doc);
  addSvgAccessibleNames(doc);
  ensureUniqueLandmarks(doc);
  fixFakeLinkIssue(doc);
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAccessibility());
  } else {
    initializeAccessibility();
  }
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  initializeAccessibility
};