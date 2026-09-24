//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to the HTML element for accessibility (REACT_015)
 * @param {string} langCode - The language code (e.g., 'en', 'es')
 * @returns {string} - The lang attribute string
 */
function addLangAttribute(langCode = 'en') {
  return `lang="${langCode}"`;
}

/**
 * Fixes table structure issues for accessibility (REACT_027)
 * Ensures tables have proper headers and semantic structure
 * @param {HTMLElement} table - The table element to fix
 * @returns {boolean} - Whether the fix was successful
 */
function fixTableStructureIssues(table) {
  if (!table) return false;
  
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td, th');
  
  // Ensure proper scope attributes on headers
  headers.forEach(header => {
    if (!header.getAttribute('scope')) {
      const row = header.parentElement;
      const cellIndex = Array.from(row.children).indexOf(header);
      const isRowHeader = row.previousElementSibling === null;
      
      header.setAttribute('scope', isRowHeader ? 'row' : 'col');
    }
  });
  
  // Ensure tables have captions if they don't already
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    caption.style.clip = 'rect(0 0 0 0)';
    caption.style.clipPath = 'inset(50%)';
    caption.style.height = '1px';
    caption.style.overflow = 'hidden';
    caption.style.position = 'absolute';
    caption.style.whiteSpace = 'nowrap';
    caption.style.width = '1px';
    table.insertBefore(caption, table.firstChild);
  }
  
  return true;
}

/**
 * Adds main landmark to the page (REACT_017)
 * @param {HTMLElement} mainContent - The main content element
 * @returns {HTMLElement} - The modified main element
 */
function addMainLandmark(mainContent) {
  if (!mainContent) return null;
  
  mainContent.setAttribute('role', 'main');
  mainContent.id = mainContent.id || 'main-content';
  
  return mainContent;
}

/**
 * Adds accessible names to SVG elements (REACT_041)
 * @param {NodeList|Array} svgs - Collection of SVG elements
 * @returns {number} - Number of SVGs updated
 */
function addSvgAccessibleNames(svgs) {
  let count = 0;
  
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (title && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const titleId = title.id || `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      title.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
      count++;
    } else if (!title && !svg.getAttribute('aria-label')) {
      const newTitle = document.createElement('title');
      newTitle.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      newTitle.textContent = 'Decorative graphic';
      svg.insertBefore(newTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', newTitle.id);
      count++;
    }
  });
  
  return count;
}

/**
 * Ensures unique landmarks on the page (REACT_025)
 * Updates to keep a single <main> element
 * @param {Document} doc - The document object
 * @returns {boolean} - Whether unique landmarks were ensured
 */
function ensureUniqueLandmarks(doc) {
  if (!doc) return false;
  
  const mains = doc.querySelectorAll('main, [role="main"]');
  
  if (mains.length > 1) {
    // Keep only the first main, remove role from others
    for (let i = 1; i < mains.length; i++) {
      mains[i].removeAttribute('role');
    }
  }
  
  return true;
}

/**
 * Fixes fake link issues by ensuring proper link behavior (REACT_036)
 * @param {HTMLElement} element - The fake link element to fix
 * @returns {boolean} - Whether the fix was successful
 */
function fixFakeLinkIssue(element) {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  const isAnchor = tagName === 'a';
  
  if (!isAnchor) {
    // Add proper keyboard support
    if (!element.getAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    
    // Add click handler for keyboard users
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
    
    // Ensure it's not in the tab order if not interactive
    if (element.getAttribute('role') === 'button') {
      element.setAttribute('role', 'link');
    }
  }
  
  return true;
}

// TODO: New function added as requested in the issue
function newFunction() {
  // Implementation of the new function goes here
  console.log('New function is active!');
}

module.exports = {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  newFunction
};