// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} lang - Language code (default: 'en')
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Fixes table structure issues for accessibility
 * Ensures tables have proper headers and structure
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure tables have caption or title
    if (!table.querySelector('caption') && table.getAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label');
      table.insertBefore(caption, table.firstChild);
    }
    
    // Ensure proper th elements for headers
    const firstRow = table.querySelector('tbody tr, thead tr');
    if (firstRow) {
      const cells = firstRow.querySelectorAll('td');
      cells.forEach((cell) => {
        if (!cell.querySelector('th') && !cell.closest('thead')) {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          cell.replaceWith(th);
        }
      });
    }
  });
}

/**
 * Adds main landmark to the page
 */
function addMainLandmark() {
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    // Find the main content area and wrap it with main element
    const content = document.querySelector('#content, .content, [role="main"]');
    if (content && content.tagName !== 'MAIN') {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      content.parentNode.insertBefore(main, content);
      main.appendChild(content);
    }
  } else {
    mainElement.setAttribute('role', 'main');
  }
}

/**
 * Adds accessible names to SVG elements
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  let svgIndex = 0;
  svgs.forEach((svg) => {
    if (!svg.querySelector('title') && !svg.getAttribute('role') && svg.getAttribute('aria-label')) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${svgIndex + 1}`;
      title.id = `svg-title-${svgIndex + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', title.id);
    }
    svgIndex++;
  });
}

/**
 * Ensures unique landmarks by removing duplicate navigation and banner landmarks
 */
function ensureUniqueLandmarks() {
  // Remove duplicate navigation elements
  const navElements = document.querySelectorAll('nav');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (index > 0) {
        const ariaLabel = nav.getAttribute('aria-label');
        if (ariaLabel) {
          nav.setAttribute('aria-label', `${ariaLabel} ${index + 1}`);
        } else {
          nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        }
      }
    });
  }
  
  // Ensure only one banner/header landmark
  const headers = document.querySelectorAll('header, [role="banner"]');
  if (headers.length > 1) {
    headers.forEach((header, index) => {
      if (index > 0) {
        header.removeAttribute('role');
        header.setAttribute('role', 'complementary');
      }
    });
  }
}

/**
 * Fixes fake link issues by making elements with onclick but no href proper links
 */
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach((element) => {
    if (element.tagName === 'A' && !element.getAttribute('href')) {
      element.setAttribute('role', 'link');
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    }
  });
}

/**
 * Initialize accessibility fixes
 */
function initAccessibility() {
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
}

// Export functions for testing
module.exports = {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  initAccessibility
};

// Auto-initialize if in browser environment
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}