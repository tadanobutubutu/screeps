// Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// Preserve existing functionality
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
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
    if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
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
getLangAttribute();

// Create in-page button with accessibility considerations
createInPageButton();

// Validate table structure and accessibility
function validateTable(table) {
    if (table) {
        validateTableAccessibility(table);
        validateTableStructure(table);
    }
}

// Add/fix landmark issues
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

// Handle fake links
handleFakeLinks();

// React / UI related functions

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductList(products) {
  const container = document.createElement('div');
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

// Export UI / product functions
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