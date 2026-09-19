// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

// Preserve existing functionality
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  const elementToModify = document.querySelector('html');
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

// Function to handle landmarks (including add, fix, and ensure unique landmarks)
function handleLandmarks() {
  // ... Ensure the todo items for REACT_017 and REACT_025 are implemented here
}

// Function to handle SVG accessibility
function handleSvgAccessibility() {
  // ... Ensure the requirement for REACT_041 is handled here
}

// Function to fix fake links issue
function handleFakeLinkIssue() {
  // ... Ensure the requirement for REACT_036 is handled here
}

// Internal set to track used landmark IDs
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
 * Ensures all landmarks have unique IDs by adding suffixes to duplicates.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Landmarks with unique IDs.
 */
function ensureUniqueLandmarks(landmarks) {
    const idCount = {};
    const result = [];
    
    for (const lm of landmarks) {
        if (idCount[lm.id]) {
            idCount[lm.id]++;
            lm.id = `${lm.id}-${idCount[lm.id]}`;
        } else {
            idCount[lm.id] = 1;
        }
        result.push(lm);
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
  });
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
addLangAttribute();

// Create in-page button with accessibility considerations
createInPageButton();

// Validate table structure and accessibility
// Assuming you have a table element with an id of 'myTable'
const table = document.getElementById('myTable');
if (table) {
  validateTableAccessibility(table);
  validateTableStructure(table);
}

// Add/fix landmark issues
validateLandmark();

// Add accessible names to SVGs
// Assuming you have an SVG element with an id of 'mySvg'
const svg = document.getElementById('mySvg');
if (svg) {
  const accessibleName = getSvgAccessibleName(svg);
  setSvgAttributes(svg, accessibleName);
}

// Ensure unique landmarks
// This would be handled by the appropriate function call
uniqueLandmarks([]);

// Handle fake links
handleFakeLinks();

// React / UI related functions

function formatProductName(product) {
  return `${product.name} - ${product.category || 'Unknown'}`;
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

function calculateDiscount(subtotal) {
  if (subtotal > 100) {
    return subtotal * 0.1; // 10% discount for orders over 100
  }
  return 0;
}

function validateInput(input) {
  return input && input.trim().length > 0;
}

function formatDate(date) {
  return date.toLocaleDateString();
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
    return renderCart(input);
  }
  return '<div class="error">Invalid input</div>';
}

// Export functions for testing
export {
  createUniqueLandmarkId,
  uniqueLandmarks,
  addAriaLabel,
  addLangAttribute,
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  calculateDiscount,
  renderCart,
  validateAndRender,
  formatDate,
  validateInput
};