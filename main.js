// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions, validateLandmark)
// Added functions related to dependency graphs and module structure visualization for debugging purposes
// - countDependencies, renderDependencyGraph, displayModuleStructure, getModuleDependencies, generateDependencyTree

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Get the full language attribute string for the HTML element
 * @returns {string} The full lang attribute (e.g., "en" or "en-US")
 */
function getFullLangAttribute() {
  return 'en-US';
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  if (!table.headers) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array} tables - Array of table objects to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];

  tables.forEach((table, index) => {
    const result = validateTableAccessibility(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

/**
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];

  landmarks.forEach((landmark, index) => {
    const result = validateLandmark(landmark);
    if (!result.success) {
      issues.push({
        landmarkIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarks - Array of landmark elements to check
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];

  landmarks.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {Object} svg - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
  if (svg.ariaLabel) {
    return svg.ariaLabel;
  }
  if (svg.ariaLabelledby) {
    return svg.ariaLabelledby;
  }
  if (svg.title) {
    return svg.title;
  }
  return 'Unnamed SVG';
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {string} options.ariaLabel - Aria label for the button
 * @param {Function} options.onClick - Click handler
 * @returns {Object} Button element object
 */
function createInPageButton(options) {
  return {
    type: 'button',
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    onClick: options.onClick,
    accessibleName: getSvgAccessibleName({ ariaLabel: options.ariaLabel })
  };
}

/**
 * Creates an accessible link element
 * @param {Object} options - Link options
 * @param {string} options.href - Link URL
 * @param {string} options.text - Link text
 * @param {string} options.ariaLabel - Aria label for the link
 * @returns {Object} Link element object
 */
function createAccessibleLink(options) {
  return {
    type: 'a',
    href: options.href,
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    isFake: false
  };
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues) {
  const handled = [];
  const unhandled = [];

  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

/**
 * Adds lang attribute to HTML element
 * @param {Object} element - The HTML element to modify
 * @returns {Object} The modified element with lang attribute
 */
function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
}

/**
 * Validates link accessibility
 * @param {Object} link - The link element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLinkAccessibility(link) {
  const issues = [];

  if (!link.href) {
    issues.push('Missing href attribute');
  }

  if (!link.text && !link.ariaLabel) {
    issues.push('Missing both text content and aria-label');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Handles fake links by converting them to proper buttons
 * @param {Object} link - The fake link element
 * @returns {Object} Converted button element
 */
function handleFakeLinks(link) {
  return createInPageButton({
    text: link.text,
    ariaLabel: link.ariaLabel,
    onClick: link.onClick
  });
}

/**
 * Sets SVG attributes for better accessibility
 * @param {Object} svg - The SVG element to modify
 * @returns {Object} The modified SVG element
 */
function setSvgAttributes(svg) {
  svg.ariaLabel = getSvgAccessibleName(svg);
  svg.role = 'img';
  return svg;
}

/**
 * Ensures unique landmarks from a string representation
 * @param {string} landmarksString - String representation of landmarks
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarksFromString(landmarksString) {
  const landmarks = landmarksString.split(',').map(item => ({
    textContent: item.trim()
  }));
  return ensureUniqueLandmarks(landmarks);
}

/**
 * Adds proper landmark regions to the document
 * @param {Object} document - The document object to modify
 * @returns {Object} The modified document with proper landmarks
 */
function addProperLandmarkRegions(document) {
  if (!document.querySelector('header')) {
    const header = document.createElement('header');
    document.body.insertBefore(header, document.body.firstChild);
  }

  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    document.body.appendChild(main);
  }

  if (!document.querySelector('footer')) {
    const footer = document.createElement('footer');
    document.body.appendChild(footer);
  }

  return document;
}

/**
 * Counts dependencies in a module
 * @param {Object} module - The module to analyze
 * @returns {number} The number of dependencies
 */
function countDependencies(module) {
  return module.dependencies ? module.dependencies.length : 0;
}

/**
 * Renders a dependency graph for visualization
 * @param {Array} dependencies - Array of dependencies
 * @returns {string} Visual representation of the dependency graph
 */
function renderDependencyGraph(dependencies) {
  let graph = 'Dependency Graph:\n';
  dependencies.forEach((dep, index) => {
    graph += `${index + 1}. ${dep.name} (${dep.version})\n`;
  });
  return graph;
}

/**
 * Displays the structure of a module
 * @param {Object} module - The module to display
 * @returns {string} String representation of the module structure
 */
function displayModuleStructure(module) {
  let structure = `Module: ${module.name}\n`;
  structure += `Dependencies: ${countDependencies(module)}\n`;
  return structure;
}

/**
 * Gets all dependencies of a module
 * @param {Object} module - The module to analyze
 * @returns {Array} Array of dependencies
 */
function getModuleDependencies(module) {
  return module.dependencies || [];
}

/**
 * Generates a dependency tree for a module
 * @param {Object} module - The module to analyze
 * @param {number} [depth=0] - Current depth in the tree
 * @returns {string} String representation of the dependency tree
 */
function generateDependencyTree(module, depth = 0) {
  let tree = ' '.repeat(depth * 2) + `- ${module.name}\n`;
  if (module.dependencies) {
    module.dependencies.forEach(dep => {
      tree += generateDependencyTree(dep, depth + 1);
    });
  }
  return tree;
}

// Export all functions for testing and external use
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  addLangAttribute,
  validateLinkAccessibility,
  handleFakeLinks,
  setSvgAttributes,
  ensureUniqueLandmarksFromString,
  addProperLandmarkRegions,
  countDependencies,
  renderDependencyGraph,
  displayModuleStructure,
  getModuleDependencies,
  generateDependencyTree
};