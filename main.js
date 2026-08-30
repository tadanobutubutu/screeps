// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation

// Main module for calculator operations and dependency visualization tool

// Preserve existing functionality
import { getLangAttribute, getFullLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure, ensureUniqueLandmarks } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';

// Main entry point for dependency visualization tool
const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  }
};

// Node.js functions for dependency visualization tool
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
  
  function calculateDepth(obj, depth) {
    if (depth > maxDepth) {
      maxDepth = depth;
    }
    
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        calculateDepth(obj[key], depth + 1);
      }
    }
  }
  
  calculateDepth(dependencies, 0);
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
  
  const currentPrefix = prefix;
  const connector = isLast ? '└── ' : '├── ';
  const childPrefix = prefix + (isLast ? '    ' : '│   ');
  
  let result = '';
  const keys = Object.keys(dependencies);
  
  keys.forEach((key, index) => {
    const isLastKey = index === keys.length - 1;
    const value = dependencies[key];
    
    result += currentPrefix + connector + key;
    
    if (typeof value === 'object' && value !== null) {
      result += '\n' + renderDependencyGraph(value, childPrefix, isLastKey);
    } else {
      result += ': ' + value + '\n';
    }
  });
  
  return result;
}

/**
 * Generates a dependency report for debugging
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

function getLangAttribute() {
  return 'en';
}

function createInPageButton(id, href, text, className) {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Navigate within page');
  if (id) button.setAttribute('id', id);
  if (href) button.setAttribute('href', href);
  if (text) button.textContent = text;
  if (className) button.setAttribute('class', className);
  return button;
}

function main() {
  // Main entry point for the Screeps bot
}

// Main entry point for dependency visualization tool

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

function newFunction() {
  // Add your new function implementation here
}

function greet(name) {
  return `Hello, ${name}!`;
}

// NEW FUNCTION ADDED FROM ORIGIN/MAIN
function newAccessibleFunction() {
  // Add your new function implementation here
  return true;
}

function addLandmarkRegionToElement(element, role, label) {
  // Existing function preserved
  if (!element) return;
  element.setAttribute('role', role);
  if (label) {
    element.setAttribute('aria-label', label);
  }
}

// React functions for accessibility check and reports
function initialize() {
  console.log('Application initialized');
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

// Function to get the lang attribute
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Function to validate table accessibility
function validateTableAccessibility() {
  // ... existing code ...
}

// Function to validate table structure
function validateTableStructure() {
  // ... existing code ...
}

// Function to validate SVG accessibility
function validateSvgAccessibility() {
  // ... existing code ...
}

function ensureUniqueLandmarks() {
  // ... existing code ...
}

function fixFakeLinkIssues() {
  // ... existing code ...
}

function createInPageButton(options = {}) {
  // ... existing code ...
}

function personName(element) {
  // ... existing code ...
}

// Main function to address all accessibility issues
function addressAccessibilityIssues() {
  // ... existing code ...
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.documentElement;
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

// DOM-based accessibility code

// Add lang attribute to HTML element
getLangAttribute();
getFullLangAttribute();

// Create in-page button with accessibility considerations
createInPageButton();

// Validate table structure and accessibility
// Assuming you have a table element with an id of 'myTable'
const table = document.getElementById('myTable');
validateTableAccessibility(table);
validateTableStructure(table);

// Add/fix landmark issues
validateLandmark();
validateLandmarkStructure();
ensureUniqueLandmarks();

// Add accessible names to SVGs
// Assuming you have an SVG element with an id of 'mySvg'
const svg = document.getElementById('mySvg');
const accessibleName = getSvgAccessibleName(svg);
setSvgAttributes(svg, accessibleName);

// Ensure unique landmarks
// This would be handled by the appropriate function call
uniqueLandmarks(landmarks);

// Handle fake links
handleFakeLinks();

// React / UI related functions

// TODO: Add these imported modules to the relevant rendering functions

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductList(products) {
  const container = document.getElementById('product-container');
  container.innerHTML = products.map(p => `<div class="product">${formatProductName(p)}</div>`).join('');
  return container;
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
      <p>Total: $${total.toFixed(2)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return `<div class="valid">${input}</div>`;
  }
  return '<p>Invalid input</p>';
}

function renderPage(data) {
  const header = renderHeader(data.title);
  const content = `<main>${data.content}</main>`;
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

/**
 * Checks landmark elements in the DOM for accessibility issues.
 * Validates landmarks for proper roles, labels, and uniqueness.
 * @returns {Object} Object containing validation results for landmarks.
 */
function checkLandmarkElements() {
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
    const uniqueLandmarkList = uniqueLandmarks(landmarks);

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

// New function or change requested in the issue
function checkLinkAccessibility() {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  const links = document.querySelectorAll('a[href], area[href]');
  const results = [];
  
  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const isAccessible = validateLinkAccessibility(link);
    const hasText = link.textContent.trim().length > 0 || link.getAttribute('aria-label');
    const hasUniqueText = checkUniqueLinkText(link);
    
    results.push({
      index,
      url: href,
      isAccessible,
      hasText,
      hasUniqueText,
      element: link
    });
  });
  
  handleFakeLinks(results);
  
  return results;
}

/**
 * Checks if link text is unique among sibling links
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {boolean} True if link text is unique
 */
function checkUniqueLinkText(link) {
  const siblings = link.parentElement ? link.parentElement.querySelectorAll('a') : [];
  const linkText = link.textContent.trim().toLowerCase();
  
  let count = 0;
  siblings.forEach(sibling => {
    if (sibling.textContent.trim().toLowerCase() === linkText) {
      count++;
    }
  });
  
  return count === 1;
}

// Export utility functions
module.exports = {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
};

