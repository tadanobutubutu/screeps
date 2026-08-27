import { class1, function1, Object1 } from './path/to/module';

// Function to add lang attribute to HTML element
function addLangAttribute(document, selector = 'html') {
  const htmlElement = document.querySelector(selector);
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
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
      const remainingRows = table.querySelectorAll('tr');
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
      // Check if first cell should be a header
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = document.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        row.replaceChild(th, firstCell);
        fixedCount++;
      }
    });

    // Additional HEAD logic: ensure scope on header cells
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    // Find the main content area and wrap it or create main element
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');

    // Move first significant content child to main
    const children = Array.from(body.children);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' &&
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }

    body.insertBefore(main, body.firstChild);
    mainElement = main;
  }

  // Ensure main has proper role if not using native element
  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }

  return mainElement;
}

// Function to ensure unique landmarks (approach combining both methods)
function ensureUniqueLandmarks(document) {
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  const usedLabels = {};

  landmarkTypes.forEach(type => {
    const landmarks = document.querySelectorAll(type);
    landmarks.forEach((landmark, index) => {
      const existingLabel = landmark.getAttribute('aria-label') ||
                           landmark.getAttribute('aria-labelledby');

      if (landmarks.length > 1) {
        let label = existingLabel || `${type}-${index + 1}`;

        // Ensure uniqueness
        if (usedLabels[type] && usedLabels[type].has(label)) {
          label = `${type}-${index + 1}`;
        }

        if (!usedLabels[type]) {
          usedLabels[type] = new Set();
        }
        usedLabels[type].add(label);

        landmark.setAttribute('aria-label', label);
      }
    });
  });

  // Ensure unique landmarks (origin/main approach)
  function uniqueLandmarksOrig(document) {
    const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
    const usedLabels = {};

    landmarkTypes.forEach(type => {
      const landmarks = document.querySelectorAll(type);
      landmarks.forEach((landmark, index) => {
        let label = landmark.getAttribute('aria-label') || `landmark-${type}-${index}`;

        // Ensure uniqueness
        if (usedLabels[type] && usedLabels[type].includes(label)) {
          label = `landmark-${type}-${++index}`;
        }

        if (!usedLabels[type]) {
          usedLabels[type] = [];
        }
        usedLabels[type].push(label);

        landmark.setAttribute('aria-label', label);
      });
    });
  }

  uniqueLandmarksOrig(document);
}

// Export all functions
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  object1,
  function1,
  class1  // Add function1 and class1 back
};