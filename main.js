// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

/**
 * Fixes table structure issues for accessibility
 * Addresses issues like missing headers, captions, scope attributes
 * @param {Document} doc - The document object
 * @returns {number} Number of tables fixed
 */
function fixTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  let fixedCount = 0;
  
  tables.forEach((table) => {
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = doc.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
      fixedCount++;
    }
    
    // Ensure th elements have scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const rowHeaders = th.closest('tr')?.querySelectorAll('th');
        const isRowHeader = rowHeaders && Array.from(rowHeaders).includes(th);
        th.setAttribute('scope', isRowHeader ? 'row' : 'col');
        fixedCount++;
      }
    });
    
    // Ensure table has proper thead and tbody
    if (!table.querySelector('thead')) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const thead = doc.createElement('thead');
        thead.appendChild(rows[0]);
        table.insertBefore(thead, table.firstChild);
        fixedCount++;
      }
    }
    
    if (!table.querySelector('tbody')) {
      const tbody = doc.createElement('tbody');
      const remainingRows = table.querySelectorAll('tr');
      remainingRows.forEach((row) => {
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Adds and fixes landmark issues for accessibility
 * Ensures proper use of landmark elements (header, nav, main, footer, aside)
 * @param {Document} doc - The document object
 * @returns {number} Number of landmark issues fixed
 */
function addLandmarkIssues(doc) {
  let fixedCount = 0;
  
  // Ensure there's a main landmark
  const mains = doc.querySelectorAll('main');
  if (mains.length === 0) {
    const main = doc.createElement('main');
    const body = doc.querySelector('body');
    if (body) {
      // Move content to main
      Array.from(body.children).forEach((child) => {
        if (!['SCRIPT', 'STYLE', 'LINK'].includes(child.tagName)) {
          main.appendChild(child);
        }
      });
      body.appendChild(main);
      fixedCount++;
    }
  }
  
  // Ensure there's only one main landmark
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].setAttribute('role', 'region');
      mains[i].setAttribute('aria-label', `Content section ${i}`);
      fixedCount++;
    }
  }
  
  // Add skip link for keyboard navigation
  const skipLink = doc.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  const body = doc.querySelector('body');
  if (body) {
    body.insertBefore(skipLink, body.firstChild);
    fixedCount++;
  }
  
  // Mark the main landmark with id for skip link
  const mainElement = doc.querySelector('main') || doc.querySelector('[role="main"]');
  if (mainElement) {
    mainElement.id = 'main-content';
    fixedCount++;
  }
  
  return fixedCount;
}

/**
 * Adds accessible names to SVG elements
 * @param {Document} doc - The document object
 * @returns {number} Number of SVGs fixed
 */
function addSvgAccessibleNames(doc) {
  const svgs = doc.querySelectorAll('svg');
  let fixedCount = 0;
  
  svgs.forEach((svg, index) => {
    // Check if SVG already has accessible name
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    
    if (!title && !ariaLabel && !ariaLabelledby) {
      const svgTitle = doc.createElement('title');
      svgTitle.textContent = `Icon ${index + 1}`;
      svgTitle.id = `svg-title-${index + 1}`;
      svg.insertBefore(svgTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', svgTitle.id);
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Ensures unique landmarks across the page
 * @param {Document} doc - The document object
 * @returns {number} Number of landmark issues fixed
 */
function ensureUniqueLandmarks(doc) {
  let fixedCount = 0;
  
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach((landmark) => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
        if (!label) {
          const regionLabel = `Section ${index + 1}`;
          el.setAttribute('aria-label', regionLabel);
          fixedCount++;
        }
      });
    }
  });
  
  // Ensure nav elements have labels if multiple exist
  const navs = doc.querySelectorAll('nav');
  if (navs.length > 1) {
    navs.forEach((nav, index) => {
      if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        fixedCount++;
      }
    });
  }
  
  return fixedCount;
}

/**
 * Fixes fake link issues - converts non-navigation elements styled as links
 * @param {Document} doc - The document object
 * @returns {number} Number of fake links fixed
 */
function fixFakeLinkIssue(doc) {
  let fixedCount = 0;
  
  // Find elements with role="link" that aren't anchor elements
  const fakeLinks = doc.querySelectorAll('[role="link"]:not(a)');
  
  fakeLinks.forEach((element) => {
    // Check if it's a clickable div/span that should be a button
    if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
      element.setAttribute('role', 'button');
      // Add tabindex to make it keyboard focusable
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      fixedCount++;
    }
  });
  
  // Fix links without href that act as buttons
  const linksWithoutHref = doc.querySelectorAll('a:not([href])');
  linksWithoutHref.forEach((link) => {
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    if (onclick || role === 'button') {
      link.setAttribute('role', 'button');
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Main initialization function that applies all accessibility fixes
 * @param {Document} doc - The document object (defaults to window.document)
 */
function initializeAccessibility(doc = window.document) {
  addLangAttribute(doc);
  fixTableStructure(doc);
  addLandmarkIssues(doc);
  addSvgAccessibleNames(doc);
  ensureUniqueLandmarks(doc);
  fixFakeLinkIssue(doc);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructure,
    addLandmarkIssues,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    initializeAccessibility
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAccessibility());
  } else {
    initializeAccessibility();
  }
}