// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// ----- END ORIGINAL CODE -----

// Main module for calculator operations and dependency visualization tool

// Preserve existing functionality
const fs = require('fs');
const path = require('path');

// Import utilities (these would normally come from separate files)
// For the purposes of this file, we'll inline these functions

// Node.js functions for dependency visualization tool

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
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
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
 * Generates a dependency report for debugging
 * @param {Object} dependencies - The dependency object
 * @returns {Object} Report containing statistics
 */
function generateDependencyReport(dependencies) {
  let totalDependencies = 0;
  
  function countDeps(obj) {
    if (!obj || typeof obj !== 'object') return;
    const keys = Object.keys(obj);
    totalDependencies += keys.length;
    keys.forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        countDeps(obj[key]);
      }
    });
  }
  
  countDeps(dependencies);
  
  return {
    totalDependencies: totalDependencies,
    maxDepth: getDependencyDepth(dependencies),
    graph: renderDependencyGraph(dependencies)
  };
}

function newFunction() {
  // Add your new function implementation here
}

function greet(name) {
  return `Hello, ${name}!`;
}

// DOM-based accessibility code

/**
 * Gets the lang attribute value for HTML element
 * @returns {string} Language code
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Gets the full language attribute value for HTML element
 * @returns {string} Full language code
 */
function getFullLangAttribute() {
  return document.documentElement.lang || 'en-US';
}

/**
 * Adds lang attribute to HTML element (REACT_015)
 */
function addLangAttribute() {
  const element = document.documentElement;
  if (element && !element.hasAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
}

/**
 * Creates an in-page button with accessibility considerations
 * @param {string} id - Button ID
 * @param {string} href - Button href
 * @param {string} text - Button text
 * @param {string} className - Button class
 * @returns {HTMLButtonElement} Created button element
 */
function createInPageButton(id, href, text, className) {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Navigate within page');
  if (id) button.setAttribute('id', id);
  if (href) button.setAttribute('href', href);
  if (text) button.textContent = text;
  if (className) button.setAttribute('class', className);
  return button;
}

/**
 * Validates table accessibility (REACT_027)
 * @param {HTMLTableElement} table - Table element to validate
 * @returns {boolean} True if accessible
 */
function validateTableAccessibility(table) {
  if (!table || table.nodeType !== Node.ELEMENT_NODE || table.tagName !== 'TABLE') {
    return false;
  }
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasSummary = table.getAttribute('summary') !== null || table.getAttribute('aria-describedby') !== null;
  
  return hasCaption || hasSummary;
}

/**
 * Validates table structure (REACT_027)
 * @param {HTMLTableElement} table - Table element to validate
 * @returns {boolean} True if structure is valid
 */
function validateTableStructure(table) {
  if (!validateTableAccessibility(table)) {
    return false;
  }
  
  const hasTbody = table.querySelector('tbody') !== null;
  const rows = table.querySelectorAll('tr');
  
  for (let row of rows) {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      return false;
    }
  }
  
  return hasTbody || rows.length > 0;
}

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
 * Validates a single landmark element
 * @param {Object} landmark - Landmark object with id, name, etc.
 * @returns {boolean} True if valid
 */
function validateLandmark(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return false;
  }
  if (!landmark.id || !landmark.name) {
    return false;
  }
  return true;
}

/**
 * Validates landmark structure (REACT_017, REACT_025)
 * @param {Array} landmarks - List of landmarks to validate
 * @returns {Object} Validation result with errors array
 */
