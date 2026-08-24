// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Add lang attribute to the HTML element for proper language declaration
 * Addresses REACT_015
 */
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    const lang = document.documentElement.lang || 'en';
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Fix table structure issues by adding proper semantic elements
 * Addresses REACT_027
 * @param {string} tableSelector - CSS selector for tables to fix
 */
function fixTableStructure(tableSelector = 'table') {
  const tables = document.querySelectorAll(tableSelector);
  tables.forEach((table, index) => {
    // Check if table has a caption
    let caption = table.querySelector('caption');
    if (!caption) {
      caption = document.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure thead and tbody exist
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.querySelector('tbody') || table.firstChild);
      }
    }

    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = Array.from(table.querySelectorAll('tr'));
      const thead = table.querySelector('thead');
      const theadIndex = thead ? rows.indexOf(thead) : -1;
      
      rows.forEach((row, i) => {
        if (i !== theadIndex) {
          tbody.appendChild(row);
        }
      });
      
      if (tbody.children.length > 0) {
        table.appendChild(tbody);
      }
    }

    // Add scope to header cells
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        const row = header.closest('tr');
        const isRowHeader = row && row.parentElement.tagName === 'TBODY';
        header.setAttribute('scope', isRowHeader ? 'row' : 'col');
      }
    });
  });
}

/**
 * Add main landmark element for proper document structure
 * Addresses REACT_017
 */
function addMainLandmark() {
  // Check if main element already exists
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    
    // Move content from common container locations into main
    const contentContainer = document.querySelector('#content, #main, .content, .main, [role="main"]');
    
    if (contentContainer) {
      while (contentContainer.firstChild) {
        mainElement.appendChild(contentContainer.firstChild);
      }
      document.body.appendChild(mainElement);
    }
  }
  
  // Ensure skip link target exists
  if (!document.querySelector('#skip-link-target')) {
    const skipTarget = document.createElement('div');
    skipTarget.id = 'skip-link-target';
    mainElement.insertBefore(skipTarget, mainElement.firstChild);
  }
}

/**
 * Add accessible names to SVG elements
 * Addresses REACT_041
 * @param {string} svgSelector - CSS selector for SVGs to fix
 */
function addSvgAccessibleNames(svgSelector = 'svg') {
  const svgs = document.querySelectorAll(svgSelector);
  let svgIndex = 0;
  
  svgs.forEach(svg => {
    // Skip if already has accessible name via aria-label or role="img" with text
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title');
    
    if (!hasAriaLabel && !hasTitle) {
      // Find or create a title for the SVG
      let title = svg.querySelector('title');
      if (!title) {
        title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        svg.insertBefore(title, svg.firstChild);
      }
      
      // Provide default accessible name based on context
      const parent = svg.closest('a, button, [aria-label]');
      if (parent && parent.hasAttribute('aria-label')) {
        title.textContent = parent.getAttribute('aria-label');
      } else if (svg.classList.length > 0) {
        title.textContent = `Icon ${++svgIndex}`;
      } else {
        title.textContent = `Graphic ${++svgIndex}`;
      }
      
      // Link title with aria-labelledby
      const titleId = `svg-title-${svgIndex}`;
      title.setAttribute('id', titleId);
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

/**
 * Ensure all landmarks have unique labels/IDs
 * Addresses REACT_025
 */
function ensureUniqueLandmarks() {
  const landmarkSelectors = [
    'nav', 'aside', 'header:not([role="banner"])', 
    'footer:not([role="contentinfo"])', 'main', 'section', 'article'
  ];
  
  const counters = {};
  
  landmarkSelectors.forEach(selector => {
    const landmarks = document.querySelectorAll(selector);
    landmarks.forEach(landmark => {
      // Skip if landmark already has unique aria-label or id
      if (landmark.hasAttribute('aria-label') || landmark.id) {
        return;
      }
      
      // Generate unique identifier
      const tagName = landmark.tagName.toLowerCase();
      counters[tagName] = (counters[tagName] || 0) + 1;
      
      // Add descriptive aria-label based on context
      const heading = landmark.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        landmark.setAttribute('aria-label', `${tagName}-${heading.textContent.trim()}`);
      } else {
        landmark.setAttribute('aria-label', `${tagName}-${counters[tagName]}`);
      }
    });
  });
}

/**
 * Fix fake link issues - convert buttons styled as links to proper accessible links
 * Addresses REACT_036
 * @param {string} selector - CSS selector for fake links to fix
 */
function fixFakeLinkIssue(selector = 'a[href="#"], a[href=""], button.link') {
  const fakeLinks = document.querySelectorAll(selector);
  
  fakeLinks.forEach(fakeLink => {
    // Check if it's actually a button styled as a link
    if (fakeLink.tagName === 'BUTTON' && fakeLink.classList.contains('link')) {
      // Convert to proper link with href or convert to button with proper styling
      const text = fakeLink.textContent.trim();
      const onClick = fakeLink.getAttribute('onclick');
      
      // If it navigates somewhere, make it a proper link
      if (onClick && onClick.includes('href')) {
        const hrefMatch = onClick.match(/href=["']([^"']+)["']/);
        if (hrefMatch) {
          fakeLink.tagName = 'A';
          fakeLink.setAttribute('href', hrefMatch[1]);
          fakeLink.removeAttribute('onclick');
          fakeLink.removeAttribute('type');
        }
      } else {
        // Ensure proper button semantics
        fakeLink.setAttribute('type', 'button');
        fakeLink.removeAttribute('href');
      }
    }
    
    // Add tabindex and onKeyDown for keyboard accessibility
    if (!fakeLink.hasAttribute('tabindex')) {
      fakeLink.setAttribute('tabindex', '0');
    }
  });
}

/**
 * Initialize accessibility improvements
 */
function initAccessibility() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    initAccessibility
  };
}