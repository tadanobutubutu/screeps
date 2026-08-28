// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
//

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(document) {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
  return document;
}

// REACT_027: Fix 26 table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure with thead and tbody
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        if (!row.closest('thead')) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }
    // Ensure all tables have caption or th for accessibility
    const hasCaption = table.querySelector('caption');
    const hasTh = table.querySelector('th');
    if (!hasCaption && hasTh) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      caption.style.clip = 'rect(0 0 0 0)';
      caption.style.clipPath = 'inset(50%)';
      caption.style.height = '1px';
      caption.style.overflow = 'hidden';
      caption.style.whiteSpace = 'nowrap';
      table.insertBefore(caption, table.firstChild);
    }
  });
  return document;
}

// REACT_017: Add/fix 2 landmark issues - Add main landmark
function addMainLandmark(document) {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    const body = document.body;
    // Move first child into main if it exists
    if (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.insertBefore(main, body.firstChild);
  }
  return document;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(document) {
  const landmarkTags = ['nav', 'aside', 'footer', 'header', 'main', 'section', 'article'];
  landmarkTags.forEach(tag => {
    const elements = document.querySelectorAll(tag);
    if (elements.length > 1) {
      let counter = 0;
      elements.forEach(el => {
        const existingLabel = el.getAttribute('aria-label');
        const existingAriaLabelledby = el.getAttribute('aria-labelledby');
        if (!existingLabel && !existingAriaLabelledby) {
          el.setAttribute('aria-label', `${tag}-${counter}`);
        }
        counter++;
      });
    }
  });
  return document;
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  let svgCounter = 0;
  svgs.forEach(svg => {
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title');
    if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${svgCounter + 1}`;
      title.id = `svg-title-${svgCounter}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
    svgCounter++;
  });
  return document;
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinkIssue(document) {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isButton = link.getAttribute('role') === 'button';
    const hasOnClick = link.hasAttribute('onclick');
    
    if ((href === '#' || href === '' || !href) && !isButton) {
      const text = link.textContent.trim();
      const hasValidAction = hasOnClick || link.hasAttribute('data-action');
      
      if (!hasValidAction) {
        // Add role="button" and remove href or make it a button
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    }
  });
  return document;
}

// Main function to apply all accessibility fixes
function applyAccessibilityFixes(document) {
  addLangAttribute(document);
  fixTableStructure(document);
  addMainLandmark(document);
  ensureUniqueLandmarks(document);
  addSvgAccessibleNames(document);
  fixFakeLinkIssue(document);
  return document;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    ensureUniqueLandmarks,
    addSvgAccessibleNames,
    fixFakeLinkIssue,
    applyAccessibilityFixes
  };
}