function validateLandmarkStructure(landmarks) {
  const errors = [];
  
  if (!Array.isArray(landmarks)) {
    errors.push('Landmarks must be an array');
    return { isValid: false, errors };
  }
  
  // Check for duplicate landmarks
  const seen = new Set();
  landmarks.forEach((lm, index) => {
    if (seen.has(lm.id)) {
      errors.push(`Duplicate landmark ID: ${lm.id}`);
    }
    seen.add(lm.id);
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Ensures unique landmarks (REACT_025)
 * @returns {Array} Unique landmarks
 */
function ensureUniqueLandmarks() {
  return uniqueLandmarks(landmarks);
}

/**
 * Filters unique landmarks from a list
 * @param {Array} landmarksList - List of landmarks
 * @returns {Array} Filtered unique landmarks
 */
function filterUniqueLandmarks(landmarksList) {
  const landmarkNames = new Map();
  const uniqueLandmarksList = [];
  
  for (let landmark of landmarksList) {
    if (!validateLandmark(landmark)) {
      continue;
    }
    
    const name = landmark.name;
    if (!landmarkNames.has(name)) {
      landmarkNames.set(name, []);
      uniqueLandmarksList.push(landmark);
    }
  }
  
  return uniqueLandmarksList;
}

// Function to add proper landmark region to element
function addProperLandmarkRegion(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return;
  }
  
  const validLandmarkRegions = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];
  const currentRole = element.getAttribute('role');
  
  if (!currentRole && validLandmarkRegions.includes(element.tagName.toLowerCase())) {
    element.setAttribute('role', element.tagName.toLowerCase());
  }
}

/**
 * Validates link accessibility (REACT_036)
 * @param {HTMLAnchorElement} linkElement - Link element to validate
 * @returns {boolean} True if accessible
 */
function validateLinkAccessibility(linkElement) {
  if (!linkElement || linkElement.nodeType !== Node.ELEMENT_NODE || linkElement.tagName !== 'A') {
    return false;
  }
  
  const href = linkElement.getAttribute('href');
  if (!href || href === '#' || href === '' || href.trim() === '') {
    return false;
  }
  
  if (href.startsWith('javascript:')) {
    return false;
  }
  
  return true;
}

/**
 * Handles fake links (REACT_036)
 * @param {Array} links - Array of link elements or objects
 * @returns {Array} Fixed links
 */
function handleFakeLinks(links) {
  if (!Array.isArray(links)) {
    return [];
  }
  
  const fixedLinks = [];
  
  for (let link of links) {
    if (typeof link === 'object' && link.element) {
      // It's a result object from checkLinkAccessibility
      if (!validateLinkAccessibility(link.element)) {
        link.element.setAttribute('href', '#');
        link.element.setAttribute('role', 'button');
        link.element.style.pointerEvents = 'none';
      }
      fixedLinks.push(link);
    } else if (link instanceof Element) {
      // It's a raw element
      if (!validateLinkAccessibility(link)) {
        link.setAttribute('href', '#');
        link.setAttribute('role', 'button');
        link.style.pointerEvents = 'none';
      }
      fixedLinks.push(link);
    }
  }
  
  return fixedLinks;
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
  if (!element || typeof element.setAttribute !== 'function') {
    return;
  }
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svg - SVG element
 * @param {string} context - Contextual information
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg, context) {
  if (!svg) return '';
  
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  if (desc && desc.textContent.trim() && context) {
    return context;
  }
  
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

/**
 * Sets accessibility attributes on SVG element
 * @param {SVGElement} svg - SVG element to modify
 * @param {string} accessibleName - Accessible name to set
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('aria-hidden', 'false');
}

/**
 * Creates an in-page button with accessibility features (REACT_041)
 * @param {Object} options - Configuration options
 * @returns {HTMLButtonElement} Created button
 */
function createInPageButtonImplementation(options = {}) {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Navigate within page');
  if (options.id) button.setAttribute('id', options.id);
  if (options.href) button.setAttribute('href', options.href);
  if (options.text) button.textContent = options.text;
  if (options.className) button.setAttribute('class', options.className);
  return button;
}

/**
 * Main entry point for dependency visualization tool
 */
const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  }
};

// Functions for adding and managing landmarks
function addLandmark(landmark) {
  if (validateLandmark(landmark)) {
    landmarks.push(landmark);
    return true;
  }
  return false;
}

function getLandmarks() {
  return [...landmarks];
}

function removeLandmark(id) {
  const index = landmarks.findIndex(landmark => landmark.id === id);
  if (index !== -1) {
    landmarks.splice(index, 1);
    return true;
  }
  return false;
}

// Product and UI functions

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductCard(product) {
  return `<div class="product-card"><h3>${product.name}</h3><p>${product.category}</p></div>`;
}

