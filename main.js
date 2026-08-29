// main.js

// Utility functions

/**
 * Creates a button element for in-page use.
 * @param {string} text - The text/label for the button
 * @param {Function} onClick - Click handler callback
 * @param {Object} options - Optional configuration
 * @param {string} [options.className] - CSS class(es) to apply
 * @param {string} [options.id] - Element ID
 * @param {Object} [options.styles] - Inline styles to apply
 * @param {string} [options.type] - Button type (default: 'button')
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, onClick, options = {}) {
  const {
    className = '',
    id = '',
    styles = {},
    type = 'button',
    disabled = false,
  } = options;

  const button = document.createElement('button');
  button.type = type;
  button.textContent = text;
  button.disabled = disabled;

  if (className) {
    button.className = className;
  }

  if (id) {
    button.id = id;
  }

  if (styles && typeof styles === 'object') {
    Object.assign(button.style, styles);
  }

  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
}

// Add accessible names to SVGs
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
function ensureUniqueLandmarksFromInsightReport(insightReport) {
  const issues = insightReport.issues || [];
  let uniqueLandmarks = {};

  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      const element = document.querySelector(issue.selector);

      // If the landmark role exists, add it to the unique landmarks object
      if (element && issue.ariaRole) {
        if (!uniqueLandmarks[issue.ariaRole]) {
          uniqueLandmarks[issue.ariaRole] = true;
        } else {
          // Remove the role if it's not unique
          element.removeAttribute('role');
        }
      }
    }
  });

  // Check if all landmarks are unique and re-add if necessary
  ensureUniqueLandmarks();
}

// New function to implement accessibility fixes
function implementNewFunction() {
  addressAccessibilityIssues();
  fixFakeLinks();
  ensureUniqueLandmarks();
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  fixTableHeaderCellScope();
  improveAccessibility();
}

// Existing code preserved below
function main() {
  console.log('Running main application');
  return someFunction();
}

// Export all functions for use elsewhere in the repository
module.exports = {
  improveAccessibility,
  addressInsightReportIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  ensureUniqueLandmarksFromInsightReport,
  addLandmarkRolesAndFixLandmarkIssuesFromInsightReport,
  ensureUniqueLandmarks,
  fixFakeLinks,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  implementNewFunction,
  addLangAttribute,
  main,
  someFunction,
  addressAccessibilityIssues,
  renderDependencyGraphContent,
  config,
  logger,
  createInPageButton,
};

// Execute main function
main();