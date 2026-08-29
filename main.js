// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute
// REACT_025: Add other accessibility changes as per the insight report
// [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

import { class1, function1, Object1 } from './path/to/module';

// Function to add lang attribute
function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = lang;
  }
  return document;
}

// Function to fix table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }

    if (!existingTbody) {
      const remainingRows = rows.length > 0 ? Array.from(rows).slice(0) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length > 0) {
        // If first cell should be a header
        if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
          const firstCell = cells[0];
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.insertBefore(th, firstCell);
        }
      }
    });
  });

  return fixedCount;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = null;

  if (!mainElement) {
    // Find the main content area and wrap it or create main element
    const body = document.body;
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('id', 'main-content');
    }

    // Move first significant content child to main
    const children = body.children;
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' &&
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }

    // Ensure main has proper role if not using native element
    if (mainElement && mainElement.tagName !== 'MAIN') {
      mainElement.setAttribute('role', 'main');
    }

    mainElement = main;
  }

  return mainElement;
}

// Function to ensure unique landmarks (combined approach)
function uniqueLandmarkRegions(document) {
  // Combined approach using both role-based and element-based selection
  const landmarkSelectors = [
    { selector: '[role="navigation"]', name: 'navigation' },
    { selector: '[role="banner"]', name: 'banner' },
    { selector: '[role="contentinfo"]', name: 'contentinfo' },
    { selector: '[role="complementary"]', name: 'complementary' },
    { selector: 'main, [role="main"]', name: 'main' },
    { selector: '[role="region"]', name: 'region' },
    { selector: '[role="article"]', name: 'article' },
    { selector: 'nav', name: 'navigation' },
    { selector: 'header:not([role])', name: 'banner' },
    { selector: 'footer:not([role])', name: 'contentinfo' },
    { selector: 'aside', name: 'complementary' }
  ];

  landmarkSelectors.forEach(({ selector, name }) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        element.setAttribute('aria-label', `${name}-${index + 1}`);
      });
    }
  });
}

// Add unique landmark regions after ensuring unique landmarks
addMainLandmark(document);
uniqueLandmarkRegions(document);

export { class1, function1, Object1 };