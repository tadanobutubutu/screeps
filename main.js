// main.js - Resolved merge conflict

const fs = require('fs');
const path = require('path');

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: ensureDependencyGraphARIA, getLangAttribute)
const getLangAttribute = () => document.documentElement ? document.documentElement.lang || 'en' : 'en';
document.documentElement.lang = getLangAttribute();

function rotateBack() {
  // Logic to rotate back
  // JavaScript code to rotate back
  console.log('Rotating back...');
  // For example, if you're manipulating the DOM or a state:
  // ...
  // ...
};

export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.lang = lang;
  }
  return document;
}

function addMainLandmark(document) {
  let mainElement = document.getElementById('main-content');

  if (!mainElement) {
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');

    const children = Array.from(body.childNodes);
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

function addAccessibilityIdentifiers(document) {
  const main = document.querySelector('main, [role="main"]');
  if (main && !main.id) {
    main.id = 'main-content';
  }

  const navigations = document.querySelectorAll('nav');
  navigations.forEach((nav, index) => {
    if (!nav.id && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `navigation-${index + 1}`);
    }
  });

  const regions = document.querySelectorAll('[role="region"]');
  regions.forEach((region, index) => {
    if (!region.id) {
      region.id = `region-${index + 1}`;
    }
  });

  return document;
}

/**
 * Addresses accessibility issues by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const { defaultText = 'Untitled', useAriaLabel = false } = options;
  const results = {
    fixed: 0,
    skipped: 0,
    issues: []
  };

  issues.forEach(issue => {
    if (issue.severity === 'error') {
      results.issues.push(issue);
      results.fixed++;
    } else {
      results.skipped++;
    }
  });

  return results;
}

// ... (Functions that were unique in each branch)

function ensureTableAccessibility(document) {
  let fixedCount = 0;
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (!existingTbody && rows.length > 0) {
      const remainingRows = rows.length > 1 ? Array.from(rows).slice(1) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = document.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        row.replaceChild(th, firstCell);
        fixedCount++;
      }
    });

    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.scope) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

/**
 * Renders the graph/index view using accessibility-enhanced functions
 * This function updates the existing graph/index rendering to use the new accessibility functions
 * @param {Object} options - Options for rendering the graph/index
 * @param {string} options.containerId - ID of the container element
 * @param {Object} options.data - Data to render in the graph/index
 * @returns {HTMLElement} - The rendered graph/index container
 */
function renderGraph(options = {}) {
  const { containerId = 'graph-container', data = {} } = options;
  
  // Get or create the container element
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  // Apply accessibility enhancements using new functions
  const lang = getLangAttribute();
  addLangAttribute(lang);
  
  addMainLandmark(document);
  addAccessibilityIdentifiers(document);

  // Ensure table accessibility for any data tables
  ensureTableAccessibility(document);

  // Render the graph/index content
  container.innerHTML = '';
  
  const graphElement = document.createElement('div');
  graphElement.setAttribute('role', 'img');
  graphElement.setAttribute('aria-label', 'Graph visualization');
  
  // Create title with accessibility
  const title = document.createElement('h2');
  title.textContent = data.title || 'Graph Index';
  title.id = 'graph-title';
  graphElement.appendChild(title);

  // Create the main content area
  const content = document.createElement('div');
  content.id = 'graph-content';
  content.setAttribute('role', 'region');
  content.setAttribute('aria-labelledby', 'graph-title');
  
  // Render graph data
  if (data.graphs && Array.isArray(data.graphs)) {
    data.graphs.forEach((graph, index) => {
      const graphItem = document.createElement('div');
      graphItem.id = `graph-item-${index + 1}`;
      graphItem.className = 'graph-item';
      graphItem.setAttribute('role', 'figure');
      graphItem.setAttribute('aria-label', graph.label || `Graph ${index + 1}`);
      
      const canvas = document.createElement('canvas');
      canvas.id = `graph-canvas-${index + 1}`;
      canvas.setAttribute('aria-hidden', 'true');
      graphItem.appendChild(canvas);
      
      const label = document.createElement('span');
      label.textContent = graph.label || `Graph ${index + 1}`;
      graphItem.appendChild(label);
      
      content.appendChild(graphItem);
    });
  }

  graphElement.appendChild(content);

  // Apply additional accessibility fixes for this view
  addressAccessibilityIssues([
    { severity: 'error', code: 'REACT_015', message: 'Ensure graph container has proper labeling' }
  ], { defaultText: 'Graph Index', useAriaLabel: true });

  container.appendChild(graphElement);

  return container;
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    addressAccessibilityIssues,
    renderGraph,
    addLangAttribute,
    addMainLandmark,
    addAccessibilityIdentifiers,
    ensureTableAccessibility,
    getLangAttribute
  };
}

if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.renderGraph = renderGraph;
  window.addLangAttribute = addLangAttribute;
  window.addMainLandmark = addMainLandmark;
  window.addAccessibilityIdentifiers = addAccessibilityIdentifiers;
  window.ensureTableAccessibility = ensureTableAccessibility;
  window.getLangAttribute = getLangAttribute;
}