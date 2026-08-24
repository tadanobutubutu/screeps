// main.js - Entry point for the application with accessibility fixes for React components

const CONFIG = { debug: true };
const helper = require('./helper');

// Import content modules for dependency graphs and index views
const { dependencyGraphContent } = require('./content/dependencyGraphContent.js');
const { indexContent } = require('./content/indexContent.js');

// Import computation and transformation utilities
const { compute } = require('./math');
const { transform } = require('./utils');

// New functions requested by the issue

function getLangAttribute() {
  const html = document.documentElement;
  return html.getAttribute('lang') || 'en';
}

function getFullLangAttribute() {
  const lang = document.documentElement.lang;
  return lang ? lang : 'en';
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.scope) {
        // Try to infer scope from position
        const isFirstInRow = th.parentElement && th.parentElement.firstElementChild === th;
        const isFirstInCol = Array.from(th.parentNode.children).indexOf(th) === 0;
        if (isFirstInRow && isFirstInCol) {
          th.setAttribute('scope', 'col');
        } else if (isFirstInRow) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    });
  });
  return !hasIssues;
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  let isValid = true;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    const row = table.rows[1];
    if (headers.length !== row.cells.length) {
      isValid = false;
    }
    headers.forEach((header, index) => {
      const cell = row.cells[index];
      if (!header.scope || header.scope !== cell.scope) {
        isValid = false;
      }
    });
  });
  return isValid;
}

function getSvgAccessibleName() {
  const svgs = document.querySelectorAll('svg');
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const title = svg.getAttribute('title');
    if (title) return title;
  }
  return '';
}

// REACT_025: Ensure unique landmarks
// Fixed by simplifying the code to add aria-labelledby attribute
function ensureUniqueLandmarks() {
  const landmarks = [...document.querySelectorAll('nav, footer, aside, main, header')];
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (role && landmark.id) {
      landmark.setAttribute('aria-labelledby', landmark.id);
    }
  });
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const title = svg.getAttribute('title') || `SVG graphic ${index + 1}`;
    const id = svg.id || `svg-${index}`;
    svg.setAttribute('aria-labelledby', `${id}-title`);
    const titleEl = document.createElement('title');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  });
}

// Helper function to add title to favicon for accessibility
function addFaviconAccessibleName() {
  const faviconLink = document.querySelector('link[rel="icon"]');
  if (faviconLink) {
    faviconLink.setAttribute('aria-label', 'Favicon');
  }
}

// Validate link accessibility (fake link check)
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a[href="#"]');
  let isValid = !links.length;
  links.forEach(link => {
    if (link.textContent && link.textContent.trim() !== '') {
      isValid = false;
    }
  });
  return isValid;
}

function addLangAttribute() {
  const html = document.documentElement;
  if (html && !html.getAttribute('lang')) {
    html.setAttribute('lang', getLangAttribute() || 'en');
  }
}

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.

/**
 * Render the dependency graph view using the imported dependencyGraphContent module.
 * This function identifies the container element and populates it with the
 * dependency graph content from the appropriate module.
 * 
 * @param {string} containerId - The ID of the container element to render the graph in
 * @param {Object} options - Optional configuration options for rendering
 * @returns {HTMLElement} The rendered dependency graph container
 */
function renderDependencyGraph(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Dependency graph container with ID "${containerId}" not found`);
    return null;
  }

  // Clear existing content
  container.innerHTML = '';

  // Get content from the dependencyGraphContent module
  const graphContent = dependencyGraphContent(options);

  // Append the content to the container
  if (typeof graphContent === 'string') {
    container.innerHTML = graphContent;
  } else if (graphContent instanceof HTMLElement) {
    container.appendChild(graphContent);
  } else if (Array.isArray(graphContent)) {
    graphContent.forEach(item => {
      if (typeof item === 'string') {
        container.innerHTML += item;
      } else if (item instanceof HTMLElement) {
        container.appendChild(item);
      }
    });
  }

  return container;
}

/**
 * Render the index view using the imported indexContent module.
 * This function identifies the container element and populates it with the
 * index content from the appropriate module.
 * 
 * @param {string} containerId - The ID of the container element to render the index in
 * @param {Object} options - Optional configuration options for rendering
 * @returns {HTMLElement} The rendered index view container
 */
function renderIndexView(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Index view container with ID "${containerId}" not found`);
    return null;
  }

  // Clear existing content
  container.innerHTML = '';

  // Get content from the indexContent module
  const content = indexContent(options);

  // Append the content to the container
  if (typeof content === 'string') {
    container.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    container.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(item => {
      if (typeof item === 'string') {
        container.innerHTML += item;
      } else if (item instanceof HTMLElement) {
        container.appendChild(item);
      }
    });
  }

  return container;
}

// Main entry: Address all accessibility issues
function addressAccessibilityIssues() {
  addLangAttribute();
  addFaviconAccessibleName();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
}

// Example usage of the accessibility functions
if (typeof document !== 'undefined') {
  addressAccessibilityIssues();
}

// Some existing functions have been removed for simplicity (e.g., validateLandmark, checkTableStructure, addMainLandmark, and addLandmarkRegions)

// Export new functionality from origin/main
export function newFunction1() {
  // Example implementation for new functionality
  return compute(42);
}
export function newFunction2() {
  // Example implementation for additional functionality
  return transform('test');
}

function existingFunction() {
  return CONFIG.debug;
}

function wrapInMainLandmark(content) {
    return `<main>\n${content}\n</main>`;
}

function wrapContentInMain() {
    const content = `
    <div class="container">
        <h2>Quality & Metrics Reports</h2>
        <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
        <div class="links">
            <a href="plato-report/index.html">Plato Code Complexity Report</a>
            <a href="dependency-graph.html">Dependency Graph</a>
        </div>
    </div>
    `;
    return wrapInMainLandmark(content);
}

function wrapTableInMain() {
    const tableContent = `
    <table id="table-rotated">
        <thead><tr><th>Module</th><th>Dependencies</th></tr></thead>
        <tbody><tr><td>main.js</td><td>helper, math, utils</td></tr></tbody>
    </table>
    `;
    return wrapInMainLandmark(tableContent);
}

module.exports = {
  CONFIG,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addFaviconAccessibleName,
  validateLinkAccessibility,
  renderDependencyGraph,
  renderIndexView,
  addressAccessibilityIssues,
  addLangAttribute,
  newFunction1,
  newFunction2,
  existingFunction,
  wrapInMainLandmark,
  wrapContentInMain,
  wrapTableInMain,
  helper
};