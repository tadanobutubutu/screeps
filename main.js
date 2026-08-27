// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.

const { dependencyGraphContent } = require('./modules/dependencyGraph.js');
const { indexContent } = require('./modules/indexView.js');

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

function countDependencies() {
  const importRegex = /import\s+{[^}]*}/g;
  const moduleCode = __filename;
  
  const fs = require('fs');
  const content = fs.readFileSync(moduleCode, 'utf-8');
  
  const importMatches = content.match(importRegex) || [];
  
  let count = 0;
  importMatches.forEach(match => {
    const braceMatch = match.match(/\{([^}]+)\}/);
    if (braceMatch) {
      const imports = braceMatch[1];
      const importList = imports.split(',').map(s => s.trim()).filter(s => s && !s.startsWith('type '));
      count += importList.length;
    }
  });
  
  return count;
}

function renderDependencyGraph(containerId, dependencies) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }

  const graphHtml = dependencyGraphContent(dependencies);
  container.innerHTML = graphHtml;
  
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

function renderIndexView(containerId, files) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }

  const indexHtml = indexContent(files);
  container.innerHTML = indexHtml;
  
  const existingMain = container.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    mainElement.setAttribute('role', 'main');
    
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

function setLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
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

    const allRows = [...table.querySelectorAll('tr')];
    allRows.forEach(row => {
      const cells = [...row.querySelectorAll('td')];
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

function addMainLandmark(document) {
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');

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

  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }

  return mainElement;
}

function ensureUniqueLandmarks() {
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  const usedLabels = {};

  landmarkTypes.forEach(type => {
    const landmarks = [...document.querySelectorAll(type)];
    landmarks.forEach((landmark, index) => {
      const existingLabel = landmark.getAttribute('id') || landmark.getAttribute('aria-label') ||
                           landmark.getAttribute('aria-labelledby') || '';
      let label = existingLabel || `${type}-${index + 1}`;

      if (landmarks.length > 1) {
        let labelSuffix = '';

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

function addAccessibleNameToSVGs() {
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

function addressAccessibilityIssues(document) {
  fixTableStructure();
  ensureUniqueLandmarks();
  addAccessibleNameToSVGs();
}

function existingFunction() {
  // Existing function code
}

function newFunction() {
  // New function code
}

function initializeApp() {
  console.log('Application initialized');
}

function getAppVersion() {
  return '1.0.0';
}

function main() {
  console.log('Running main entry point');
}

module.exports = {
  processData,
  add: processData.operations.add || function (a, b) { return a + b },
  subtract: processData.operations.subtract || function (a, b) { return a - b },
  multiply,
  divide,
  countDependencies,
  renderDependencyGraph,
  renderIndexView,
  setLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addAccessibleNameToSVGs,
  addressAccessibilityIssues,
  existingFunction,
  newFunction,
  initializeApp,
  getAppVersion,
  main
};