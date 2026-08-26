// Import helper functions for accessibility
const accessibilityHelpers = require('./utils/accessibilityHelpers');
const domHelpers = require('./utils/domHelpers');

// Address accessibility issues from insight report
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  const dependencyGraph = domHelpers.getElement('dependency-graph');
  if (dependencyGraph) {
    accessibilityHelpers.setRole(dependencyGraph, 'tree');
    accessibilityHelpers.setAriaLabel(dependencyGraph, 'Dependency Graph');
  }
}

// Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  const container = domHelpers.getElement('dependency-graph');
  if (container) {
    container.innerHTML = data;
    // Apply accessibility fixes after rendering content
    accessibilityHelpers.applyAccessibilityFixes(container);
  }
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = domHelpers.queryElements('[role="landmark"]');
  const seen = new Set();
  landmarks.forEach(landmark => {
    const role = accessibilityHelpers.getRole(landmark);
    if (seen.has(role)) {
      accessibilityHelpers.removeLandmark(landmark);
    } else {
      seen.add(role);
    }
  });
}

// Fix fake link issue
function fixFakeLinks() {
  const fakeLinks = domHelpers.queryElements('a[href="#"]');
  fakeLinks.forEach(link => {
    accessibilityHelpers.setRole(link, 'button');
    accessibilityHelpers.setTabIndex(link, '0');
    if (accessibilityHelpers.needsAriaLabel(link)) {
      accessibilityHelpers.setAriaLabel(link, 'Button');
    }
  });
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    accessibilityHelpers.setLang(htmlElement, 'en');
  }
}

// Fix table structure issues
function fixTableStructureIssues() {
  const tables = domHelpers.queryElements('table');
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, tbody || firstRow);
      }
    }
    // Ensure tables have at least one tbody
    if (!table.querySelector('tbody')) {
      const rows = domHelpers.getTableRows(table);
      if (rows.length > 0) {
        const tbody = document.createElement('tbody');
        rows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
      }
    }
  });
}

// Add main landmark
function addMainLandmark() {
  const mainElements = domHelpers.queryElements('main');
  mainElements.forEach(main => {
    if (!main.getAttribute('role')) {
      accessibilityHelpers.setRole(main, 'main');
    }
  });
  // If no main element exists, create one for the main content
  if (mainElements.length === 0) {
    const content = domHelpers.getElement('content');
    if (content) {
      const main = document.createElement('main');
      accessibilityHelpers.setRole(main, 'main');
      while (content.firstChild) {
        main.appendChild(content.firstChild);
      }
      content.appendChild(main);
    }
  }
}

// Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = domHelpers.queryElements('svg');
  svgs.forEach((svg, index) => {
    const title = domHelpers.getSvgTitle(svg);
    if (title) {
      const titleId = `svg-title-${index + 1}`;
      title.setAttribute('id', titleId);
      accessibilityHelpers.setAriaLabelledBy(svg, titleId);
    } else {
      console.log(`SVG graphic ${index + 1}`);
    }
  });
}

// New function to implement accessibility fixes
function implementNewFunction() {
  addressAccessibilityIssues();
  fixFakeLinks();
  ensureUniqueLandmarks();
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
}

// New function to call the new accessibility fixes function
function callNewFunction() {
  implementNewFunction();
}

// Export the module functions
module.exports = {
  renderDependencyGraphContent,
  ensureUniqueLandmarks,
  fixFakeLinks,
  implementNewFunction,
  addressAccessibilityIssues,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  callNewFunction // New export for calling the new function
};