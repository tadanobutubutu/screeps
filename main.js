// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};
let uniqueLandmarks = {};

function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('[data-dependency-graph]') || document.querySelector('.dependency-graph') || document.getElementById('dependency-graph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  // New accessibility functions
  function improveAccessibility() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent || 'Button');
      }
    });

    const focusable = document.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex="0"], [contenteditable]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  function ensureUniqueLandmarks() {
    const landmarks = [...new Set(Array.from(document.querySelectorAll('[role]')).map(el => el.getAttribute('role')))];

    // Check if all landmarks exist, re-add if necessary
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll('[role="' + landmark + '"]');
      if (elements.length < landmarks.length) {
        const uniqueLandmarkMap = {};

        landmarks.forEach(uniqueLandmark => {
          let element = elements.filter(el => el.getAttribute('role') === uniqueLandmark);
          if (!element[0]) {
            element = [document.createElement('div')];
            element[0].setAttribute('role', uniqueLandmark);
            if (!element[0].id) {
              const id = uniqueLandmark;
              element[0].setAttribute('id', id);
            }
            document.body.appendChild(element[0]);
          }
          uniqueLandmarkMap[uniqueLandmark] = element[0];
        });

        uniqueLandmarks = uniqueLandmarkMap;
      } else {
        elements.forEach(el => {
          const isUnique = !uniqueLandmarkMap[landmark] || Object.values(uniqueLandmarkMap).filter(e => e === el).length === 0;
          if (isUnique) {
            uniqueLandmarkMap[landmark] = el;
          } else {
            el.removeAttribute('role');
          }
        });
      }
    });
  }

  function addressInsightReportIssues(insightReport) {
    const issues = insightReport.issues || [];
    issues.forEach(issue => {
      const element = document.querySelector(issue.selector);
      if (element) {
        if (issue.code === 'REACT_015') {
          document.documentElement.lang = 'en';
        }
        if (issue.code === 'REACT_017') {
          if (issue.ariaRole) {
            element.setAttribute('role', issue.ariaRole);
          }
        }
        if (issue.code === 'REACT_041') {
          if (issue.ariaLabel) {
            element.setAttribute('aria-label', issue.ariaLabel);
          }
        }
        if (issue.code === 'REACT_025') {
          // Implement logic to ensure unique landmarks if needed
        }
        if (issue.code === 'REACT_036') {
          // Implement logic to fix fake link issues if needed
        }
        if (issue.code === 'REACT_027') {
          // This issue is already implemented, so no action is needed here
        }
      }
    });
  }

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

  // ... existing code and exports ...

  return null;
}

function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  // Support both class and data attribute selectors for compatibility
  const container = document.querySelector('[data-dependency-graph-content]') || document.querySelector('.dependency-graph-content') || document.getElementById('dependency-graph-content');
  if (container) {
    container.innerHTML = data;
  }
}

/**
 * New function to be added as per the issue
 * @param {string} text
 * @returns {string}
 */
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Optimized and added function to render Svg elements with accessible names:
function renderSvg(svgElement) {
  // ... existing code ...
  if (!svgElement) return;

  // New code that uses the imported modules
  const { someModule } = require('some-module');
  const someValue = someModule ? someModule.getValue() : 'default';
  
  // Ensure SVG has accessible name
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  
  return svgElement;
}

// New rendering functions for graph/index (to be used by existing functions)
function renderGraphContentWithOptions(data, options = {}) {
  console.log('Rendering graph content with options:', { data, options });
  if (options.container) {
    options.container.innerHTML = data;
  } else {
    renderDependencyGraphContent(data);
  }
}

function renderIndexContentWithOptions(data, options = {}) {
  console.log('Rendering index content with options:', { data, options });
  if (options.container) {
    options.container.innerHTML = data;
  } else {
    // Default rendering behavior for index
    const container = document.querySelector('[data-index-content]') || document.querySelector('.index-content');
    if (container) {
      container.innerHTML = data;
    }
  }
}

