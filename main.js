const { getLangAttribute, createInPageButton } = require('./utils/accessibilityUtils');
const { validateTableAccessibility, validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure, ensureUniqueLandmarks } = require('./utils/landmarkUtils');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svgAccessibilityUtils');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const { calculateSum } = require('./utils/myFunctions'); // Added from HEAD

const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  }
};

const fs = require('fs');
const path = require('path');

/**
 * Calculates the depth of dependency tree
 * @param {Object} dependencies - The dependency object
 * @param {string} currentKey - Current key being processed
 * @returns {number} Maximum depth of the dependency tree
 */
function getDependencyDepth(dependencies, currentKey = '') {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0;
  }

  let maxDepth = 0;
  const keys = Object.keys(dependencies);

  keys.forEach(key => {
    const value = dependencies[key];
    if (typeof value === 'object' && value !== null) {
      const nestedDepth = getDependencyDepth(value, key);
      maxDepth = Math.max(maxDepth, nestedDepth + 1);
    }
  });

  return maxDepth;
}

/**
 * Renders a dependency graph as ASCII art for debugging purposes.
 * @param {Object} dependencies - The dependency object
 * @param {string} prefix - Current prefix for indentation
 * @param {boolean} isLast - Whether this is the last item at current level
 * @returns {string} ASCII representation of the dependency graph
 */
function renderDependencyGraph(dependencies, prefix = '', isLast = true) {
  if (!dependencies || typeof dependencies !== 'object') {
    return '';
  }

  let output = '';
  const keys = Object.keys(dependencies);

  keys.forEach((key) => {
    const value = dependencies[key];
    const indent = '<span class="nested">'.repeat(prefix.length);
    const closeIndent = '</span>'.repeat(prefix.length);

    if (typeof value === 'object' && value !== null) {
      output += `<div class="dep-item">${indent}${key}/${closeIndent}</div>`;
      output += renderDependencyGraph(value, prefix + '    ', false);
    } else {
      output += `<div class="dep-item">${indent}${key} → ${value}${closeIndent}</div>`;
    }
  });

  return output;
}

/**
 * Displays module structure for debugging purposes.
 * @param {Array} modules - Array of module objects
 * @returns {string} Formatted module structure display
 */
function displayModuleStructure(modules) {
  if (!Array.isArray(modules)) {
    return 'Error: modules must be an array';
  }

  let output = 'Module Structure:\n';
  output += '==================\n\n';

  modules.forEach((mod, index) => {
    const name = mod.name || mod.id || `Module ${index + 1}`;
    output += `${index + 1}. ${name}\n`;

    if (mod.dependencies && Array.isArray(mod.dependencies)) {
      output += `   Dependencies: ${mod.dependencies.join(', ')}\n`;
    }

    if (mod.path) {
      output += `   Path: ${mod.path}\n`;
    }

    output += '\n';
  });

  return output;
}

// AddLangAttribute organization implementation
function getFullLangAttribute() {
  const lang = getLangAttribute();
  const countryCode = navigator.userLanguage || navigator.language || "en-US";
  return lang.split('-')[0] + '-' + countryCode;
}

// Function to trigger accessibility mode
function triggerAccessibilityMode() {
  const doc = getDocument();
  if (doc) {
    // Implementation for triggering accessibility mode
  }
}

/**
 * Generates a dependency report for debugging
 * @param {Object} dependencies - The dependency object
 * @returns {Object} Report containing statistics
 */
function generateDependencyReport(dependencies) {
  return {
    totalDependencies: Object.keys(dependencies).length,
    maxDepth: getDependencyDepth(dependencies),
    graph: renderDependencyGraph(dependencies)
  };
}

/**
 * Renders dependency visualization as HTML with proper accessibility attributes
 * @param {Object} dependencies - The dependency object
 * @returns {string} HTML string with lang attribute for accessibility
 */
function renderDependencyHTML(dependencies) {
  const html = `<!DOCTYPE html>
<html lang="${getFullLangAttribute()}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dependency Visualization</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .dep-tree { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    .dep-item { margin: 5px 0; }
    .nested { padding-left: 20px; border-left: 2px solid #ccc; }
  </style>
</head>
<body>
  <main role="main">
    <h1>Dependency Tree</h1>
    <div class="dep-tree" aria-label="Dependency structure">
      ${renderDependencyGraph(dependencies)}
    </div>
  </main>
</body>
</html>`;
  return html;
}

// Existing function preserved
const existingFunction = () => {
  // Existing function logic
};

const newAccessibleFunction = () => {
  // New function logic to improve accessibility
  // Example: Ensure proper ARIA roles and properties are set

  return true;
};

// Internal storage for landmark regions
const landmarks = [];

// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function createUniqueLandmarkId(baseName) {
  let candidate = baseName;
  if (_usedLandmarkIds.has(candidate)) {
    // Collision handling: add random suffix
    const suffix = Math.floor(Math.random() * 900) + 100;
    candidate = `${baseName}-${suffix}`;
  }
  _usedLandmarkIds.add(candidate);
  return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
  const seen = new Set();
  const result = [];
  for (const lm of landmarks) {
    if (!seen.has(lm.id)) {
      seen.add(lm.id);
      result.push(lm);
    }
  }
  return result;
}

/**
 * Counts total number of dependencies
 * @param {Object} dependencies - The dependency object
 * @returns {number} Total count of dependencies
 */
function countDependencies(dependencies) {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0;
  }

  let count = 0;
  const keys = Object.keys(dependencies);

  keys.forEach(key => {
    const value = dependencies[key];
    count += 1;
    if (typeof value === 'object' && value !== null) {
      count += countDependencies(value);
    }
  });

  return count;
}

module.exports = {
  main,
  getDependencyDepth,
  generateDependencyReport,
  renderDependencyGraph,
  displayModuleStructure,
  getFullLangAttribute,
  triggerAccessibilityMode,
  existingFunction,
  newAccessibleFunction,
  landmarks,
  _usedLandmarkIds,
  createUniqueLandmarkId,
  uniqueLandmarks,
  calculateSum // Added from HEAD
};