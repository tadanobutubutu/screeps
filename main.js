const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

// Address accessibility issues from insight report:
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('.dependency-graph, [data-dependency-graph]') || document.querySelector('.dependencyGraph') || document.querySelector('[data-testid="dependency-graph"]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  // Fix table structure issues
  fixTableStructureIssues();

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  return null;
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

function ensureUniqueLandmarks() {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const uniqueLandmarkMap = {};

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    elements.forEach(el => {
      const isUnique = !uniqueLandmarkMap[landmark] || uniqueLandmarkMap[landmark].filter(e => e === el).length === 0;
      if (isUnique) {
        uniqueLandmarkMap[landmark].push(el);
      } else {
        el.removeAttribute('role');
      }
    });
  });
}

// New function to add landmark roles and fix issues
function addLandmarkRoles(insightReport) {
  const issues = insightReport.issues || [];

  issues.forEach(issue => {
    if (issue.code === 'REACT_017') {
      const element = document.querySelector(issue.selector);
      if (element && issue.ariaRole) {
        element.setAttribute('role', issue.ariaRole);
      }
    }
  });
}

// Address other insight report issues
function fixLandmarkIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    if (issue.code === 'REACT_017') {
      const element = document.querySelector(issue.selector);
      if (element && issue.ariaRole) {
        element.setAttribute('role', issue.ariaRole);
      }
    }
  });
}

function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  // Support both class and data attribute selectors for compatibility
  const container = document.querySelector('.dependency-graph-content, [data-dependency-graph-content]') || document.querySelector('.dependencyGraph') || document.querySelector('[data-testid="dependency-graph"]');
  if (container) {
    container.innerHTML = data;
  }
}

function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
}

function calculateSum(a, b) {
  return a + b;
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

let uniqueLandmarks = {};

// Updated function for REACT_025 (ensuring unique landmarks)
function fixUniqueLandmarks(insightReport) {
  const issues = insightReport.issues || [];

  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      const element = document.querySelector(issue.selector);

      if (element && issue.ariaRole) {
        uniqueLandmarks[issue.ariaRole] = element;
      }
    }
  });

  uniqueLandmarks = Object.values(uniqueLandmarks);

  // Check if all landmarks are unique and re-add if necessary
  ensureUniqueLandmarks();
}

let oldFakeLinks = [];

// New function to identify and fix fake links
function findFakes(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    // Only deal with REACT_036 issues
    if (issue.code === 'REACT_036') {
      oldFakeLinks.push({ Selector: issue.selector, Text: issue.text });
      issue.text = '';
    }
  });
}

// Updated function for REACT_036 (fixing fake links)
function fixFakeLinks() {
  const fakeLinkAnchors = document.querySelectorAll('a[href="#"]');
  const fakeLinkDivs = document.querySelectorAll('[role="link"]');

  [...fakeLinkAnchors, ...fakeLinkDivs].forEach((link, index) => {
    link.setAttribute('role', 'button');
    link.tabIndex = 0;
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Button');
    }

    // Replace with an actual link
    if (oldFakeLinks.some(({ Selector }) => Selector === link.cloneNode(true).outerHTML)) {
      const originalText = oldFakeLinks.find(({ Text }) => Text === link.textContent);
      if (originalText) {
        link.href = `#${originalText.Text}`;
        oldFakeLinks = oldFakeLinks.filter(({ Text }) => Text !== originalText.Text);
      }
    }
  });
}

let oldTableStructureIssues = [];

// New function to identify and fix table structure issues
function findTableStructureIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    // Only deal with REACT_026 issues
    if (issue.code === 'REACT_026') {
      oldTableStructureIssues.push({ Selector: issue.selector, Table: issue.table });
      issue.table = '';
    }
  });
}

// Updated function for REACT_026 (fixing table structure issues)
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

    // Replace existing tables with the original ones
    if (oldTableStructureIssues.some(({ Selector }) => Selector === table.cloneNode(true).outerHTML)) {
      const originalTable = oldTableStructureIssues.find(({ Table }) => Table === table.outerHTML);

      if (originalTable) {
        table.outerHTML = originalTable.Table;
        oldTableStructureIssues = oldTableStructureIssues.filter(({ Table }) => Table !== originalTable.Table);
      }
    }
  });
}

let oldTableHeaderCellScopeIssues = [];

// New function to identify and fix table header cell scope issues
function findTableHeaderCellScopeIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    // Only deal with REACT_028 issues
    if (issue.code === 'REACT_028') {
      oldTableHeaderCellScopeIssues.push({ Selector: issue.selector, Table: issue.table, Cell: issue.cell, Scope: issue.scope });
      issue.scope = '';
    }
  });
}

// Updated function for REACT_028 (fixing table header cell scope issues)
function fixTableHeaderCellScope() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headerCells = table.querySelectorAll('th');
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

  // Replace existing cells with the original ones
  tableHeaderCells.forEach(({ Selector, Table, Cell, Scope }) => {
    const cellToReplace = document.querySelector(Selector);
    cellToReplace.setAttribute('scope', Scope);
  });
}

let tableHeaderCells = [];

// New function to collect table header cells
function collectTableHeaderCells(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    // Only deal with REACT_028 issues
    if (issue.code === 'REACT_028') {
      tableHeaderCells.push({ Selector: issue.selector, Table: issue.table, Cell: issue.cell, Scope: issue.scope });
    }
  });
}

let oldInsightReportIssues = [];

// New function to collect insight report issues
function collectInsightReportIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    // Only deal with non-REACT_027 issues
    if (issue.code !== 'REACT_027') {
      oldInsightReportIssues.push(issue);
    }
  });
}

function implementNewFunction() {
  addressAccessibilityIssues();
  fixFakeLinks();
  collectTableHeaderCells();
  ensureUniqueLandmarks();
  addLandmarkRoles();
  fixLandmarkIssues();
  findFakes();
  fixFakeLinks();
  findTableStructureIssues();
  fixTableStructureIssues();
  findTableHeaderCellScopeIssues();
  fixTableHeaderCellScope();
  collectInsightReportIssues();
}

function main() {
  console.log('Running main application');
  implementNewFunction(); // Address accessibility issues from insight report
  return someFunction();
}

module.exports = {
  config,
  logger,
  improveAccessibility,
  addressInsightReportIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  fixLandmarkIssues,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  fixFakeLinks,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  implementNewFunction,
  addMainLandmark,
  addSvgAccessibleNames,
  findFakes,
  findTableStructureIssues,
  findTableHeaderCellScopeIssues,
  collectTableHeaderCells,
  collectInsightReportIssues,
  fixUniqueLandmarks,
  oldFakeLinks,
  oldTableStructureIssues,
  oldTableHeaderCellScopeIssues,
  tableHeaderCells,
  oldInsightReportIssues
};

main();