const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

let uniqueLandmarks = {};

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
  addProperLandmarkRegions();

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

function ensureUniqueLandmarks(insightReport) {
  const landmarks = [...new Set(insightReport.issues.flatMap(issue => issue.ariaRole))];

  // Check if all landmarks exist, re-add if necessary
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length < landmarks.length) {
      const uniqueLandmarkMap = {};

      landmarks.forEach(uniqueLandmark => {
        let element = elements.filter(el => el.getAttribute('role') === uniqueLandmark);
        if (!element[0]) {
          element = document.createElement(`div`);
          element.setAttribute('role', uniqueLandmark);
          if (!document.querySelector(`#${uniqueLandmark}`)) {
            const id = uniqueLandmark;
            element.setAttribute('id', id);
          }
          document.body.appendChild(element);
        }
        uniqueLandmarkMap[uniqueLandmark] = element[0];
      });

      uniqueLandmarks = uniqueLandmarkMap;
    } else {
      elements.forEach(el => {
        const isUnique = !uniqueLandmarkMap[landmark] || uniqueLandmarkMap[landmark].filter(e => e === el).length === 0;
        if (isUnique) {
          uniqueLandmarkMap[landmark].push(el);
        } else {
          el.removeAttribute('role');
        }
      });
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

function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  // Support both class and data attribute selectors for compatibility
  const container = document.querySelector('.dependency-graph, [data-dependency-graph]') || document.querySelector('.dependencyGraph') || document.querySelector('[data-testid="dependency-graph"]');
  if (container) {
    container.innerHTML = data;
  }
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
    const container = document.querySelector('.index-content, [data-index-content]');
    if (container) {
      container.innerHTML = data;
    }
  }
}

// Updated function for rendering dependency graph using new render function
function renderDependencyGraph(dependencyData) {
  console.log('Rendering dependency graph with data:', dependencyData);
  renderGraphContentWithOptions(dependencyData, { container: document.querySelector('.dependency-graph-content, [data-dependency-graph-content]') });
}

function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
  renderIndexContentWithOptions(indexData, { container: document.querySelector('.index-content, [data-index-content]') });
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

function implementNewFunction() {
  addressAccessibilityIssues();
  implementAccessibilityFixes();
  fixFakeLinks();
  ensureUniqueLandmarks();
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  fixTableHeaderCellScope();
  fixUniqueLandmarks();
}

function addProperLandmarkRegions() {
  // Ensure proper landmark regions are added to the page
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
  
  landmarkRoles.forEach(role => {
    const existingElements = document.querySelectorAll(`[role="${role}"]`);
    
    if (existingElements.length === 0) {
      // If no element with this role exists, create one
      let landmarkElement;
      
      if (role === 'banner') {
        // Look for header elements that could serve as banner
        const header = document.querySelector('header');
        if (header) {
          header.setAttribute('role', 'banner');
        } else {
          landmarkElement = document.createElement('div');
          landmarkElement.setAttribute('role', 'banner');
          landmarkElement.setAttribute('aria-label', 'Site Header');
          document.body.insertBefore(landmarkElement, document.body.firstChild);
        }
      } else if (role === 'main') {
        // Main landmark is handled by addMainLandmark(), but ensure it's properly set
        const mainElements = document.querySelectorAll('main');
        if (mainElements.length === 0) {
          landmarkElement = document.createElement('main');
          landmarkElement.setAttribute('role', 'main');
          landmarkElement.setAttribute('aria-label', 'Main Content');
          document.body.appendChild(landmarkElement);
        }
      } else if (role === 'navigation') {
        // Look for nav elements that could serve as navigation
        const nav = document.querySelector('nav');
        if (nav) {
          nav.setAttribute('role', 'navigation');
        } else {
          landmarkElement = document.createElement('nav');
          landmarkElement.setAttribute('role', 'navigation');
          landmarkElement.setAttribute('aria-label', 'Navigation');
          document.body.appendChild(landmarkElement);
        }
      } else if (role === 'contentinfo') {
        // Look for footer elements that could serve as contentinfo
        const footer = document.querySelector('footer');
        if (footer) {
          footer.setAttribute('role', 'contentinfo');
        } else {
          landmarkElement = document.createElement('footer');
          landmarkElement.setAttribute('role', 'contentinfo');
          landmarkElement.setAttribute('aria-label', 'Footer Content');
          document.body.appendChild(landmarkElement);
        }
      } else if (role === 'search') {
        // Look for search elements
        const search = document.querySelector('[role="search"], .search, #search');
        if (search) {
          search.setAttribute('role', 'search');
        } else {
          landmarkElement = document.createElement('div');
          landmarkElement.setAttribute('role', 'search');
          landmarkElement.setAttribute('aria-label', 'Search');
          document.body.appendChild(landmarkElement);
        }
      } else if (role === 'form') {
        // Look for form elements
        const formElements = document.querySelectorAll('form');
        if (formElements.length > 0 && !formElements[0].hasAttribute('role')) {
          formElements[0].setAttribute('role', 'form');
        }
      } else if (role === 'complementary') {
        // Look for aside elements
        const aside = document.querySelector('aside');
        if (aside) {
          aside.setAttribute('role', 'complementary');
        }
      }
    }
  });
  
  return null;
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
  someFunction,
  addressAccessibilityIssues,
  renderDependencyGraphContent,
  implementAccessibilityFixes,
  fixFakeLinks,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  implementNewFunction,
  addLangAttribute,
  main,
  addressAccessibilityIssues,
  renderDependencyGraphContent,
  renderGraphContentWithOptions,
  renderIndexContentWithOptions,
  fixUniqueLandmarks,
  capitalizeFirstLetter,
  addProperLandmarkRegions
};

main();