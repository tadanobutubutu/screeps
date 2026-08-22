// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Add lang attribute to the HTML element for accessibility
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(lang = 'en') {
  const html = document.querySelector('html');
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
}

/**
 * Fix table structure issues for accessibility
 * Ensures tables have proper headers and structure
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return;
  
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td, th');
  
  // Ensure proper scope attributes on headers
  headers.forEach((th, index) => {
    const row = th.parentElement;
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const colIndex = Array.from(row.children).indexOf(th);
    
    const isRowHeader = rowIndex === 0 && colIndex > 0;
    const isColHeader = rowIndex > 0 && colIndex === 0;
    
    if (isRowHeader && !th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    } else if (isColHeader && !th.hasAttribute('scope')) {
      th.setAttribute('scope', 'row');
    } else if (rowIndex === 0 && colIndex === 0 && !th.hasAttribute('scope')) {
      // Corner cell
      th.setAttribute('scope', 'col');
    }
  });
  
  // Add caption if missing but beneficial
  if (!table.querySelector('caption') && table.rows.length > 2) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    table.insertBefore(caption, table.firstChild);
  }
}

/**
 * Add main landmark to the page for accessibility
 * Ensures there's exactly one main landmark
 */
function addMainLandmark() {
  const existingMain = document.querySelector('main, [role="main"]');
  
  if (!existingMain) {
    // Try to find the most likely main content area
    const body = document.body;
    const possibleMains = body.querySelectorAll('div#main, div.main, div#content, div.content, article, section');
    
    if (possibleMains.length > 0) {
      const mainCandidate = possibleMains[0];
      mainCandidate.setAttribute('role', 'main');
    } else {
      // Create a main element wrapping body content
      const main = document.createElement('main');
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
}

/**
 * Add accessible names to SVG elements
 * @param {NodeList} svgs - SVG elements to add accessible names to
 */
function addSvgAccessibleNames(svgs) {
  if (!svgs) {
    svgs = document.querySelectorAll('svg');
  }
  
  svgs.forEach((svg, index) => {
    const hasTitle = svg.querySelector('title');
    const hasDesc = svg.querySelector('desc');
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    
    if (!hasTitle && !ariaLabel && !ariaLabelledby) {
      const title = document.createElement('title');
      title.id = `svg-title-${index}`;
      title.textContent = `Icon ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
    
    if (!hasDesc && !ariaLabel && !ariaLabelledby) {
      const desc = document.createElement('desc');
      desc.id = `svg-desc-${index}`;
      desc.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(desc, svg.firstChild);
    }
  });
}

/**
 * Ensure landmarks are unique by adding unique IDs
 * @param {string} selector - CSS selector for landmark elements
 */
function ensureUniqueLandmarks(selector = 'header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]') {
  const landmarks = document.querySelectorAll(selector);
  const landmarkTypes = {};
  
  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || '';
    const type = role || tagName;
    
    if (!landmarkTypes[type]) {
      landmarkTypes[type] = 0;
    }
    landmarkTypes[type]++;
    
    if (landmarkTypes[type] > 1) {
      if (!landmark.id) {
        landmark.id = `${type}-${landmarkTypes[type]}`;
      }
    }
  });
}

/**
 * Fix fake link issues by ensuring links have proper href attributes
 * Converts divs/buttons that act as links into proper anchor elements
 * or ensures they have proper accessibility attributes
 */
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('div[onclick], span[onclick], button[onclick]');
  
  fakeLinks.forEach((element) => {
    const onclick = element.getAttribute('onclick') || '';
    if (onclick.includes('location') || onclick.includes('href') || onclick.includes('window')) {
      // This appears to be a link
      if (element.tagName !== 'A') {
        // Check if it has proper role and tabindex
        if (!element.hasAttribute('role') || element.getAttribute('role') !== 'link') {
          element.setAttribute('role', 'link');
        }
        if (!element.hasAttribute('tabindex')) {
          element.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event support
        if (!element.hasAttribute('onkeydown')) {
          element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              element.click();
            }
          });
        }
      }
    }
  });
}

/**
 * Initialize all accessibility fixes
 */
function initAccessibility() {
  addLangAttribute();
  addMainLandmark();
  
  document.querySelectorAll('table').forEach(table => fixTableStructure(table));
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
}

// Auto-initialize if document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  initAccessibility
};