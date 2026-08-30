// Accessibility improvements implementation
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// Preserve existing functionality
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils/formatters';

// Global set to track used landmark IDs
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
        candidate = `${baseName}-${counter}`;
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
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
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

// Add accessible names to SVGs
function validateSvgAccessibility(svg) {
    if (svg) {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
    }
}

// Ensure unique landmarks
// This is handled by the createUniqueLandmarkId and uniqueLandmarks functions

// Handle fake links
handleFakeLinks();

// React / UI related functions

function formatProductName(product) {
  return `${product.name} - ${product.description}`;
}

function renderProductList(products) {
  const container = document.createElement('div');
  container.className = 'product-list';
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <h3>${formatProductName(p)}</h3>
      <p class="price">${formatCurrency(p.price)}</p>
    </div>
  `).join('');
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
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return renderCart(input);
  }
  return '<p role="alert">Invalid input</p>';
}

function renderPage(data) {
  const header = renderHeader(data.title);
  const content = data.content;
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

/**
 * Checks and validates link accessibility
 */
function checkLinkAccessibility() {
  const links = document.querySelectorAll('a');
  const accessibleLinks = [];
  
  links.forEach(link => {
    if (validateLinkAccessibility(link)) {
      accessibleLinks.push(link);
    }
  });
  
  return accessibleLinks;
}

// Initialize accessibility features
function initializeAccessibility() {
  addLangAttribute();
  
  const tables = document.querySelectorAll('table');
  tables.forEach(validateTable);
  
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(validateSvgAccessibility);
  
  handleFakeLinks();
  
  validateLandmark();
  validateLandmarkStructure();
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
export { checkLinkAccessibility, initializeAccessibility };