// Updated function for rendering dependency graph using new render function
function renderDependencyGraph(dependencyData) {
  console.log('Rendering dependency graph with data:', dependencyData);
  // Convert dependency data to HTML representation
  const htmlContent = generateDependencyGraphHtml(dependencyData);
  
  // Render the content using the existing render function
  renderDependencyGraphContent(htmlContent);

  // Apply accessibility attributes
  addressAccessibilityIssues();
}

function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
  renderIndexContentWithOptions(indexData, { container: document.querySelector('[data-index-content]') });
}

function calculateSum(a, b) {
  return a + b;
}

function fixFakeLinks() {
  const fakeLinkAnchors = document.querySelectorAll('a:not([href])');
  const fakeLinkDivs = document.querySelectorAll('div[role="link"], span[role="link"]');

  [...fakeLinkAnchors, ...fakeLinkDivs].forEach(link => {
    link.setAttribute('role', 'button');
    link.tabIndex = 0;
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Button');
    }
  });
}

function addLangAttribute() {
  if (!document.documentElement.lang) {
    document.documentElement.lang = 'en';
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
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(cell => {
      if (!cell.hasAttribute('scope')) {
        const rows = Array.from(table.querySelectorAll('tr'));
        const cellIndex = Array.from(cell.parentElement.children).indexOf(cell);
        let isHeaderRow = true;

        rows.forEach(row => {
          const rowCells = row.querySelectorAll('td');
          if (rowCells[cellIndex] !== cell) {
            isHeaderRow = false;
          }
        });

        cell.setAttribute('scope', isHeaderRow ? 'row' : 'col');
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
    let title = svg.querySelector('title');
    if (title) {
      const titleId = 'svg-title-' + index;
      title.setAttribute('id', titleId);
      svg.setAttribute('aria-labelledby', titleId);
    } else {
      const title = document.createElement('title');
      title.textContent = 'SVG graphic ' + (index + 1);
      svg.insertBefore(title, svg.firstChild);
    }
  });
}

// New function to implement accessibility fixes as per issue requirements
function newFunction() {
  // Address accessibility issues from insight report
  addressAccessibilityIssues();
  // Fix fake link issues
  fixFakeLinks();
  // Ensure unique landmarks
  ensureUniqueLandmarks();
  // Add lang attribute
  addLangAttribute();
  // Fix table structure
  fixTableStructureIssues();
  // Add main landmark
  addMainLandmark();
  // Fix table header cell scope
  fixTableHeaderCellScope();
  // Improve overall accessibility
  improveAccessibility();
}

// Updated function for REACT_025 (ensuring unique landmarks)
function ensureUniqueLandmarksWithInsight(insightReport) {
  const issues = insightReport.issues || [];

  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      const element = document.querySelector(issue.selector);

      if (element && issue.ariaRole) {
        uniqueLandmarks[issue.ariaRole] = element;
      }
    }
  });

  uniqueLandmarks = uniqueLandmarks;

  // Check if all landmarks are unique and re-add if necessary
  Object.keys(uniqueLandmarks).forEach(role => {
    const existing = document.querySelector('[role="' + role + '"]');
    if (!existing && uniqueLandmarks[role]) {
      document.body.appendChild(uniqueLandmarks[role]);
    }
  });
}

function implementAccessibilityFixes() {
  addLangAttribute();
  fixFakeLinks();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
}

function implementNewFunction() {
  addressAccessibilityIssues();
  implementAccessibilityFixes();
  fixFakeLinks();
  ensureUniqueLandmarks();
  addLangAttribute();
  addMainLandmark();
  fixTableStructureIssues();
}

function generateDependencyGraphHtml(data) {
  if (!data || !Array.isArray(data.nodes)) {
    return '<div class="no-data">No dependency data available</div>';
  }

  let html = '<ul class="dependency-list">';

  data.nodes.forEach(node => {
    html += '<li class="dependency-node">';
    html += '<span class="node-name">' + (node.name || node.id) + '</span>';

    if (node.dependencies && node.dependencies.length > 0) {
      html += '<ul class="sub-dependencies">';
      node.