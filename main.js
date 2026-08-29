const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

let uniqueLandmarks = {};

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  // Filter out duplicates based on id or name
  const seen = new Set();
  return landmarks.filter(landmark => {
    const key = landmark.id || landmark.name;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Address accessibility issues from insight report:
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('.dependency-graph, [data-dependency-graph]') || document.querySelector('.dependencyGraph') || document.querySelector('[data-testid="dependency-graph"]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }
  // ... any new code or functions requested in the issue ...

  // TODO: This is the existing code that needs to be preserved
  // _Commit: 07177d2c69c06fd1dfe3543ad6d3c81baa3c821f_
  // <!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->

  return null;
}

// <!--- START ADDITIONAL FUNCTION --->
/**
 * New function to be added as per the issue
 * @param {string} text
 * @returns {string}
 */
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// New function to address accessibility issues from insight report
function improveAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', button.textContent || 'Button');
    }
  });

  const focusable = document.querySelectorAll('[role="link"]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

// Render index data for graph display
function renderGraphIndex(landmarks, connections) {
  const uniqueLandmarksList = ensureUniqueLandmarks(landmarks);
  
  const nodes = uniqueLandmarksList.map(landmark => ({
    id: landmark.id || landmark.name,
    label: landmark.name || landmark.id,
    lat: landmark.lat,
    lon: landmark.lon
  }));
  
  const edges = connections.map(conn => ({
    source: conn.from,
    target: conn.to,
    weight: calculateDistance(
      { lat: conn.fromLat, lon: conn.fromLon },
      { lat: conn.toLat, lon: conn.toLon }
    )
  }));
  
  return {
    nodes,
    edges,
    metadata: {
      totalNodes: nodes.length,
      totalEdges: edges.length
    }
  };
}

function fixFakeLinks() {
  const fakeLinkAnchors = document.querySelectorAll('a[href="#"]');
  const fakeLinkDivs = document.querySelectorAll('[role="link"]');

  [...fakeLinkAnchors, ...fakeLinkDivs].forEach(link => {
    link.setAttribute('role', 'button');
    link.tabIndex = 0;
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Button');
    }
  });
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', 'en');
  }
}

function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, tbody || firstRow);
      }
    }
  });
}

function fixTableHeaderCellScope() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headerCells = table.querySelectorAll('th, td');
    headerCells.forEach(cell => {
      if (!cell.hasAttribute('scope')) {
        const rows = table.querySelectorAll('tr');
        const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
        let isHeaderRow = true;

        rows.forEach(row => {
          const rowCells = row.querySelectorAll('th, td');
          if (rowCells[cellIndex] !== cell) {
            isHeaderRow = false;
          }
        });

        cell.setAttribute('scope', isHeaderRow ? 'col' : 'row');
      }
    });
  });
}

function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach(main => {
    if (!main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  });
  if (mainElements.length === 0) {
    const content = document.querySelector('#content, .content, [role="main"]');
    if (content) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      while (content.firstChild) {
        main.appendChild(content.firstChild);
      }
      content.appendChild(main);
    }
  }
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (title) {
      const titleId = `svg-title-${index}`;
      title.setAttribute('id', titleId);
      svg.setAttribute('aria-labelledby', titleId);
    } else {
      const title = document.createElement('title');
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
  });
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  renderGraphIndex,
  config,
  logger,
  improveAccessibility,
  capitalizeFirstLetter,
  addressAccessibilityIssues,
  fixFakeLinks,
  addLangAttribute,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames
};