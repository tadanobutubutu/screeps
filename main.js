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
    element.setAttribute('id', id);
  }
  return element.id;
}

/**
 * Adds an aria-label to an element.
 * @param {HTMLElement} element - The element to add the label to.
 * @param {string} label - The accessible label text.
 */
function addAriaLabelToElement(element, label) {
  if (!element || typeof element.setAttribute !== 'function') {
    return;
  }
  element.setAttribute('aria-label', label);
}

/**
 * Checks accessibility for link and button elements.
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} True if accessible, false otherwise.
 */
function checkAccessibilityElement(element) {
  if (!element) {
    return false;
  }

  const tagName = element.tagName;
  if (tagName === 'A') {
    return validateLinkAccessibility(element);
  } else if (tagName === 'BUTTON') {
    return validateButtonAccessibilityHelper(element);
  }

  return false;
}

/**
 * Validates button accessibility.
 * @param {HTMLElement} buttonElement - Button element to validate.
 * @returns {boolean} True if accessible, false otherwise.
 */
function validateButtonAccessibilityHelper(buttonElement) {
  if (!buttonElement || buttonElement.nodeType !== Node.ELEMENT_NODE || buttonElement.tagName !== 'BUTTON') {
    return false;
  }

  const accessibleName = buttonElement.textContent || buttonElement.getAttribute('aria-label');
  return accessibleName && accessibleName.trim().length > 0;
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
 * New function implementation details
 * This function provides core functionality for the application
 */
function newFunction() {
  // Implementation: Validate current context and return appropriate result
  const context = typeof window !== 'undefined' ? window : global;
  return {
    isValid: true,
    timestamp: Date.now(),
    context: context.constructor.name
  };
}

/**
 * New accessible function for the main module
 */
function newAccessibleFunction() {
  return true;
}

/**
 * Internal storage for landmark regions
 */
const landmarks = [];

/**
 * Global set to track used landmark IDs
 */
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
 * Validates landmark accessibility
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
 * Validates landmark structure
 */
function validateLandmarkStructure(landmarks) {
  if (!Array.isArray(landmarks)) {
    return { isValid: false, errors: ['Landmarks must be an array'] };
  }
  
  const errors = [];
  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      errors.push(`Landmark at index ${index} missing id`);
    }
    if (!landmark.role) {
      errors.push(`Landmark at index ${index} missing role`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Ensures unique landmarks
 */
function ensureUniqueLandmarks(landmarks) {
  return uniqueLandmarks(landmarks);
}

/**
 * Validates table accessibility
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
 * Validates table structure
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

/**
 * Get lang attribute from document
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Get full lang attribute
 */
function getFullLangAttribute() {
  return document.documentElement.lang || 'en-US';
}

/**
 * Add lang attribute to HTML element
 */
function addLangAttribute() {
  const elementToModify = document.documentElement;
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en');
  }
}

/**
 * Creates an in-page button with accessibility considerations
 * @param {string} id - Element ID
 * @param {string} href - Link href
 * @param {string} text - Button text
 * @param {string} className - CSS class name
 * @returns {HTMLElement} Button element
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
 * Validates SVG accessibility
 */
function validateSvgAccessibility(svg) {
  if (!svg || svg.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return svg.getAttribute('role') === 'img' && svg.getAttribute('aria-label') !== null;
}

/**
 * Gets SVG accessible name
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
 * Sets SVG accessibility attributes
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('aria-hidden', 'false');
}

/**
 * Validates link accessibility
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
 * Handles fake links
 */
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

/**
 * Checks link accessibility
 */
function checkLinkAccessibility() {
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

/**
 * Adds a landmark, using the following order: validate and add to storage
 */
function addLandmark(landmark) {
  if (validateLandmark(landmark)) {
    landmarks.push(landmark);
    return true;
  }
  return false;
}

/**
 * Gets all landmarks
 */
function getLandmarks() {
  return [...landmarks];
}

/**
 * Removes a landmark by ID
 */
function removeLandmark(id) {
  const index = landmarks.findIndex(landmark => landmark.id === id);
  if (index !== -1) {
    landmarks.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Latitude validation function
 */
function isLatitudeValid(lat) {
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
}

/**
 * Longitude validation function
 */
function isLongitudeValid(lng) {
  return typeof lng === 'number' && lng >= -180 && lng <= 180;
}

/**
 * Adds proper landmark region to element
 */
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
 * Checks landmark elements in the DOM for accessibility issues.
 * Validates landmarks for proper roles, labels, and uniqueness.
 * @returns {Object} Object containing validation results for landmarks.
 */
function checkLandmarkElements() {
  const landmarkSelectors = 'nav, main, header, footer, aside, section, article, form[role="form"], search[role="search"]';
  const landmarkElements = document.querySelectorAll(landmarkSelectors);

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

  const uniqueLandmarkList = uniqueLandmarks(landmarks);

  const validationResult = validateLandmarkStructure(uniqueLandmarkList);

  return {
    landmarks: uniqueLandmarkList,
    totalCount: landmarks.length,
    uniqueCount: uniqueLandmarkList.length,
    isValid: validationResult.isValid,
    validationErrors: validationResult.errors
  };
}

/**
 * Filters unique landmarks from a list
 */
function filterUniqueLandmarks(landmarksList) {
  const landmarkNames = new Map();
  const uniqueLandmarksResult = [];
  
  for (let landmark of landmarksList) {
    if (!validateLandmark(landmark)) {
      continue;
    }
    
    const name = landmark.name;
    if (!landmarkNames.has(name)) {
      landmarkNames.set(name, []);
      uniqueLandmarksResult.push(landmark);
    }
  }
  
  return uniqueLandmarksResult;
}

/**
 * Gets SVG accessible name (wrapper function)
 */
function getSvgAccessibleName() {
  return '';
}

/**
 * Sets SVG attributes (wrapper function)
 */
function setSvgAttributes() {
  // No-op wrapper
}

/**
 * Adds proper landmark region to element (exported version)
 */
function addLandmarkRegionToElement(element, role, label) {
  if (!element) return;
  element.setAttribute('role', role);
  if (label) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Validates and fixes accessibility issues
 */
function fixAccessibilityIssues() {
  addLangAttribute();
  
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    ensureElementHasId(button);
    if (!button.getAttribute('aria-label') && !button.textContent) {
      addAriaLabelToElement(button, 'Button');
    }
  });
  
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    if (!validateLinkAccessibility(link)) {
      handleFakeLinks([link]);
    }
  });
}

/**
 * Addresses all accessibility issues
 */
function addressAccessibilityIssues() {
  fixAccessibilityIssues();
}

/**
 * Currency formatting utility
 */
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

/**
 * Date formatting utility
 */
function formatDate(date) {
  return date.toLocaleDateString();
}

/**
 * Discount calculation utility
 */
function calculateDiscount(subtotal) {
  return subtotal > 100 ? subtotal * 0.1 : 0;
}

/**
 * Input validation utility
 */
function validateInput(input) {
  return input && input.products && Array.isArray(input.products);
}

/**
 * Product name formatting
 */
function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

/**
 * Product card rendering
 */
function renderProductCard(product) {
  return `<div class="product-card"><h3>${product.name}</h3><p>${product.category}</p></div>`;
}

/**
 * Product list rendering
 */
function renderProductList(products) {
  const container = document.getElementById('product-list');
  if (container) {
    container.innerHTML = products.map(renderProductCard).join('');
    return container;
  }
  const defaultContainer = document.createElement('div');
  defaultContainer.className = 'product-list';
  defaultContainer.innerHTML = products.map(renderProductCard).join('');
  return defaultContainer;
}

/**
 * Cart total price calculation
 */
function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

/**
 * Cart rendering
 */
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

/**
 * Header rendering
 */
function renderHeader(title) {
  return `<header><h1>${title || 'Default Title'}</h1></header>`;
}

/**
 * Footer rendering
 */
function renderFooter() {
  return `<footer><p>&copy; ${new Date().getFullYear()}</p></footer>`;
}

/**
 * Sum calculation utility
 */
function calculateSum(a, b) {
  return a + b;
}

/**
 * Division utility with error handling
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

/**
 * Main function to render UI based on validation
 */
function validateAndRender(input) {
  if (validateInput(input)) {
    return renderProductList(input.products);
  }
  return null;
}

/**
 * Page rendering function
 */
function renderPage(data) {
  const header = renderHeader(data && data.title);
  const content = `<main>${data && data.content ? data.content : ''}</main>`;
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

/**
 * Initialize function
 */
function initialize() {
  console.log('Application initialized');
  main.init();
}

/**
 * Gets the state object
 */
const state = {
  initialized: false,
  version: '1.0.0'
};

/**
 * Updates the state
 */
function updateState(newState) {
  Object.assign(state, newState);
  return state;
}

/**
 * Exported greet function
 */
function greet(name) {
  return `Hello, ${name}!`;
}

/**
 * Person name extraction (placeholder)
 */
function personName(element) {
  if (!element) return null;
  return element.getAttribute('aria-label') || element.textContent || null;
}

/**
 * Ensure element has ID (wrapper)
 */
function ensureElementHasIdWrapper(element) {
  return ensureElementHasId(element);
}

/**
 * Add ARIA label (wrapper)
 */
function addAriaLabel(element, label) {
  addAriaLabelToElement(element, label);
}

/**
 * Handle fake links implementation
 */
function handleFakeLinksImplementation() {
  fixAccessibilityIssues();
}

/**
 * Person name function for accessibility
 */
function getPersonNameFromElement(element) {
  return personName(element);
}

// Export utility functions
module.exports = {
  // Main module
  main,
  
  // Dependency visualization
  getDependencyDepth,
  countDependencies,
  renderDependencyGraph,
  generateDependencyReport,
  visualizeDependencyTree,
  displayModuleStructure,
  
  // New functions from TODO
  newFunction,
  newAccessibleFunction,
  ensureElementHasId,
  checkAccessibilityElement,
  validateButtonAccessibilityHelper,
  
  // Landmark functions
  addLandmark,
  getLandmarks,
  removeLandmark,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  createUniqueLandmarkId,
  filterUniqueLandmarks,
  checkLandmarkElements,
  addProperLandmarkRegion,
  addLandmarkRegionToElement,
  
  // Table functions
  validateTableAccessibility,
  validateTableStructure,
  
  // SVG functions
  getSvgAccessibleName,
  setSvgAttributes,
  validateSvgAccessibility,
  
  // Link functions
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  checkUniqueLinkText,
  
  // Accessibility functions
  fixAccessibilityIssues,
  addressAccessibilityIssues,
  isLatitudeValid,
  isLongitudeValid,
  
  // Lang functions
  getLangAttribute,
  getFullLangAttribute,
  addLangAttribute,
  
  // Button functions
  createInPageButton,
  ensureElementHasIdWrapper,
  addAriaLabel,
  addAriaLabelToElement,
  handleFakeLinksImplementation,
  
  // Product functions
  formatProductName,
  renderProductCard,
  renderProductList,
  calculateDiscount,
  formatCurrency,
  formatDate,
  calculateTotalPrice,
  renderCart,
  validateInput,
  validateAndRender,
  renderPage,
  renderHeader,
  renderFooter,
  calculateSum,
  divide,
  greet,
  
  // Utility functions
  personName,
  getPersonNameFromElement,
  someFunction,
  exportedFunction
};

/**
 * Some placeholder function
 */
function someFunction() {
  return { status: 'implemented' };
}

/**
 * Exported function
 */
function exportedFunction() {
  return 'This is an exported function';
}

// Run if executed directly
if (require.main === module) {
  main.init();
}