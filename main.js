/**
 * Accessibility fixes for main.js
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix table structure issues
 * - REACT_017: Add/fix landmark issues
 * - REACT_025: Ensure unique landmarks
 * - REACT_041: Add accessible names to SVGs
 * - REACT_036: Fix fake link issue
 */

/**
 * REACT_015: Add lang attribute to HTML element
 * @param {Document} doc - The document object
 * @param {string} lang - Language code (e.g., 'en', 'es')
 */
function addLangAttribute(doc, lang = 'en') {
  if (doc && doc.documentElement) {
    doc.documentElement.lang = lang;
  }
}

/**
 * REACT_027: Fix table structure issues
 * @param {HTMLElement} table - Table element to fix
 */
function fixTableStructure(table) {
  if (!table) return;
  
  // Ensure proper table structure with thead, tbody, tfoot
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }
  
  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      if (row.parentElement !== tbody) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);
  }
}

/**
 * REACT_017: Add main landmark
 * @param {Document} doc - The document object
 */
function addMainLandmark(doc) {
  if (!doc) return;
  
  // Check if main element already exists
  let main = doc.querySelector('main');
  
  if (!main) {
    main = doc.createElement('main');
    main.id = 'main-content';
    main.setAttribute('role', 'main');
    
    // Try to find the content to wrap
    const body = doc.body;
    if (body && body.firstChild) {
      body.insertBefore(main, body.firstChild);
    }
  }
  
  return main;
}

/**
 * REACT_025: Ensure unique landmarks
 * @param {Document} doc - The document object
 */
function ensureUniqueLandmarks(doc) {
  if (!doc) return;
  
  const landmarkTags = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  
  landmarkTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    
    // Make <header> and <footer> unique by only having one non-nested version
    if (tag === 'header' || tag === 'footer') {
      let mainLandmark = null;
      elements.forEach((el, index) => {
        // Keep the first one that's a direct child of body
        if (!mainLandmark && el.parentElement === doc.body) {
          mainLandmark = el;
        } else if (index > 0) {
          // Remove duplicate role attributes or add aria-label
          if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
            el.setAttribute('aria-label', `${tag}-${index + 1}`);
          }
        }
      });
    }
  });
}

/**
 * REACT_041: Add accessible names to SVGs
 * @param {Document} doc - The document object
 */
function addSvgAccessibleNames(doc) {
  if (!doc) return;
  
  const svgs = doc.querySelectorAll('svg');
  let svgCount = 0;
  
  svgs.forEach((svg, index) => {
    // Check if it already has an accessible name
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
    const title = svg.querySelector('title');
    
    if (!hasAriaLabel && !hasAriaLabelledby && !title) {
      // Add a title element for accessibility
      const titleEl = doc.createElement('title');
      titleEl.textContent = `SVG icon ${index + 1}`;
      svg.insertBefore(titleEl, svg.firstChild);
      
      // Add role="img" and aria-labelledby
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', `svg-title-${index}`);
      titleEl.id = `svg-title-${index}`;
      
      svgCount++;
    }
  });
  
  return svgCount;
}

/**
 * REACT_036: Fix fake link issue
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssue(doc) {
  if (!doc) return;
  
  // Find elements that look like links but aren't <a> tags
  const clickableElements = doc.querySelectorAll('[role="button"], [onclick]');
  
  clickableElements.forEach(el => {
    // If it looks like a link but isn't an anchor or button
    if (el.tagName !== 'A' && el.tagName !== 'BUTTON') {
      const href = el.getAttribute('href');
      const role = el.getAttribute('role');
      
      if (role === 'link' || (href && href !== '#' && !href.startsWith('javascript:'))) {
        // Convert to proper anchor or ensure proper keyboard handling
        if (!el.getAttribute('tabindex')) {
          el.setAttribute('tabindex', '0');
        }
        if (!el.getAttribute('role') || el.getAttribute('role') === 'link') {
          el.setAttribute('role', 'link');
        }
        
        // Add keyboard support if not present
        if (!el.hasAttribute('onkeydown')) {
          el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              el.click();
            }
          });
        }
      }
    }
  });
}

/**
 * Apply all accessibility fixes
 * @param {Document} doc - The document object (defaults to window.document)
 */
function applyAccessibilityFixes(doc = typeof window !== 'undefined' ? window.document : null) {
  if (!doc) return;
  
  addLangAttribute(doc, 'en');
  
  // Fix tables
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => fixTableStructure(table));
  
  addMainLandmark(doc);
  ensureUniqueLandmarks(doc);
  addSvgAccessibleNames(doc);
  fixFakeLinkIssue(doc);
}

// Export functions for use in other modules
module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  applyAccessibilityFixes
};