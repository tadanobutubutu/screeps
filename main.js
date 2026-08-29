// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Function to add proper landmark regions to the page for accessibility
 * Landmark regions help assistive technologies navigate the page structure
 */
function addLandmarkRegions() {
  const landmarks = [
    { tag: 'header', role: 'banner', id: 'site-header' },
    { tag: 'nav', role: 'navigation', id: 'main-nav', ariaLabel: 'Main navigation' },
    { tag: 'main', role: 'main', id: 'main-content' },
    { tag: 'aside', role: 'complementary', id: 'sidebar' },
    { tag: 'footer', role: 'contentinfo', id: 'site-footer' }
  ];

  landmarks.forEach(landmark => {
    const element = document.createElement(landmark.tag);
    element.id = landmark.id;
    element.setAttribute('role', landmark.role);
    if (landmark.ariaLabel) {
      element.setAttribute('aria-label', landmark.ariaLabel);
    }
    document.body.appendChild(element);
  });
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// REACT_027: Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const cells = firstRow.querySelectorAll('th, td');
        cells.forEach(cell => {
          const newTh = document.createElement('th');
          newTh.textContent = cell.textContent;
          if (cell.hasAttribute('scope')) {
            newTh.setAttribute('scope', cell.getAttribute('scope'));
          } else {
            newTh.setAttribute('scope', 'col');
          }
          headerRow.appendChild(newTh);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!table.querySelector('tbody')) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const thead = table.querySelector('thead');
      const rowsAfterHeader = thead ? rows.slice(1) : rows;
      if (rowsAfterHeader.length > 0) {
        const tbody = document.createElement('tbody');
        rowsAfterHeader.forEach(row => {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
  });
}

// REACT_017: Add/fix 2 landmark issues
function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.id = 'main-content';
    const existingContent = document.body.querySelector(':not(script):not(style)');
    if (existingContent) {
      document.body.insertBefore(mainElement, existingContent);
    } else {
      document.body.appendChild(mainElement);
    }
  } else {
    if (!mainElement.id) {
      mainElement.id = 'main-content';
    }
    if (!mainElement.hasAttribute('role') || mainElement.getAttribute('role') !== 'main') {
      mainElement.setAttribute('role', 'main');
    }
  }
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      let isFirst = true;
      elements.forEach(element => {
        if (isFirst) {
          isFirst = false;
        } else {
          element.removeAttribute('role');
        }
      });
    }
  });
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (title) {
      const titleId = `svg-title-${index}-${Date.now()}`;
      title.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    } else {
      const fallbackId = `svg-fallback-${index}-${Date.now()}`;
      const newTitle = document.createElement('title');
      newTitle.id = fallbackId;
      newTitle.textContent = `SVG image ${index + 1}`;
      svg.insertBefore(newTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', fallbackId);
    }
  });
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinkIssue() {
  const anchors = document.querySelectorAll('a');
  anchors.forEach(anchor => {
    if (!anchor.href || anchor.href === '#' || anchor.href === 'javascript:void(0)' || anchor.href === 'javascript:;') {
      if (!anchor.hasAttribute('onclick')) {
        const text = anchor.textContent.trim();
        const button = document.createElement('button');
        button.textContent = text;
        Array.from(anchor.attributes).forEach(attr => {
          if (attr.name !== 'href' && attr.name !== 'onclick') {
            button.setAttribute(attr.name, attr.value);
          }
        });
        anchor.parentNode.replaceChild(button, anchor);
      }
    }
  });
}

module.exports = { addLandmarkRegions, addLangAttribute, fixTableStructure, addMainLandmark, ensureUniqueLandmarks, addSvgAccessibleNames, fixFakeLinkIssue };