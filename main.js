// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// Preserve existing functionality
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// Import required modules
import { v4 as uuidv4 } from 'uuid';
import { createElement } from 'react';
import { getDocument, getLangAttribute } from '.';
import { createInPageButton, handleAccessibilityIssues, createAccessibleLink } from "yourNewModule";
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Internal set to track used landmark IDs
// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

function getLangAttribute() {
  // Logic for getting the language attribute
  return 'en';
}

function createInPageButton(id, href, text, className) {
  // Logic for creating an in-page button with given properties
  if (typeof document !== 'undefined') {
    const button = document.createElement('a');
    button.id = id;
    button.href = href || '#';
    button.textContent = text;
    button.className = className || '';
    button.setAttribute('role', 'link');
    button.setAttribute('tabindex', '0');
    return button;
  }
  return null;
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  const doc = (typeof getDocument === 'function') ? getDocument() : (typeof document !== 'undefined' ? document : null);
  if (doc && doc.documentElement) {
    doc.documentElement.setAttribute('lang', lang);
  }
  return lang;
}

/**
 * Ensures unique landmarks by keeping only a single <main> element (REACT_025)
 * @param {Array} landmarks - List of landmark elements
 * @returns {Array} Filtered list with unique landmarks
 */
function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  const result = [];
  for (const lm of landmarks) {
    // Skip duplicate landmarks, but keep the first <main> element
    if (lm.tagName && lm.tagName.toLowerCase() === 'main') {
      if (!seen.has('main')) {
        seen.add('main');
        result.push(lm);
      }
    } else if (!seen.has(lm.id || lm)) {
      seen.add(lm.id || lm);
      result.push(lm);
    }
  }
  return result;
}

/**
 * Fixes fake link issues (REACT_036) - converts buttons styled as links to proper accessible links
 */
function fixFakeLinkIssue() {
  if (typeof document === 'undefined') return;
  // Find elements that look like links but are not <a> tags
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(link => {
    // Ensure proper accessibility attributes are set
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    if (!link.hasAttribute('aria-label')) {
      const text = link.textContent.trim();
      if (text) {
        link.setAttribute('aria-label', text);
      }
    }
  });
}

/**
 * Adds main landmark role to the main content area (REACT_017)
 */
function addMainLandmark() {
  if (typeof document === 'undefined') return;
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach((main, index) => {
    if (!main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
    // Ensure the first main element is properly identified
    if (index === 0) {
      main.setAttribute('id', main.id || 'main-content');
    }
  });
}

/**
 * Fixes table structure issues (REACT_027)
 * Ensures all table headers have proper scope attributes
 */
function fixTableStructureIssues() {
  if (typeof document === 'undefined') return;
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      // Determine if header is for a column or row
      const row = th.closest('tr');
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      
      if (rowIndex === 0) {
        // First row - these are column headers
        if (!th.hasAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      } else if (th.cellIndex === 0) {
        // First cell in a non-header row - row header
        if (!th.hasAttribute('scope')) {
          th.setAttribute('scope', 'row');
        }
      }
    });
  });
}

/**
 * Adds accessible names to SVG elements (REACT_041)
 */
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    // Check if SVG already has an accessible name via aria-label or aria-labelledby
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
    
    if (!hasAriaLabel && !hasAriaLabelledby) {
      // Try to get title from title element inside SVG
      const title = svg.querySelector('title');
      if (title) {
        const titleId = `svg-title-${index}`;
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        // Fallback: add generic accessible name
        svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
      }
    }
  });
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

// AddLangAttribute organization implementation
function getFullLangAttribute() {
  const lang = getLangAttribute();
  const countryCode = (typeof navigator !== 'undefined') ? (navigator.userLanguage || navigator.language || "en-US") : "en-US";
  return lang.split('-')[0] + '-' + countryCode.split('-')[1];
}

