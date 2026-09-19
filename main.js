// Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// Preserve existing functionality
import { getLangAttribute, createInPageButton, createAccessibleLink, handleAccessibilityIssues } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function createUniqueLandmarkId(baseName) {
    let candidate = baseName;
    let counter = 1;
    while (_usedLandmarkIds.has(candidate)) {
        const suffix = Math.floor(Math.random() * 10);
        candidate = `${baseName}-${counter}-${suffix}`;
        counter++;
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
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
  });
}

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
  const elementToModify = document.documentElement;
  if (elementToModify && !elementToModify.hasAttribute('lang')) {
    elementToModify.setAttribute('lang', 'en');
  }
}

// DOM-based accessibility code

// Add lang attribute to HTML element
addLangAttribute();

// Create in-page button with accessibility considerations (REACT_041)
createInPageButton();

// Validate table structure and accessibility
function validateTable(table) {
    if (table) {
        validateTableAccessibility(table);
        validateTableStructure(table);
    }
}

// Add/fix landmark issues (REACT_017)
validateLandmark();
validateLandmarkStructure();

// Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
    const unique = uniqueLandmarks(landmarks);
    return unique.map(lm => ({
        ...lm,
        id: lm.id || createUniqueLandmarkId(lm.role || 'landmark')
    }));
}

// Add accessible names to SVGs
function processSvgAccessibility(svg) {
    if (svg) {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
    }
}

// Handle fake links accessibility
handleFakeLinks();

// React / UI related functions

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

// React / UI related functions

// Utility function to format product name
function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

// Render the product list with accessibility
function renderProductList(products) {
  const container = document.createElement('div');
  container.innerHTML = products.map(p => `<div class="product">${formatProductName(p)}</div>`).join('');
  return container;
}

// Calculate total price with discount
function calculateTotalPrice(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = calculateDiscount(subtotal);
    return subtotal - discount;
}

// Render cart with accessibility
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

// Validate input and render appropriate message
function validateAndRender(input) {
  if (validateInput(input)) {
    return `<div class="valid">${input}</div>`;
  }
  return '<p>Invalid input</p>';
}

// Render full page with accessibility landmarks
function renderPage(data) {
  const header = renderHeader(data.title);
  const content = data.content || '';
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

// Utility functions
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateDiscount(subtotal) {
  return subtotal > 100 ? subtotal * 0.1 : 0;
}

function validateInput(input) {
  return input !== null && input !== undefined && String(input).trim().length > 0;
}

// Component functions
function renderHeader(title) {
  return `<header><h1>${title}</h1></header>`;
}

function renderFooter() {
  return `<footer><p>&copy; 2024</p></footer>`;
}

function renderProductCard(product) {
  return `<div class="product-card">${product.name} - ${formatCurrency(product.price)}</div>`;
}

// State management
const state = {
  products: [],
  cart: [],
  user: null
};

function updateState(newState) {
  Object.assign(state, newState);
}

// New function for checking link accessibility
function checkLinkAccessibility() {
  const links = document.querySelectorAll('a, button');
  return validateLinkAccessibility(links);
}

/**
 * Checks link and button accessibility across the document.
 * Validates all anchor elements and button elements to ensure they meet
 * accessibility standards (e.g., fake links converted, accessible names present).
 * @returns {Object} A report describing the link/button accessibility issues found.
 */
function checkLinkAndButtonAccessibility() {
  const issues = [];

  // Validate anchor (<a>) elements
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const linkIssues = validateLinkAccessibility(link);
    if (linkIssues && linkIssues.length > 0) {
      issues.push(...linkIssues);
    }
  });

  // Validate button (<button>) elements
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    const buttonIssues = validateLinkAccessibility(button);
    if (buttonIssues && buttonIssues.length > 0) {
      issues.push(...buttonIssues);
    }
  });

  // Handle fake links by converting them to proper accessible elements
  handleFakeLinks();

  return {
    issueCount: issues.length,
    issues
  };
}

// Export UI / product functions
export {
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage
};

// Export accessibility utility functions
export {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
};

// Export utility functions
export {
  formatCurrency,
  formatDate,
  calculateDiscount,
  validateInput
};

// Export component functions
export {
  renderHeader,
  renderFooter,
  renderProductCard
};

// Export state
export {
  state,
  updateState
};

// ... other exports ...

// Export the new handleAccessibilityIssues function
export {
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage
};

// Export the new function
export { checkLinkAccessibility };

// Export landmark utilities
export {
  createUniqueLandmarkId,
  uniqueLandmarks,
  addAriaLabel,
  ensureUniqueLandmarks,
  validateTable,
  processSvgAccessibility
};