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
function addLangAttribute(document) {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    const lang = document.documentElement.lang || 'en';
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Fixes table structure issues for accessibility
 * Addresses REACT_027
 */
function fixTableStructureIssues(tables) {
  if (!tables) return;
  
  tables.forEach(table => {
    const hasHeader = table.querySelector('th');
    if (hasHeader) {
      table.setAttribute('role', 'table');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        cells.forEach(cell => {
          if (cell.tagName === 'TH') {
            cell.setAttribute('scope', 'col');
          }
        });
      });
    }
  });
}

/**
 * Adds main landmark to the document for accessibility
 * Addresses REACT_017
 */
function addMainLandmark(document) {
  const existingMain = document.querySelector('main, [role="main"]');
  
  if (!existingMain) {
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  }
}

/**
 * Adds accessible names to SVG elements
 * Addresses REACT_041
 */
function addSvgAccessibleNames(svgs) {
  if (!svgs) return;
  
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (!title) {
      const newTitle = document.createElement('title');
      newTitle.textContent = `SVG icon ${index + 1}`;
      svg.insertBefore(newTitle, svg.firstChild);
    }
    
    if (!svg.hasAttribute('aria-label') && !svg.getAttribute('role')) {
      const existingTitle = svg.querySelector('title');
      if (existingTitle) {
        svg.setAttribute('aria-label', existingTitle.textContent);
      }
    }
    
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

/**
 * Ensures unique landmarks in the document
 * Addresses REACT_025
 */
function ensureUniqueLandmarks(document) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          const ariaLabel = el.getAttribute('aria-label') || `${landmark}-${index + 1}`;
          el.setAttribute('aria-label', ariaLabel);
        }
      });
    }
  });
}

/**
 * Fixes fake link issues for accessibility
 * Addresses REACT_036
 */
function fixFakeLinkIssue(elements) {
  if (!elements) return;
  
  elements.forEach(el => {
    const href = el.getAttribute('href');
    const onclick = el.getAttribute('onclick');
    const role = el.getAttribute('role');
    
    if (!href && (onclick || role === 'link')) {
      el.setAttribute('role', 'link');
      
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
    }
  });
}

// Export all functions for testing
module.exports = {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue
};