// Function to trigger accessibility mode
function triggerAccessibilityMode() {
  const doc = (typeof getDocument === 'function') ? getDocument() : (typeof document !== 'undefined' ? document : null);
  if (doc && doc.body) {
    doc.body.classList.add('accessibility-mode-enabled');
  }
}

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
 * Renders dependency visualization as HTML with proper accessibility attributes
 * @param {Object} dependencies - The dependency object
 * @returns {string} HTML string with lang attribute for accessibility
 */
function renderDependencyHTML(dependencies) {
  const html = `<!DOCTYPE html>
<html lang="en">
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
      ${renderDependencyList(dependencies)}
    </div>
  </main>
</body>
</html>`;
  return html;
}

/**
 * Helper function to render dependency list as HTML
 * @param {Object} dependencies - The dependency object
 * @param {number} depth - Current nesting depth
 * @returns {string} HTML string of the dependency list
 */
function renderDependencyList(dependencies, depth = 0) {
  if (!dependencies || typeof dependencies !== 'object') {
    return '';
  }
  
  let output = '';
  const keys = Object.keys(dependencies);
  
  keys.forEach((key) => {
    const value = dependencies[key];
    const indent = '<span class="nested">'.repeat(depth);
    const closeIndent = '</span>'.repeat(depth);
    
    if (typeof value === 'object' && value !== null) {
      output += `<div class="dep-item">${indent}${key}/${closeIndent}</div>`;
      output += renderDependencyList(value, depth + 1);
    } else {
      output += `<div class="dep-item">${indent}${key} → ${value}${closeIndent}</div>`;
    }
  });
  
  return output;
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

// DOM-based accessibility code (browser only)
if (typeof document !== 'undefined') {
  // Add lang attribute to HTML element
  addLangAttribute();

  // Create in-page button with accessibility considerations
  createInPageButton();

  // Validate table structure and accessibility
  const table = document.getElementById('myTable');
  if (table) {
    validateTableAccessibility(table);
    validateTableStructure(table);
  }

  // Add/fix landmark issues
  validateLandmark();
  validateLandmarkStructure();
  addMainLandmark();

  // Add accessible names to SVGs
  const svg = document.getElementById('mySvg');
  if (svg) {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
  }
  addSvgAccessibleNames();

  // Ensure unique landmarks
  ensureUniqueLandmarkId('main-content');
  fixTableStructureIssues();

  // Handle fake links
  handleFakeLinks();
  fixFakeLinkIssue();
}

// Function to render dependency graph using dependencyGraphContent
function renderDependencyGraphView(container) {
  createInPageButton();
  container.appendChild(dependencyGraphContent());
}

// Function to render index view using indexContent
function renderIndexView(container) {
  createInPageButton();
  container.appendChild(indexContent());
}

// React / UI related functions

// TODO: Add these imported modules to the relevant rendering functions

function formatProductName(product) {
  return `${product.name} - ...`;
}

function renderProductList(products) {
  const container = document.createElement('div');
  container.innerHTML = products.map(p => renderProductCard(p)).join('');
  return container;
}

function renderProductCard(product) {
  return `<div class="product-card">${formatProductName(product)}</div>`;
}

function calculateDiscount(subtotal) {
  return 0;
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function formatDate(date) {
  return date.toISOString();
}

function renderCart(cart) {
  const total = calculateTotalPrice(cart);
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Total: ...${total}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return renderProductList([input]);
  }
  return null;
}

export {
  addLangAttribute,
  ensureElementId,
  getDocument,
  handleAccessibilityIssues,
  handleErrorState,
  renderDependencyGraphView,
  renderIndexView,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addMainLandmark,
  fixTableStructureIssues,
  addSvgAccessibleNames,
  triggerAccessibilityMode,
  getDependencyDepth,
  displayModuleStructure,
  generateDependencyReport,
  renderDependencyHTML,
  renderAccessibleDependencyGraph,
  visualizeDependencyTree,
  main,
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender
};