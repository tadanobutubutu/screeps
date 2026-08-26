// Assuming there's a div with id 'my-div' and a button with id 'my-button'
const myDiv = document.getElementById('my-div');
const myButton = document.getElementById('my-button');

// To hide it from screen readers
myDiv.setAttribute('aria-hidden', true);
myButton.setAttribute('aria-label', 'A Button with special purpose');

// Export imported values (if needed)
export { class1, function1, Object1, calculateSum }; // Placeholder: Replace with actual existing code + added exports

// Function to count dependencies
export function countDependencies() {
  // Count the number of dependencies imported from modules
  const dependencies = ['class1', 'function1', 'Object1', 'calculateSum'];
  return dependencies.length;
}

// Function to add lang attribute to HTML element
export function getLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.lang = lang;
  }
  return document;
}

// Function to fix table structure issues
export function validateTableAccessibility() {
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
      thead.appendChild(firstRow.cloneNode(true));
      firstRow.remove();
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }

    if (!existingTbody) {
      const remainingRows = rows.length > 1 ? Array.from(rows).slice(1) : [];
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
      const cells = row.querySelectorAll('th, td');
      // Check if first cell should be a header
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        if (firstCell.tagName !== 'TH') {
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.insertBefore(th, firstCell);
          firstCell.remove();
          fixedCount++;
        }
      }
    });

    // Additional HEAD logic: ensure scope on header cells
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (th.cellIndex === 0) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

// Function to add main landmark
export function addMainLandmark(document) {
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

// Function to ensure unique landmarks (combined HEAD and origin/main approaches)
export function ensureUniqueLandmarks(document) {
  const landmarkTypes = {
    'HEADER': 'header',
    'NAV': 'nav',
    'MAIN': 'main',
    'ASIDE': 'aside',
    'FOOTER': 'footer'
  };
  const usedLabels = {};
  let fixedCount = 0;

  Object.keys(landmarkTypes).forEach(tagName => {
    const landmarks = document.querySelectorAll(tagName.toLowerCase());
    landmarks.forEach((landmark, index) => {
      let existingLabel = landmark.getAttribute('aria-label');

      // Ensure uniqueness
      if (!existingLabel || usedLabels[tagName]) {
        let label = existingLabel || `${landmarkTypes[tagName]} - ${index + 1}`;

        if (usedLabels[tagName]) {
          let count = 2;
          while (usedLabels[tagName].has(label)) {
            label = `${landmarkTypes[tagName]} - ${count}`;
            count++;
          }
        }

        if (!usedLabels[tagName]) {
          usedLabels[tagName] = new Set();
        }
        usedLabels[tagName].add(label);

        landmark.setAttribute('aria-label', label);
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

// Function to add accessible name to SVGs
export function getSvgAccessibleName(svg) {
  let name = svg.getAttribute('data-name') || 'SVG icon';
  if (name) {
    const title = document.createElement('title');
    title.id = `svg-title-${svg.id || Math.random().toString(36).substr(2, 9)}`;
    title.textContent = name;

    // Insert title as first child
    if (svg.firstChild) {
      svg.insertBefore(title, svg.firstChild);
    } else {
      svg.appendChild(title);
    }
    return fixTitleId(title.id);
  }

  return null;
}

function fixTitleId(id) {
  return id;
}

// Function addressing new accessibility issue from the insight report
export function addressAccessibilityIssues(document) {
  addMainLandmark(document);
  ensureUniqueLandmarks(document);

  // Find and fix table structure issues
  validateTableAccessibility();

  const svgs = document.querySelectorAll('svg');
  let count = 0;

  svgs.forEach((svg, index) => {
    const accessibleName = getSvgAccessibleName(svg);

    if (accessibleName) {
      count++;
    }
  });

  // Additional new accessibility fixes can be added here
  return count;
}