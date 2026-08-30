// Import required modules
import { v4 as uuidv4 } from 'uuid';
import { createElement } from 'react';
import { getDocument, getLangAttribute } from '.';
import { createInPageButton, handleAccessibilityIssues, createAccessibleLink } from "yourNewModule";
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';


// Helper function to get document object (cross-environment support)
function getDocument() {
  if (typeof document !== 'undefined') {
    return document;
  }
  return null;
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  const doc = getDocument();
  if (doc && doc.documentElement) {
    if (lang !== 'en') {
      doc.documentElement.setAttribute('lang', lang);
    }
  }
  return lang;
}

function getLangAttribute() {
  // Logic for getting the language attribute
  const doc = getDocument();
  if (doc && doc.documentElement) {
    return doc.documentElement.getAttribute('lang') || 'en';
  }
  return 'en';
}

function createInPageButton(id, href, text, className) {
  // Logic for creating an in-page button with given properties
  const button = document ? document.createElement('button') : {};
  if (button) {
    button.id = id || '';
    button.textContent = text || '';
    button.className = className || '';
    if (href) {
      button.onclick = () => { window.location.href = href; };
    }
  }
  return button;
}

// AddLangAttribute organization implementation
function getFullLangAttribute() {
  const lang = getLangAttribute();
  const userLang = typeof navigator !== 'undefined' ? (navigator.userLanguage || navigator.language || 'en-US') : 'en-US';
  const baseLang = lang.split('-')[0];
  return baseLang + '-' + userLang.split('-')[1];
}

// Function to trigger accessibility mode
function triggerAccessibilityMode() {
  const doc = getDocument();
  if (doc && doc.body) {
    doc.body.setAttribute('data-accessibility-mode', 'enabled');
  }
}

// Implement the handleErrorState function to handle the new accessibility issue
function handleErrorState(errorElement, container, trigger = false) {
  if (!errorElement) return;

  const doc = getDocument();
  if (!doc) return;

  // Wrap the error in a <section> element
  const errorSection = doc.createElement('section');
  errorSection.setAttribute('role', 'alert');
  errorSection.setAttribute('aria-live', 'assertive');

  if (typeof errorElement === 'string') {
    errorSection.textContent = errorElement;
  } else if (errorElement.textContent) {
    errorSection.textContent = errorElement.textContent;
  } else {
    errorSection.textContent = String(errorElement);
  }

  if (container) {
    const errorContainer = doc.createElement('div');
    errorContainer.setAttribute('class', 'error-container');
    errorContainer.setAttribute('role', 'alert');
    errorContainer.appendChild(errorSection);
    container.appendChild(errorContainer);
  }

  // If trigger is true, trigger the accessibility mode
  if (trigger) {
    triggerAccessibilityMode();
  }
}

// Implement the handleAccessibilityError function that wraps handleErrorState with triggering the accessibility mode
function handleAccessibilityError(errorElement, container) {
  handleErrorState(errorElement, container, true);
}

// Function to count dependencies
function countDependencies() {
  // TODO: Implement a function to count dependencies
  try {
    if (dependencyGraphContent && dependencyGraphContent.dependencies) {
      if (Array.isArray(dependencyGraphContent.dependencies)) {
        return dependencyGraphContent.dependencies.length;
      }
      if (typeof dependencyGraphContent.dependencies === 'object') {
        return Object.keys(dependencyGraphContent.dependencies).length;
      }
    }
    return 0;
  } catch (error) {
    console.error('Error counting dependencies:', error);
    return 0;
  }
}

// Function to render dependency graph using dependencyGraphContent
function renderDependencyGraphFromContent(container) {
  if (typeof createInPageButton === 'function') {
    createInPageButton('dep-graph-btn', '#dependency-graph', 'View Dependency Graph', 'btn-dep-graph');
  }
  return dependencyGraphContent ? dependencyGraphContent.render(container) : '';
}

// Function to render index view using indexContent
function renderIndexViewFromContent(container) {
  if (typeof createInPageButton === 'function') {
    createInPageButton('index-btn', '#index', 'View Index', 'btn-index');
  }
  return indexContent ? indexContent.render(container) : '';
}

// Additional helper function for ensuring element has an ID
function ensureElementId(element, baseId = 'element') {
  if (!element) return null;
  if (!element.id) {
    element.id = baseId + '-' + uuidv4();
  }
  return element.id;
}

// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----
// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation


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
  
  keys.forEach((key, index) => {
    const isLastItem = index === keys.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const value = dependencies[key];
    
    output += `${prefix}${connector}${key}`;
    
    if (typeof value === 'object' && value !== null) {
      output += '/\n';
      const extension = isLast ? '    ' : '│   ';
      output += renderDependencyGraph(value, prefix + extension, isLastItem);
    } else {
      output += ` -> ${value}\n`;
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
 * Builds a navigable, screen-reader-friendly textual representation
 * of the dependency graph using semantic newlines and clear prefixes.
 *
 * Accessibility improvements:
 * - Uses headings and consistent prefixes so screen readers can
 *   announce the structure predictably.
 * - Avoids relying on box-drawing characters alone; provides a
 *   textual depth indicator (e.g., "Depth N:") for each level.
 * - Includes plain-text connectors ("child of", "leaf") so the
 *   hierarchy is understandable without visual rendering.
 *
 * @param {Object} dependencies - The dependency object
 * @param {number} depth - Current depth in the tree
 * @returns {string} Accessible textual representation of the dependency graph
 */
function renderAccessibleDependencyGraph(dependencies, depth = 0) {
  if (!dependencies || typeof dependencies !== 'object') {
    return '';
  }

  const keys = Object.keys(dependencies);
  if (keys.length === 0) {
    return `Depth ${depth}: (empty)\n`;
  }

  let output = `Depth ${depth}: (${keys.length} item${keys.length === 1 ? '' : 's'})\n`;

  keys.forEach((key, index) => {
    const value = dependencies[key];
    const isLast = index === keys.length - 1;
    const position = isLast ? 'last' : 'not last';

    if (typeof value === 'object' && value !== null) {
      output += `  - ${key} (has ${Object.keys(value).length} child${Object.keys(value).length === 1 ? '' : 's'}, ${position})\n`;
      output += renderAccessibleDependencyGraph(value, depth + 1);
    } else {
      output += `  - ${key} (leaf, value: ${value}, ${position})\n`;
    }
  });

  return output;
}

// New function to visualize the dependency tree
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

/**
 * Main processing function
 */
function main() {
  const sampleDependencies = {
    'express': '4.18.2',
    'lodash': {
      'isArray': '4.0.0',
      'merge': {
        'isObject': '4.0.0'
      }
    }
  };
  
  console.log('Dependency Graph:');
  console.log(renderDependencyGraph(sampleDependencies));
  
  console.log('Depth:', getDependencyDepth(sampleDependencies));
}

module.exports = {
  getLangAttribute,
  createInPageButton,
  renderDependencyGraph,
  displayModuleStructure,
  getDependencyDepth,
  generateDependencyReport,
  renderAccessibleDependencyGraph,
  main,
  visualizeDependencyTree,
  addLangAttribute,
  ensureElementId,
  triggerAccessibilityMode,
  handleErrorState,
  handleAccessibilityError,
  getFullLangAttribute,
  countDependencies,
  renderDependencyGraphFromContent,
  renderIndexViewFromContent
};

// Run if executed directly
if (require.main === module) {
  main();
}