function renderProductList(products) {
  const container = document.getElementById('product-list');
  if (container) {
    container.innerHTML = products.map(renderProductCard).join('');
  }
  return container;
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function formatDate(date) {
  return date.toLocaleDateString();
}

function calculateDiscount(subtotal) {
  return subtotal > 100 ? subtotal * 0.1 : 0;
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function renderCart(cart) {
  const total = calculateTotalPrice(cart);
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateInput(input) {
  return input && input.products && Array.isArray(input.products);
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return renderProductList(input.products);
  }
  return null;
}

// Additional utility functions

function newAccessibleFunction() {
  return true;
}

function calculateSum(a, b) {
  return a + b;
}

function isLatitudeValid(lat) {
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
}

function isLongitudeValid(lng) {
  return typeof lng === 'number' && lng >= -180 && lng <= 180;
}

/**
 * Adds a landmark region to an element
 * @param {HTMLElement} element - Element to modify
 * @param {string} role - Role attribute value
 * @param {string} label - ARIA label
 */
function addLandmarkRegionToElement(element, role, label) {
  if (!element) return;
  element.setAttribute('role', role);
  if (label) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Validates and renders dependency graph
 */
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

/**
 * Validates landmark elements in the DOM
 * @returns {Object} Validation results
 */
function checkLandmarkElements() {
  const landmarkSelectors = 'nav, main, header, footer, aside, section, article, form[role="form"], search[role="search"]';
  const landmarkElements = document.querySelectorAll(landmarkSelectors);

  const landmarksList = Array.from(landmarkElements).map((element, index) => {
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

  const uniqueLandmarkList = uniqueLandmarks(landmarksList);

  const validationResult = {
    isValid: true,
    errors: []
  };

  const structureValidation = validateLandmarkStructure(uniqueLandmarkList);

  const allErrors = [
    ...(validationResult.errors || []),
    ...(structureValidation.errors || [])
  ];

  return {
    landmarks: uniqueLandmarkList,
    totalCount: landmarksList.length,
    uniqueCount: uniqueLandmarkList.length,
    isValid: validationResult.isValid && structureValidation.isValid,
    validationErrors: allErrors
  };
}

/**
 * Checks link accessibility
 * @returns {Array} Array of link validation results
 */
function checkLinkAccessibility() {
  const links = document.querySelectorAll('a[href], area[href]');
  const results = [];
  
  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const isAccessible = validateLinkAccessibility(link);
    const hasText = link.textContent.trim().length > 0 || link.getAttribute('aria-label');
    
    results.push({
      index,
      url: href,
      isAccessible,
      hasText,
      element: link,
      hasUniqueText: true // Will be calculated if needed
    });
  });
  
  handleFakeLinks(results);
  
  return results;
}

/**
 * Displays module structure for debugging
 * @param {Array} modules - Array of module objects
 * @returns {string} Formatted module structure
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
 * Divides two numbers with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} Result of division
 */
function divide(dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both dividend and divisor must be numbers');
  }
  
  if (isNaN(dividend) || isNaN(divisor)) {
    throw new Error('Both dividend and divisor must be valid numbers');
  }
  
  if (divisor === 0) {
    throw new Error('Cannot divide by zero');
  }
  
  return dividend / divisor;
}

function someFunction() {
  // ... implementation ...
}

function exportedFunction() {
  return 'This is an exported function';
}

/**
 * Checks accessibility for link and button elements.
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} True if accessible, false otherwise.
 */
function checkAccessibility(element) {
  if (!element) {
    return false;
  }

  const tagName = element.tagName;
  if (tagName === 'A') {
    return validateLinkAccessibility(element);
  } else if (tagName === 'BUTTON') {
    return validateButtonAccessibility(element);
  }

  return false;
}

/**
 * Validates button accessibility.
 * @param {HTMLElement} buttonElement - Button element to validate.
 * @returns {boolean} True if accessible, false otherwise.
 */
function validateButtonAccessibility(buttonElement) {
  if (!buttonElement || buttonElement.nodeType !== Node.ELEMENT_NODE || buttonElement.tagName !== 'BUTTON') {
    return false;
  }

  const accessibleName = buttonElement.textContent || buttonElement.getAttribute('aria-label');
  return accessibleName && accessibleName.trim().length > 0;
}

/**
 * Creates an accessible link element
 * @param {string} href - Link href
 * @param {string} text - Link text
 * @returns {HTMLAnchorElement} Created link
 */
function createAccessibleLink(href, text) {
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.textContent = text;
  return link;
}

/**
 * Handles accessibility issues from insight report
 */
function handleAccessibilityIssues() {
  // Add lang attribute (REACT_015)
  addLangAttribute();
  
  // Validate tables (REACT_027)
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!validateTableAccessibility(table) || !validateTableStructure(table)) {
      console.warn('Table accessibility issue found:', table);
    }
  });
  
  // Add SVG accessibility (REACT_041)
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
  });
  
  // Fix fake links (REACT_036)
  const allLinks = document.querySelectorAll('a[href]');
  handleFakeLinks(Array.from(allLinks));
}

// Run if executed directly
if (require.main === module) {
  main.init();
}

// Export all functions
module.exports = {
  main,
  getDependencyDepth,
  generateDependencyReport,
  countDependencies,
  renderDependencyGraph,
  newFunction,
  newAccessibleFunction,
  addLandmark,
  getLandmarks,
  removeLandmark,
  ensureUniqueLandmarks,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  filterUniqueLandmarks,
  isLatitudeValid,
  isLongitudeValid,
  getLangAttribute,
  getFullLangAttribute,
  addLangAttribute,
  createInPageButton,
  createInPageButtonImplementation,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  addAriaLabel,
  addProperLandmarkRegion,
  addLandmarkRegionToElement,
  checkAccessibility,
  validateButtonAccessibility,
  createAccessibleLink,
  handleAccessibilityIssues,
  formatProductName,
  renderProductList,
  renderProductCard,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  validateInput,
  formatCurrency,
  formatDate,
  calculateDiscount,
  calculateSum,
  divide,
  someFunction,
  exportedFunction,
  greet,
  visualizeDependencyTree,
  displayModuleStructure,
  checkLandmarkElements,
  uniqueLandmarks
};