// Export utility functions
module.exports = {
  formatCurrency,
  formatDate,
  calculateDiscount,
  validateInput
};

// Export component functions
module.exports = {
  renderHeader,
  renderFooter,
  renderProductCard
};

// Export state
module.exports = {
  state,
  updateState
};

// Export UI / product functions
module.exports = {
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage
};

// Export the new function
module.exports = { checkLinkAccessibility, renderDependencyGraph, displayModuleStructure, checkLandmarkElements };

// ... other exports ...

// Function to add a landmark, using the following order: validate and add to storage
function addLandmark(landmark) {
  if (validateLandmark(landmark)) {
    landmarks.push(landmark);
    return true;
  }
  return false;
}

// Function to get all landmarks
function getLandmarks() {
  return [...landmarks];
}

// Function to remove a landmark by ID
function removeLandmark(id) {
  const index = landmarks.findIndex(landmark => landmark.id === id);
  if (index !== -1) {
    landmarks.splice(index, 1);
    return true;
  }
  return false;
}

function isLatitudeValid(lat) {
  // Existing validation function preserved
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
}

function isLongitudeValid(lng) {
  // Existing validation function preserved
  return typeof lng === 'number' && lng >= -180 && lng <= 180;
}

// REACT_015: Add lang attribute to HTML element

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Navigate within page');
  return button;
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table || table.nodeType !== Node.ELEMENT_NODE || table.tagName !== 'TABLE') {
    return false;
  }
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasSummary = table.getAttribute('summary') !== null || table.getAttribute('aria-describedby') !== null;
  
  return hasCaption || hasSummary;
}

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

// REACT_041: Add accessible names to SVGs
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

function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('aria-hidden', 'false');
}

// REACT_025: Ensure unique landmarks
function filterUniqueLandmarks(landmarksList) {
  const landmarkNames = new Map();
  const uniqueLandmarks = [];
  
  for (let landmark of landmarksList) {
    if (!validateLandmark(landmark)) {
      continue;
    }
    
    const name = landmark.name;
    if (!landmarkNames.has(name)) {
      landmarkNames.set(name, []);
      uniqueLandmarks.push(landmark);
    }
  }
  
  return uniqueLandmarks;
}

// REACT_036: Fix fake link issues
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

function handleFakeLinks(links) {
  const fixedLinks = [];
  
  for (let link of links) {
    if (!validateLinkAccessibility(link)) {
      link.setAttribute('href', '#');
      link.setAttribute('role', 'button');
      link.style.pointerEvents = 'none';
      fixedLinks.push(link);
    } else {
      fixedLinks.push(link);
    }
  }
  
  return fixedLinks;
}

// REACT_037: Add proper landmark regions
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

// New function to visualize the dependency tree
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

function validateLandmark(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return false;
  }
  if (!landmark.id || !landmark.name) {
    return false;
  }
  return true;
}

// Additional exports requested
function calculateSum(a, b) {
  return a + b;
}

/**
 * Validates landmark accessibility
 */
function validateLandmark() {
  // Implementation for landmark validation
}

/**
 * Validates landmark structure
 */
function validateLandmarkStructure() {
  // Implementation for landmark structure validation
}

/**
 * Creates an in-page button with accessibility considerations
 */
function createInPageButtonImplementation() {
  // Implementation for creating in-page button
}

// New functions added based on the TODO

/**
 * Ensures that an element has an id attribute. If missing, generates a unique id.
 * @param {HTMLElement} element - The element to check.
 * @returns {string|null} The element's id or null if element is invalid.
 */
function ensureElementHasId(element) {
  if (!element || typeof element.setAttribute !== 'function') {
    return null;
  }
  if (!element.id) {
    const id = 'generated-id-' + Math.random().toString(36).substr(2, 9);
    element.id = id;
  }
  return element.id;
}

/**
 * Adds an aria-label to an element.
 * @param {HTMLElement} element - The element to add the label to.
 * @param {string} label - The accessible label text.
 */
function addAriaLabel(element, label) {
  if (!element || typeof element.setAttribute !== 'function') {
    return;
  }
  element.setAttribute('aria-label', label);
}

/**
 * Handles fake links appropriately
 */
function handleFakeLinksImplementation() {
  // Implementation for handling fake links
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  // Code to fix accessibility issues as per the insight report
}

/**
 * Divides two number with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} Result of division
 */
function divide(dividend, divisor) {
    // Check if inputs are valid numbers
    if (typeof dividend !== 'number' || typeof divisor !== 'number') {
        throw new Error('Both dividend and divisor must be numbers');
    }
    
    // Check for NaN
    if (isNaN(dividend) || isNaN(divisor)) {
        throw new Error('Both dividend and divisor must be valid numbers');
    }
    
    // Check for division by zero
    if (divisor === 0) {
        throw new Error('Cannot divide by zero');
    }
    
    return dividend / divisor;
}

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductCard(product) {
  return `<div class="product-card"><h3>${product.name}</h3><p>${product.category}</p></div>`;
}

function renderProductList(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = products.map(renderProductCard).join('');
  return container;
}

function calculateDiscount(subtotal) {
  return subtotal > 100 ? subtotal * 0.1 : 0;
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function formatDate(date) {
  return date.toLocaleDateString();
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

function renderPage() {
  // Implementation for rendering the page
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

// Export UI / product functions

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
  isLatitudeValid,
  isLongitudeValid,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  filterUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegion,
  displayModuleStructure,
  generateDependencyReport,
  visualizeDependencyTree,
  checkLandmarkElements,
  checkLinkAccessibility,
  addAriaLabel,
  fixAccessibilityIssues,
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage,
  someFunction,
  exportedFunction,
  greet,
  checkAccessibility,
  calculateSum
};

// Run if executed directly
if (require.main === module) {
  main.init();
}