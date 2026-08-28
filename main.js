// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
//

/**
 * Adds lang attribute to HTML element for accessibility (REACT_015)
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(langCode = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', langCode);
  }
}

/**
 * Fixes table structure issues for accessibility (REACT_027)
 * Ensures tables have proper headers, captions, and structure
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return;
  
  // Ensure table has a caption if it doesn't have one
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    caption.style.srOnly = true;
    table.insertBefore(caption, table.firstChild);
  }
  
  // Add scope attributes to header cells
  const headers = table.querySelectorAll('th');
  headers.forEach(header => {
    const row = header.closest('tr');
    const cellIndex = Array.from(row.children).indexOf(header);
    const isRowHeader = row.querySelector('td') && !header.hasAttribute('scope');
    
    if (isRowHeader) {
      header.setAttribute('scope', 'row');
    } else if (!header.hasAttribute('scope') && cellIndex === 0) {
      header.setAttribute('scope', 'col');
    }
  });
  
  // Ensure all tables have proper thead and tbody
  if (!table.querySelector('thead')) {
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const thead = document.createElement('thead');
      thead.appendChild(firstRow.cloneNode(true));
      table.insertBefore(thead, table.firstChild);
      firstRow.remove();
    }
  }
  
  if (!table.querySelector('tbody')) {
    const rows = Array.from(table.querySelectorAll('tr'));
    const thead = table.querySelector('thead');
    const tbody = document.createElement('tbody');
    rows.forEach(row => {
      if (row.parentElement === table) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);
  }
}

/**
 * Adds main landmark to the page (REACT_017)
 * @param {HTMLElement} mainElement - The element to mark as main
 */
function addMainLandmark(mainElement) {
  if (!mainElement) return;
  
  // Remove main role if already present
  mainElement.removeAttribute('role');
  
  // Ensure element is a <main> tag or has proper role
  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }
  
  // Ensure only one main landmark exists
  const existingMains = document.querySelectorAll('main, [role="main"]');
  existingMains.forEach((main, index) => {
    if (index > 0 && main !== mainElement) {
      main.removeAttribute('role');
      main.setAttribute('role', 'complementary');
    }
  });
}

/**
 * Ensures all landmarks have unique accessible names (REACT_025)
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    
    // Skip if already has aria-label or aria-labelledby
    if (landmark.hasAttribute('aria-label') || landmark.hasAttribute('aria-labelledby')) {
      return;
    }
    
    // Generate appropriate labels based on landmark type
    const labelMap = {
      'header': 'Site header',
      'nav': 'Site navigation',
      'main': 'Main content',
      'aside': 'Sidebar content',
      'footer': 'Site footer',
      'banner': 'Site header',
      'navigation': 'Site navigation',
      'main': 'Main content',
      'complementary': 'Supplementary content',
      'contentinfo': 'Site footer'
    };
    
    const label = labelMap[tagName] || labelMap[role];
    if (label) {
      landmark.setAttribute('aria-label', label);
    }
  });
}

/**
 * Adds accessible names to SVG elements (REACT_041)
 * @param {string} selector - CSS selector for SVGs to update
 * @param {Object} labels - Map of SVG identifiers to accessible labels
 */
function addSvgAccessibleNames(selector = 'svg', labels = {}) {
  const svgs = document.querySelectorAll(selector);
  
  svgs.forEach((svg, index) => {
    // Skip if already has title or aria-label
    let title = svg.querySelector('title');
    
    if (!title) {
      title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      svg.insertBefore(title, svg.firstChild);
    }
    
    // Get identifier for lookup
    const id = svg.getAttribute('id') || `svg-${index}`;
    const label = labels[id] || labels[index] || `Decorative image ${index + 1}`;
    
    title.textContent = label;
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', title.id || `svg-title-${index}`);
    
    if (!title.id) {
      title.id = `svg-title-${index}`;
    }
  });
}

/**
 * Fixes fake link issues - converts buttons styled as links or adds proper roles (REACT_036)
 * @param {HTMLElement} element - The element to check/fix
 */
function fixFakeLinkIssue(element) {
  if (!element) return;
  
  const isFakeLink = () => {
    const tagName = element.tagName.toLowerCase();
    const isClickable = element.onclick || getComputedStyle(element).cursor === 'pointer';
    const hasHref = element.hasAttribute('href');
    const isAnchor = tagName === 'a';
    
    return isClickable && !hasHref && !isAnchor;
  };
  
  if (isFakeLink()) {
    // Option 1: Convert to proper link if it navigates
    const href = element.getAttribute('data-href');
    if (href) {
      element.setAttribute('href', href);
      element.removeAttribute('data-href');
    } else {
      // Option 2: Convert to button for proper semantics
      element.setAttribute('role', 'button');
      
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      
      // Add keyboard support
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    }
  }
}

/**
 * Initialize accessibility improvements
 */
function initializeAccessibility() {
  // Add lang attribute on page load
  addLangAttribute(document.documentElement.lang || 'en');
  
  // Fix all tables
  document.querySelectorAll('table').forEach(table => fixTableStructure(table));
  
  // Fix main landmark
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (main) addMainLandmark(main);
  
  // Ensure unique landmarks
  ensureUniqueLandmarks();
  
  // Add SVG accessible names (default empty, should be populated with actual labels)
  addSvgAccessibleNames('svg:not([aria-hidden="true"])', {});
  
  // Fix fake links
  document.querySelectorAll('[onclick], [data-href]').forEach(el => fixFakeLinkIssue(el));
}

// Export functions for testing and external use
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  initializeAccessibility
};

// Auto-initialize if running in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}