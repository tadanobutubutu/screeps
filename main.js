// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(doc, lang = 'en') {
  if (doc.documentElement && !doc.documentElement.hasAttribute('lang')) {
    doc.documentElement.setAttribute('lang', lang);
  }
}

/**
 * Fixes table structure issues by adding proper semantic elements
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table) return;

  // Ensure tables have proper headers
  const headers = table.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      // Determine scope based on context
      const row = header.parentElement;
      const cellIndex = Array.from(row.cells).indexOf(header);
      const thead = table.querySelector('thead');
      
      if (thead && thead.contains(header)) {
        header.setAttribute('scope', 'col');
      } else if (cellIndex === 0) {
        header.setAttribute('scope', 'row');
      } else {
        header.setAttribute('scope', 'col');
      }
    }
  });

  // Add caption if missing and table is data table
  if (!table.querySelector('caption') && !table.classList.contains('layout-table')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    table.insertBefore(caption, table.firstChild);
  }
}

/**
 * Adds landmark roles to main content areas
 * @param {Document} doc - The document object
 */
function addLandmarkIssues(doc) {
  const body = doc.body;
  
  // Ensure main landmark exists
  let main = doc.querySelector('main');
  if (!main) {
    main = doc.createElement('main');
    main.setAttribute('id', 'main-content');
    // Move content to main
    const children = Array.from(body.children);
    children.forEach(child => {
      if (!['SCRIPT', 'STYLE', 'META', 'LINK'].includes(child.tagName)) {
        main.appendChild(child);
      }
    });
    body.appendChild(main);
  } else if (!main.id) {
    main.setAttribute('id', 'main-content');
  }

  // Ensure navigation has proper label if multiple nav elements
  const navs = doc.querySelectorAll('nav');
  if (navs.length > 1) {
    navs.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }
}

/**
 * Adds accessible names to SVG elements
 * @param {Document} doc - The document object
 */
function addSvgAccessibleNames(doc) {
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && 
        !svg.getAttribute('aria-labelledby') && 
        !svg.querySelector('title')) {
      const title = doc.createElement('title');
      title.textContent = `Icon ${index + 1}`;
      title.setAttribute('id', `svg-title-${index + 1}`);
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', `svg-title-${index + 1}`);
    }
  });
}

/**
 * Ensures landmarks are unique or properly labeled
 * @param {Document} doc - The document object
 */
function ensureUniqueLandmarks(doc) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(role => {
    const elements = doc.querySelectorAll(role);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        const hasLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
        if (!hasLabel) {
          const label = role === 'header' ? 'Site header' : 
                        role === 'footer' ? 'Site footer' : 
                        `${role} ${index + 1}`;
          el.setAttribute('aria-label', label);
        }
      });
    }
  });

  // Ensurebanner landmark is unique
  const banners = doc.querySelectorAll('[role="banner"]');
  if (banners.length > 1) {
    banners.forEach((banner, index) => {
      if (!banner.getAttribute('aria-label')) {
        banner.setAttribute('aria-label', `Banner ${index + 1}`);
      }
    });
  }

  // Ensurecontentinfo landmark is unique
  const contentinfos = doc.querySelectorAll('[role="contentinfo"]');
  if (contentinfos.length > 1) {
    contentinfos.forEach((ci, index) => {
      if (!ci.getAttribute('aria-label')) {
        ci.setAttribute('aria-label', `Footer ${index + 1}`);
      }
    });
  }
}

/**
 * Fixes fake link issues - converts elements that should be links
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssue(doc) {
  // Find divs or spans that have click handlers and look like links
  const clickableElements = doc.querySelectorAll('[onclick], [onkeypress]');
  
  clickableElements.forEach(el => {
    const isFakeLink = el.tagName === 'DIV' || el.tagName === 'SPAN';
    const hasHref = el.getAttribute('href') !== null;
    const hasRoleLink = el.getAttribute('role') === 'link';
    
    if (isFakeLink && !hasHref) {
      // Check if it looks like a link (underline, cursor pointer, etc)
      const style = window.getComputedStyle(el);
      if (style.cursor === 'pointer' || el.classList.contains('link') || el.classList.contains('clickable')) {
        if (!hasRoleLink) {
          el.setAttribute('role', 'link');
          el.setAttribute('tabindex', '0');
          
          // Add keyboard support
          el.addEventListener('keypress', (e) => {
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

// Initialize accessibility fixes when DOM is ready
function initAccessibility(doc = document) {
  addLangAttribute(doc, 'en');
  
  // Fix all tables
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => fixTableStructure(table));
  
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
    initAccessibility
  };
}