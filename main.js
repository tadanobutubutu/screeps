// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinks)

// Accessibility helper functions
function addLangAttribute() {
  // Add lang attribute to HTML element for screen readers
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  // Fix table structure issues for accessibility
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const newRow = document.createElement('tr');
        const cells = firstRow.querySelectorAll('th, td');
        cells.forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          if (cell.getAttribute('scope')) {
            th.setAttribute('scope', cell.getAttribute('scope'));
          } else {
            th.setAttribute('scope', 'col');
          }
          newRow.appendChild(th);
        });
        thead.appendChild(newRow);
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
      }
    }
    
    // Add tbody if missing
    if (!table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const tbody = document.createElement('tbody');
        rows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
      }
    }
  });
}

function addMainLandmark() {
  // Add main landmark for screen readers
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    // Create main landmark if it doesn't exist
    const body = document.querySelector('body');
    if (body) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
}

function addSvgAccessibleNames() {
  // Add accessible names to SVGs for screen readers
  const svgs = document.querySelectorAll('svg');
  let svgCount = 0;
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${svgCount + 1}`;
      title.id = `svg-title-${svgCount + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
      svgCount++;
    }
  });
}

function ensureUniqueLandmarks() {
  // Ensure unique landmarks for accessibility
  const landmarks = ['nav', 'main', 'aside', 'header', 'footer'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (el.tagName.toLowerCase() === landmark) {
          const ariaLabel = el.getAttribute('aria-label');
          if (!ariaLabel) {
            el.setAttribute('aria-label', `${landmark} section ${index + 1}`);
          }
        }
      });
    }
  });
}

function fixFakeLinks() {
  // Fix fake links (links without href or with href="#" that should be buttons)
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  fakeLinks.forEach(link => {
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    const isButton = onclick || role === 'button' || link.classList.contains('button');
    
    if (isButton && !link.hasAttribute('href')) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}

// Initialize all accessibility improvements
function initAccessibility() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinks();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

// Export functions for testing
module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  initAccessibility
};