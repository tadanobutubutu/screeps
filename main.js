// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Add lang attribute to HTML element for accessibility (REACT_015)
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (e.g., 'en', 'es')
 */
export function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
}

/**
 * Fix table structure issues for accessibility (REACT_027)
 * @param {HTMLElement} table - The table element to fix
 */
export function fixTableStructureIssues(table) {
  if (!table) return;
  
  // Ensure table has proper structure
  const hasThead = table.querySelector('thead');
  const hasTbody = table.querySelector('tbody');
  
  if (!hasThead) {
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const thead = table.ownerDocument.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }
  
  if (!hasTbody) {
    const rows = table.querySelectorAll('tr');
    const tbody = table.ownerDocument.createElement('tbody');
    rows.forEach(row => {
      if (row.parentElement === table) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);
  }
}

/**
 * Add main landmark to page for accessibility (REACT_017)
 * @param {Document} doc - The document object
 */
export function addMainLandmark(doc) {
  const existingMain = doc.querySelector('main');
  if (!existingMain) {
    const main = doc.createElement('main');
    const body = doc.body;
    if (body && body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else if (body) {
      body.appendChild(main);
    }
  }
}

/**
 * Add accessible names to SVG elements (REACT_041)
 * @param {HTMLElement} svg - The SVG element
 * @param {string} name - The accessible name
 */
export function addSvgAccessibleNames(svg, name) {
  if (!svg || svg.tagName.toLowerCase() !== 'svg') return;
  
  // Add title element as first child for accessibility
  const existingTitle = svg.querySelector('title');
  if (!existingTitle) {
    const title = svg.ownerDocument.createElement('title');
    title.textContent = name;
    svg.insertBefore(title, svg.firstChild);
  }
  
  // Add aria-labelledby if not present
  if (!svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
    svg.setAttribute('role', 'img');
    const title = svg.querySelector('title');
    if (title) {
      const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      title.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    }
  }
}

/**
 * Ensure unique landmarks on the page (REACT_025)
 * @param {Document} doc - The document object
 */
export function ensureUniqueLandmarks(doc) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          // Add aria-label to differentiate multiple landmarks of same type
          const currentLabel = el.getAttribute('aria-label');
          if (!currentLabel) {
            const landmarkName = el.tagName.toLowerCase();
            el.setAttribute('aria-label', `Additional ${landmarkName}`);
          }
        }
      });
    }
  });
}

/**
 * Fix fake link issues - convert non-link elements that behave like links (REACT_036)
 * @param {HTMLElement} element - The element to fix
 */
export function fixFakeLinkIssue(element) {
  if (!element) return;
  
  const tagName = element.tagName.toLowerCase();
  const isClickable = element.getAttribute('role') === 'link' || 
                      element.style.cursor === 'pointer' ||
                      element.onclick !== null;
  
  // If element looks like a link but isn't an anchor or button
  if (isClickable && tagName !== 'a' && tagName !== 'button') {
    // Option 1: Convert to proper button if it triggers an action
    element.setAttribute('role', 'button');
    
    // Option 2: Convert to anchor if it navigates (preferred)
    // This would require href attribute - suggest using anchor instead
    if (element.getAttribute('href') || element.dataset.href) {
      const newAnchor = document.createElement('a');
      newAnchor.href = element.href || element.dataset.href;
      newAnchor.setAttribute('aria-label', element.textContent || 'Link');
      newAnchor.setAttribute('class', element.className);
      
      // Copy children
      while (element.firstChild) {
        newAnchor.appendChild(element.firstChild);
      }
      
      // Copy attributes
      Array.from(element.attributes).forEach(attr => {
        if (attr.name !== 'href' && attr.name !== 'class') {
          newAnchor.setAttribute(attr.name, attr.value);
        }
      });
      
      element.parentNode.replaceChild(newAnchor, element);
    }
  }
}

// Main initialization function
export function initializeApp() {
  const doc = document;
  
  // Apply accessibility fixes
  addLangAttribute(doc);
  addMainLandmark(doc);
  ensureUniqueLandmarks(doc);
  
  // Fix SVGs
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
      const svgName = svg.id || svg.className.baseVal || 'Decorative image';
      addSvgAccessibleNames(svg, svgName);
    }
  });
  
  // Fix tables
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => fixTableStructureIssues(table));
  
  // Fix fake links
  const clickableElements = doc.querySelectorAll('[role="link"], [style*="cursor: pointer"]');
  clickableElements.forEach(el => fixFakeLinkIssue(el));
}

// Auto-initialize if this is the main module
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}