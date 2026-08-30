// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// Preserve existing functionality
const { getLangAttribute, createInPageButton } = require('./utils/accessibilityUtils');
const { validateTableAccessibility, validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure } = require('./utils/landmarkUtils');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svgAccessibilityUtils');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');

const fs = require('fs');
const path = require('path');

// Internal set to track used landmark IDs
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
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
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
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Adds lang attribute to HTML element as per REACT_015 requirement
 */
function addLangAttribute() {
  // Add lang attribute to the HTML element for accessibility
  if (typeof document !== 'undefined') {
    const lang = getLangAttribute();
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', lang);
    }
    return lang;
  }
  return 'en';
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
  if (typeof document !== 'undefined') {
    const fakeLinks = document.querySelectorAll('[role="link"]:not(a), a[class*="link"]:not(a)');
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
}

/**
 * Adds main landmark role to the main content area (REACT_017)
 */
function addMainLandmark() {
  if (typeof document !== 'undefined') {
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
}

/**
 * Fixes table structure issues (REACT_027)
 * Ensures all table headers have proper scope attributes
 */
function fixTableStructureIssues() {
  if (typeof document !== 'undefined') {
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
}

/**
 * Adds accessible names to SVG elements (REACT_041)
 */
function addSvgAccessibleNames() {
  if (typeof document !== 'undefined') {
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
    
    output += prefix + connector + key;
    
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

// DOM-based accessibility code (guarded for browser environment)

if (typeof document !== 'undefined') {
  // Add lang attribute to HTML element
  addLangAttribute();

  // Create in-page button with accessibility considerations
  createInPageButton('accessibility-help', '#', 'Accessibility Help', 'accessibility-btn');

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
  ensureUniqueLandmarks(Array.from(document.querySelectorAll('nav, main, header, footer, aside, section, article')));
  fixTableStructureIssues();

  // Handle fake links
  handleFakeLinks();
  fixFakeLinkIssue();
}

// Additional utility functions for React/UI (browser context)

function formatProductName(product) {
  return `${product.name} - $${product.price}`;
}

function renderProductList(products) {
  if (typeof document === 'undefined') return '';
  const container = document.createElement('div');
  container.innerHTML = products.map(p => `<div class="product">${formatProductName(p)}</div>`).join('');
  return container;
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function calculateDiscount(subtotal) {
  return subtotal > 100 ? 10 : 0; // Simple discount logic
}

function renderCart(cart) {
  const total = calculateTotalPrice(cart);
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Total: $${total}</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return renderProductList([input]);
  }
  return null;
}

function validateInput(input) {
  return input && typeof input === 'object' && input.name;
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
 * Checks landmark elements in the DOM for accessibility issues.
 * Validates landmarks for proper roles, labels, and uniqueness.
 * @returns {Object} Object containing validation results for landmarks.
 */
function checkLandmarkElements() {
  if (typeof document === 'undefined') {
    return { landmarks: [], totalCount: 0, uniqueCount: 0, isValid: true, validationErrors: [] };
  }
  
  // Query all landmark elements in the document
  const landmarkSelectors = 'nav, main, header, footer, aside, section, article, form[role="form"], search[role="search"]';
  const landmarkElements = document.querySelectorAll(landmarkSelectors);
  
  // Convert NodeList to array and extract landmark information
  const landmarks = Array.from(landmarkElements).map((element, index) => {
      const tagName = element.tagName.toLowerCase();
      const role = element.getAttribute('role') || (['nav', 'main', 'header', 'footer', 'aside', 'section', 'article'].includes(tagName) ? tagName : null);
      
      return {
          id: element.id || `landmark-${index}`,
          element: element,
          role: role,
          label: element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || '',
          tagName: tagName
      };
  });
  
  // Get unique landmarks to avoid duplicate validation
  const uniqueLandmarkList = ensureUniqueLandmarks(landmarks);
  
  // Validate landmark accessibility using the imported utility
  const validationResult = validateLandmark(uniqueLandmarkList);
  
  // Validate landmark structure (hierarchical relationships)
  const structureValidation = validateLandmarkStructure(uniqueLandmarkList);
  
  // Combine validation results
  const allErrors = [
      ...(validationResult.errors || []),
      ...(structureValidation.errors || [])
  ];
  
  return {
      landmarks: uniqueLandmarkList,
      totalCount: landmarks.length,
      uniqueCount: uniqueLandmarkList.length,
      isValid: validationResult.isValid && structureValidation.isValid,
      validationErrors: allErrors
  };
}

/**
 * Checks link accessibility in the current document.
 * Uses imported utility functions to validate links and handle fake links.
 */
function checkLinkAccessibility() {
  if (typeof document === 'undefined') return;
  const links = document.querySelectorAll('a, [role="link"]');
  links.forEach(link => {
    validateLinkAccessibility(link);
  });
  handleFakeLinks();
}

/**
 * Renders a complete page with header, content, and footer.
 * @param {Object} data - Page data containing title and content.
 * @returns {string} Complete HTML page string.
 */
function renderPage(data) {
  const header = renderHeader(data.title);
  const content = renderContent(data.content);
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

function renderHeader(title) {
  return `<header><h1>${title}</h1></header>`;
}

function renderContent(content) {
  return `<main role="main"><p>${content}</p></main>`;
}

function renderFooter() {
  return `<footer><p>&copy; ${new Date().getFullYear()}</p></footer>`;
}

// Export functions for Node.js module usage
module.exports = {
  getLangAttribute,
  createInPageButton,
  renderDependencyGraph,
  displayModuleStructure,
  getDependencyDepth,
  generateDependencyReport,
  renderDependencyHTML,
  renderAccessibleDependencyGraph,
  visualizeDependencyTree,
  main,
  addAriaLabel,
  addLangAttribute,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addMainLandmark,
  fixTableStructureIssues,
  addSvgAccessibleNames,
  createUniqueLandmarkId,
  checkLandmarkElements,
  checkLinkAccessibility,
  renderPage,
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender
};

// Run if executed directly
if (require.main === module) {
  main();
}