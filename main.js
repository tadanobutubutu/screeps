const { add } = require('./math/add');
const { subtract } = require('./math/subtract');
const { multiply } = require('./math/multiply');
const { divide } = require('./math/divide');
const { power } = require('./math/power');
const { squareRoot } = require('./math/squareRoot');
const { factorial } = require('./math/factorial');
const { fibonacci } = require('./math/fibonacci');
const { sum } = require('./math/sum');
const { average } = require('./math/average');
const { max } = require('./math/max');
const { min } = require('./math/min');
const { mode } = require('./math/mode');
const { median } = require('./math/median');

import { class1, function1, Object1 } from './path/to/module';

// New functions for rendering graph/index
const newFunction1 = () => { /* ... */ };
const newFunction2 = () => { /* ... */ };

// Function to add lang attribute to HTML element
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
    const rows = Array.from(table.querySelectorAll('tr'));
    
    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }
    
    if (!existingTbody) {
      const remainingRows = rows.length > 0 ? rows.slice(1) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        fixedCount++;
      }
    }
    
    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td');
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
    const main = document.createElement('main');
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
function uniqueLandmarks(document) {
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
      let index = 1;
      elements.forEach((element) => {
        if (index > 1) {
          const currentLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
          if (!currentLabel) {
            element.setAttribute('aria-label', `${name}-${index}`);
          }
        }
        index++;
      });
    }
  });
}

// Function to render graph/index using newFunction1 and newFunction2
// TODO: Update the existing function using the new functions for rendering graph/index
function renderGraphIndex(container, options = {}) {
  const {
    type = 'default',
    data = [],
    width = 600,
    height = 400,
    useNewFunctions = true
  } = options;

  // Use newFunction1 and newFunction2 for rendering
  if (useNewFunctions) {
    const preparedData = newFunction1(data);
    const formattedOutput = newFunction2(preparedData);
    
    // Create container element
    const graphContainer = document.createElement('div');
    graphContainer.className = 'graph-index-container';
    graphContainer.style.width = `${width}px`;
    graphContainer.style.height = `${height}px`;
    
    // Add formatted output to container
    if (formattedOutput) {
      const outputElement = document.createElement('div');
      outputElement.className = 'graph-output';
      outputElement.innerHTML = formattedOutput;
      graphContainer.appendChild(outputElement);
    }
    
    // Append to provided container
    if (container) {
      container.appendChild(graphContainer);
    }
    
    return graphContainer;
  }
  
  // Fallback to basic rendering if new functions not enabled
  const basicContainer = document.createElement('div');
  basicContainer.className = 'basic-graph-container';
  basicContainer.innerHTML = '<p>Basic graph rendering</p>';
  
  if (container) {
    container.appendChild(basicContainer);
  }
  
  return basicContainer;
}

// Function to render index page
function renderIndex(container, options = {}) {
  const {
    title = 'Index',
    items = [],
    useNewFunctions = true
  } = options;

  if (useNewFunctions) {
    // Use newFunction1 for preparing index data
    const preparedItems = newFunction1(items);
    // Use newFunction2 for formatting index output
    const formattedItems = newFunction2(preparedItems);
    
    const indexContainer = document.createElement('div');
    indexContainer.className = 'index-container';
    indexContainer.innerHTML = `
      <h1>${title}</h1>
      <div class="index-items">${formattedItems || ''}</div>
    `;
    
    if (container) {
      container.appendChild(indexContainer);
    }
    
    return indexContainer;
  }
  
  // Fallback
  const basicIndex = document.createElement('div');
  basicIndex.innerHTML = `<h1>${title}</h1>`;
  
  if (container) {
    container.appendChild(basicIndex);
  }
  
  return basicIndex;
}

module.exports = {
    add, subtract, multiply, divide, power, squareRoot, factorial, fibonacci, sum, average, max, min, mode, median,
    newFunction1, newFunction2,
    addLangAttribute, fixTableStructure, addMainLandmark, uniqueLandmarks,
    renderGraphIndex, renderIndex
};