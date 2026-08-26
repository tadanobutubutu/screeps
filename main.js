// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.

import { class1, function1, Object1 } from './path/to/module';
import { dependencyGraphContent } from './content/dependencyGraphContent';
import { indexContent } from './content/indexContent';

// Export imported values (if needed)
export { class1, function1, Object1 };

// Function to count dependencies
export function countDependencies() {
  // Get all import statements from the module
  const importRegex = /import\s+{[^}]*}/g;
  const moduleCode = __filename;
  
  // Read the current file and count named imports
  const fs = require('fs');
  const content = fs.readFileSync(moduleCode, 'utf-8');
  
  // Match import statements with named imports ( {...} )
  const importMatches = content.match(importRegex) || [];
  
  let count = 0;
  importMatches.forEach(match => {
    // Extract the content inside the braces
    const braceMatch = match.match(/\{([^}]+)\}/);
    if (braceMatch) {
      const imports = braceMatch[1];
      // Split by comma and filter out whitespace, count remaining imports
      const importList = imports.split(',').map(s => s.trim()).filter(s => s && !s.startsWith('type '));
      count += importList.length;
    }
  });
  
  return count;
}

/**
 * Processes data according to the issue requirements
 * @param {Array} data - The input data to process
 * @returns {Object} The processed result
 */
function processData(data) {
  if (!Array.isArray(data)) {
    return { error: 'Input must be an array' };
  }

  return {
    count: data.length,
    items: data,
    timestamp: Date.now(),
    operations: {
      add: (a, b) => a + b,
      subtract: (a, b) => a - b
    }
  };
}

const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

// Function to render dependency graphs
export function renderDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }
  
  // Use dependencyGraphContent to render the graph
  const graphHtml = dependencyGraphContent();
  container.innerHTML = graphHtml;
  
  // Apply accessibility improvements to the rendered graph
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = document.createElement('title');
      title.textContent = `Dependency graph ${index + 1}`;
      title.id = `graph-title-${index + 1}`;
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
  
  return container;
}

// Function to render index view
export function renderIndexView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }
  
  // Use indexContent to render the index view
  const indexHtml = indexContent();
  container.innerHTML = indexHtml;
  
  // Ensure proper landmark structure for accessibility
  const existingMain = container.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    mainElement.setAttribute('role', 'main');
    
    // Move all children into main
    while (container.firstChild) {
      if (container.firstChild.tagName !== 'SCRIPT' && 
          container.firstChild.tagName !== 'STYLE' &&
          container.firstChild.tagName !== 'LINK') {
        mainElement.appendChild(container.firstChild);
      } else {
        container.removeChild(container.firstChild);
      }
    }
    
    container.appendChild(mainElement);
  }
  
  return container;
}

// Function to add lang attribute to HTML element
export function setLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

// Function to fix table structure issues
export function fixTableStructure() {
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
      const remainingRows = rows.length > 1 ? rows.slice(1) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        tbody.appendChild(...remainingRows);
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    // Ensure proper header cells (th) are used
    const allRows = [...table.querySelectorAll('tr')];
    allRows.forEach(row => {
      const cells = [...row.querySelectorAll('td')];
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
    const headerCells = [...table.querySelectorAll('th')];
    headerCells.forEach(th => {
      if (th.getAttribute('scope') !== 'col') {
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
    const children = [...body.childNodes];
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

// Function to ensure unique landmarks (origin/main approach)
export function ensureUniqueLandmarks() {
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  const usedLabels = {};

  landmarkTypes.forEach(type => {
    const landmarks = [...document.querySelectorAll(type)];
    landmarks.forEach((landmark, index) => {
      const existingLabel = landmark.getAttribute('id') || landmark.getAttribute('aria-label') ||
                           landmark.getAttribute('aria-labelledby') || '';
      const label = existingLabel || `${type}-${index + 1}`;

      if (landmarks.length > 1) {
        let labelSuffix = '';

        // Ensure uniqueness
        if (usedLabels[type] && usedLabels[type].has(label)) {
          labelSuffix = `${index + 1}`;
        }

        if (!usedLabels[type]) {
          usedLabels[type] = new Set();
        }
        usedLabels[type].add(label);

        if (labelSuffix) {
          label = `${type}-${index + 1}`;
        }

        landmark.setAttribute('id', label);
      }
    });
  });
}

// Function to add accessible name to SVGs
export function addAccessibleNameToSVGs() {
  const svgs = [...document.querySelectorAll('svg')];
  let count = 0;

  svgs.forEach((svg, index) => {
    const hasAccessibleName = svg.getAttribute('aria-label') ||
                              svg.getAttribute('aria-labelledby') ||
                              svg.querySelector('title');
    if (!hasAccessibleName) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${index + 1}`;
      title.id = `svg-title-${index + 1}`;

      // Insert title as first child
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }

      svg.setAttribute('aria-labelledby', title.id);
      count++;
    }
  });

  return count;
}

// Function addressing new accessibility issue from the insight report
function addressAccessibilityIssues(document) {
  // Apply all accessibility fixes
  fixTableStructure();
  ensureUniqueLandmarks();
  addAccessibleNameToSVGs();
  // Additional new accessibility fixes can be added here
}

// Export new functions
export { addressAccessibilityIssues, renderDependencyGraph, renderIndexView };

// Export data processing functions
export { processData, multiply, divide };

module.exports = {
  processData,
  add: processData.operations.add,
  subtract: processData.operations.subtract,
  multiply,
  divide
};