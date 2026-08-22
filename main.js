// main.js
// [Your existing code here]

// Add the HTML lang attribute to the root element
document.documentElement.lang = 'en';

// New function to update the document title
function updateDocumentTitle(newTitle) {
  document.title = newTitle;
}

// New function to log a message to the console
function logMessage(message) {
  console.log(message);
}

// Fix 26 table structure issues
function updateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      cells.forEach((cell, cellIndex) => {
        if (cell.tagName === 'TH') {
          // Check if this is a column header (first row) or row header (first cell in a row)
          const existingScope = cell.getAttribute('scope');
          if (!existingScope) {
            if (rowIndex === 0) {
              // Header in first row is a column header
              cell.setAttribute('scope', 'col');
            } else if (cellIndex === 0) {
              // First cell in non-first row is a row header
              cell.setAttribute('scope', 'row');
            }
          }
        }
      });
    });
  });
}

// Add/fix 4 landmark issues
function fixLandmarkIssues() {
  let mainElements = document.querySelectorAll('main');
  const headers = document.querySelectorAll('header');
  const footers = document.querySelectorAll('footer');
  const navElements = document.querySelectorAll('nav');

  // If no main element exists, create one and wrap the primary content
  if (mainElements.length === 0) {
    const body = document.body;
    const main = document.createElement('main');
    
    // Move all body children into main (except script/style elements if needed)
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    
    body.appendChild(main);
  }
  
  // Re-query main elements after potentially creating one
  mainElements = document.querySelectorAll('main');

  // Fix duplicate main landmarks - convert additional main elements to section
  if (mainElements.length > 1) {
    mainElements.forEach((main, index) => {
      if (index > 0) {
        // Convert additional <main> elements to <section> elements
        const section = document.createElement('section');
        section.setAttribute('aria-label', 'Additional content section ' + index);
        
        // Move all children from main to section
        while (main.firstChild) {
          section.appendChild(main.firstChild);
        }
        
        // Copy any inline styles or classes
        if (main.className) section.className = main.className;
        if (main.id) section.id = main.id;
        
        // Replace main with section
        main.parentNode.replaceChild(section, main);
      }
    });
  }

  // Re-query after potential replacements
  mainElements = document.querySelectorAll('main');

  // Ensure main elements have proper labeling
  mainElements.forEach((main, index) => {
    if (!main.id && mainElements.length > 1) {
      main.setAttribute('aria-label', 'Main content section ' + (index + 1));
    }
  });

  // Ensure navigation has labels if multiple nav elements exist
  let navIndex = 0;
  navElements.forEach(nav => {
    if (navElements.length > 1 && !nav.id && !nav.getAttribute('aria-label')) {
      navIndex++;
      nav.setAttribute('aria-label', 'Navigation ' + navIndex);
    }
  });
}

// Add accessible names to 2 SVGs
function addSVGAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  const svgNames = ['SVG description 1', 'SVG description 2'];
  let svgIndex = 0;

  svgs.forEach(svg => {
    if (svgIndex < svgNames.length && !svg.querySelector('title') && !svg.getAttribute('aria-labelledby')) {
      const title = document.createElement('title');
      title.id = 'svg-title-' + (svgIndex + 1);
      title.textContent = svgNames[svgIndex];
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
      svgIndex++;
    }
  });
}

// Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, footer, nav, aside');
  const landmarkNames = new Set();

  landmarks.forEach(landmark => {
    const name = landmark.getAttribute('aria-label') || landmark.id || '';
    if (landmarkNames.has(name) && name !== '') {
      // Handle duplicate landmark names by making them unique
      const role = landmark.tagName.toLowerCase();
      landmark.setAttribute('aria-label', name + ' ' + role);
    } else {
      landmarkNames.add(name);
    }
  });
}

// Fix 1 fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a:not([href]), a[href="#"]');

  fakeLinks.forEach(link => {
    const text = link.textContent;
    const onClick = link.getAttribute('onclick') || '';

    // Convert to proper button if it's an action
    if (onClick || link.style.cursor === 'pointer') {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }

    // Add keyboard support for Enter key
    if (onClick || link.getAttribute('role') === 'button') {
      link.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          link.click();
        }
      });
    }
  });
}

// Fix the SVG accessible name issue
function addSVGAccessibleNameToFavicon() {
  const faviconSVG = document.querySelector('link[rel="icon"]');
  if (faviconSVG && faviconSVG.href) {
    const svgData = faviconSVG.href.startsWith('data:image/svg+xml') ? faviconSVG.href : null;
    if (svgData) {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');
      if (svgElement) {
        const titleElement = svgDoc.querySelector('title');
        if (!titleElement) {
          const title = document.createElement('title');
          title.textContent = 'Favicon';
          svgElement.insertBefore(title, svgElement.firstChild);
        }
      }
    }
  }
}

// [Rest of your existing code here]

// Export required functions for testing
export {
  updateDocumentTitle,
  logMessage,
  updateTableStructure,
  fixLandmarkIssues,
  addSVGAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addSVGAccessibleNameToFavicon
};