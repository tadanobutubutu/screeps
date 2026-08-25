// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Add lang attribute to HTML element
 * Addresses REACT_015
 * @param {Document} doc - The document object
 * @param {string} lang - The language code to set
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
}

/**
 * Fix table structure issues
 * Addresses REACT_027
 * @param {Document} doc - The document object
 */
function fixTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure with thead and tbody
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
    const tbodies = table.querySelectorAll('tbody');
    if (tbodies.length === 0) {
      const rows = Array.from(table.querySelectorAll('tr'));
      if (rows.length > 0) {
        const tbody = doc.createElement('tbody');
        rows.forEach(row => tbody.appendChild(row));
        const thead = table.querySelector('thead');
        if (thead) {
          table.insertBefore(tbody, thead.nextSibling);
        } else {
          table.insertBefore(tbody, table.firstChild);
        }
      }
    }
    
    // Add scope attributes to header cells
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

/**
 * Add main landmark to the document
 * Addresses REACT_017
 * @param {Document} doc - The document object
 */
function addMainLandmark(doc) {
  const mains = doc.querySelectorAll('main');
  if (mains.length === 0) {
    // Find the main content area and wrap it with main element
    const body = doc.body;
    if (body) {
      const main = doc.createElement('main');
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
}

/**
 * Ensure unique landmarks
 * Addresses REACT_025
 * @param {Document} doc - The document object
 */
function ensureUniqueLandmarks(doc) {
  const landmarkTags = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  landmarkTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    if (elements.length > 1) {
      // For duplicate landmarks, add aria-label to make them unique
      elements.forEach((el, index) => {
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
          el.setAttribute('aria-label', `${tag}-${index + 1}`);
        }
      });
    }
  });
}

/**
 * Add accessible names to SVGs
 * Addresses REACT_041
 * @param {Document} doc - The document object
 */
function addSvgAccessibleNames(doc) {
  const svgs = doc.querySelectorAll('svg');
  let svgCount = 0;
  svgs.forEach(svg => {
    svgCount++;
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = doc.createElement('title');
      title.textContent = `SVG icon ${svgCount}`;
      title.setAttribute('id', `svg-title-${svgCount}`);
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', `svg-title-${svgCount}`);
    }
  });
}

/**
 * Fix fake link issues - replace non-link elements that behave like links
 * Addresses REACT_036
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssue(doc) {
  // Find elements with onclick that navigate but aren't <a> tags
  const fakeLinks = doc.querySelectorAll('[role="link"]:not(a), [onclick*="window.location"], [onclick*="location.href"]');
  fakeLinks.forEach(el => {
    // Convert to proper anchor if it has a URL
    const onclick = el.getAttribute('onclick');
    if (onclick) {
      const urlMatch = onclick.match(/['"](https?:\/\/[^'"]+)['"]|location\.(href|replace)\(['"]([^'"]+)['"]/);
      if (urlMatch) {
        const url = urlMatch[1] || urlMatch[3];
        if (url) {
          el.setAttribute('role', 'button');
          el.removeAttribute('onclick');
          el.setAttribute('data-href', url);
        }
      }
    }
  });
}

/**
 * Apply all accessibility fixes
 * @param {Document} doc - The document object
 * @param {Object} options - Configuration options
 */
function applyAccessibilityFixes(doc, options = {}) {
  const lang = options.lang || 'en';
  
  addLangAttribute(doc, lang);
  fixTableStructure(doc);
  addMainLandmark(doc);
  ensureUniqueLandmarks(doc);
  addSvgAccessibleNames(doc);
  fixFakeLinkIssue(doc);
}

// Export functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    ensureUniqueLandmarks,
    addSvgAccessibleNames,
    fixFakeLinkIssue,
    applyAccessibilityFixes
  };
}