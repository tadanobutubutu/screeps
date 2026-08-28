// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to the HTML element for accessibility
 * Addresses REACT_015
 */
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Fixes table structure issues for accessibility
 * Addresses REACT_027 - ensures proper table markup with headers
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    const hasHeaders = headers.length > 0;
    
    if (hasHeaders) {
      const headerCells = table.querySelectorAll('th');
      headerCells.forEach(th => {
        th.setAttribute('scope', 'col');
      });
      
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        const firstCell = row.querySelector('th, td');
        if (firstCell && firstCell.tagName === 'TH') {
          firstCell.setAttribute('scope', 'row');
        }
      });
    }
  });
}

/**
 * Adds main landmark to the page for accessibility
 * Addresses REACT_017
 */
function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const existingMain = document.querySelector('[role="main"]');
    if (existingMain) {
      existingMain.setAttribute('role', 'main');
    } else {
      const body = document.body;
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.insertBefore(main, body.firstChild);
    }
  }
  
  // Ensure only one main landmark
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].removeAttribute('role');
      mains[i].removeAttribute('aria-label');
    }
  }
}

/**
 * Adds accessible names to SVG elements
 * Addresses REACT_041
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = `svg-title-${index}`;
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', `SVG image ${index + 1}`);
      }
    }
  });
}

/**
 * Ensures unique landmarks on the page
 * Addresses REACT_025
 */
function ensureUniqueLandmarks() {
  const landmarkSelectors = [
    'header:not([role])',
    'nav',
    'main',
    'aside',
    'footer:not([role])',
    '[role="banner"]',
    '[role="navigation"]',
    '[role="main"]',
    '[role="complementary"]',
    '[role="contentinfo"]'
  ];
  
  const seen = {};
  
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      const tag = el.tagName.toLowerCase();
      if (!seen[tag]) {
        seen[tag] = 0;
      }
      seen[tag]++;
      
      if (seen[tag] > 1) {
        // Add aria-label to differentiate duplicate landmarks
        const landmarkName = el.getAttribute('aria-label') || tag;
        el.setAttribute('aria-label', `${landmarkName} ${seen[tag]}`);
      }
    });
  });
}

/**
 * Fixes fake link issues - converts non-link elements that behave like links
 * Addresses REACT_036
 */
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"], a[href="#"], span[onclick], div[onclick]');
  
  fakeLinks.forEach(element => {
    // If it's a span or div with onclick that looks like a link
    if ((element.tagName === 'SPAN' || element.tagName === 'DIV') && element.getAttribute('onclick')) {
      const isClickable = window.getComputedStyle(element).cursor === 'pointer' || 
                          element.getAttribute('role') === 'link';
      
      if (isClickable) {
        element.setAttribute('role', 'link');
        element.setAttribute('tabindex', '0');
        
        // Add keyboard event handling if not present
        if (!element.hasAttribute('onkeypress')) {
          const existingOnClick = element.getAttribute('onclick');
          element.setAttribute('data-original-onclick', existingOnClick);
          
          element.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const fn = new Function('return ' + this.getAttribute('data-original-onclick'));
              fn.call(this);
            }
          });
        }
      }
    }
  });
}

/**
 * Initialize accessibility improvements
 */
function initAccessibility() {
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
}

// Run accessibility improvements when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
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