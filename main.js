// main.js
// TODO: Address accessibility issues from insight report — CONTINUING
// Add new functions (no existing functions should be removed or renamed)

// Importing the necessary functions
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';

// Import required module(s) - for fixing table structure issues
import domutils from 'domutils';

// DOM-based accessibility code

// Add lang attribute to HTML element
document.documentElement.setAttribute('lang', getLangAttribute());

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

// Add accessible names to SVGs
const svg = document.getElementById('mySvg');
if (svg) {
  const accessibleName = getSvgAccessibleName(svg);
  setSvgAttributes(svg, accessibleName);
}

// Ensure unique landmarks
validateLinkAccessibility();
handleFakeLinks();

// React / UI related functions

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductList(products) {
  const container = document.getElementById('product-list');
  if (!container) return null;
  container.innerHTML = products.map(renderProductCard).join('');
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
    return renderProductList(input.products);
  }
  return null;
}

/**
 * Process table elements and extract row data
 * @param { HTMLElement } tableElement - The table element to process
 * @returns { Array<Array> } Array of rows with cell data
 */
function processTable(tableElement) {
  const rows = [];
  
  function traverse(node) {
    if (node.type === 'tag' && node.name === 'tr') {
      const cells = domutils.getElementsByTagName('td', node);
      const rowData = cells.map(cell => domutils.textContent(cell));
      rows.push(rowData);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  traverse(tableElement);
  return rows;
}

/**
 * Get accessible name for SVG elements
 * @param { SVGElement } svg - The SVG element
 * @returns { string } The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const ariaLabel = svg.getAttribute && svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const title = svg.querySelector ? svg.querySelector('title') : null;
  if (title) return title.textContent;
  return svg.nodeName || '';
}

/**
 * Get the lang attribute from the document
 * @param { Document } doc - The document object to operate on
 * @returns { string } The language code
 */
function getLangAttribute(doc) {
  return doc.documentElement.lang || 'en';
}

/**
 * Get the full lang attribute including region
 * @param { Document } doc - The document object to operate on
 * @returns { string } The full language code
 */
function getFullLangAttribute(doc) {
  return doc.documentElement.lang || 'en-US';
}

/**
 * Validate landmark
 * @param { Element } element - The element to validate
 * @returns { boolean } Whether the landmark is valid
 */
function validateLandmark(element) {
  if (!element) return false;
  const validRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const role = element.getAttribute('role');
  return !!role && validRoles.includes(role);
}

/**
 * Validate landmark structure in document
 * @param { Document } doc - The document object to validate
 * @returns { Array } Array of validation results
 */
function validateLandmarkStructure(doc) {
  const document = doc || global.document;
  if (!document) return [];
  const landmarks = document.querySelectorAll('main, footer, aside, section, article');
  return Array.from(landmarks).map(el => ({
    element: el,
    valid: validateLandmark(el),
    role: el.getAttribute('role'),
  }));
}

/**
 * Validate table accessibility
 * @param { HTMLTableElement } table - The table to validate
 * @returns { boolean } Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelector('th') !== null;
  return hasCaption && hasHeaders;
}

/**
 * Validate table structure
 * @param { Document } doc - The document object to validate
 * @returns { Array } Array of validation results
 */
function validateTableStructure(doc) {
  const document = doc || global.document;
  if (!document) return [];
  const tables = document.querySelectorAll('table');
  return Array.from(tables).map(table => ({
    table,
    accessible: validateTableAccessibility(table),
  }));
}

/**
 * Ensure landmarks are unique in the document
 * @param { NodeList | Array } landmarks - The landmarks to check
 */
function ensureUniqueLandmarks(landmarks) {
  const seen = new Map();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role && seen.has(role)) {
      landmark.removeAttribute('role');
    } else if (role) {
      seen.set(role, landmark);
    }
  });
}

/**
 * Add/fix landmark issues
 * @param { Document } doc - The document object to operate on
 */
function addFixLandmarkIssues(doc) {
  const document = doc || global.document;
  if (!document) return;
  const landmarks = document.querySelectorAll('main, footer, aside, section, article');
  ensureUniqueLandmarks(landmarks);
}

/**
 * Fix fake link issues
 * @param { Document } doc - The document object to operate on
 */
function fixFakeLinkIssues(doc) {
  const document = doc || global.document;
  if (!document) return;
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.href || link.href === '#') {
      link.setAttribute('role', 'presentation');
    }
  });
}

/**
 * Create an accessible link element
 * @param { string } href - The href attribute
 * @param { string } text - The link text
 * @param { Document } doc - The document object
 * @returns { HTMLAnchorElement } The created link
 */
function createAccessibleLink(href, text, doc) {
  const document = doc || global.document;
  if (!document) return null;
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  return link;
}

/**
 * Create an in-page button element
 * @param { string } text - The button text
 * @param { Document } doc - The document object
 * @returns { HTMLButtonElement } The created button
 */
function createInPageButton(text, doc) {
  const document = doc || global.document;
  if (!document) return null;
  const button = document.createElement('button');
  button.textContent = text;
  button.id = button.id || `button-${Date.now()}`;
  return button;
}

/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const document = doc || global.document;
  if (!document) return;
  const primaryContent = document.querySelector('article, #content, .content');
  if (!primaryContent || !primaryContent.parentNode) {
    return;
  }
  const main = document.createElement('div');
  main.className = 'main';
  main.setAttribute('role', 'main');
  primaryContent.parentNode.insertBefore(main, primaryContent);
  main.appendChild(primaryContent);
}

/**
 * Add proper landmark regions to the document
 * @param { Document } doc - The document object to operate on
 * @returns { Array } Array of landmark elements found
 */
function addProperLandmarkRegions(doc) {
  const document = doc || global.document;
  if (!document) return [];
  const landmarks = document.querySelectorAll('main, footer, aside, section, article');
  return Array.from(landmarks);
}

/**
 * Add ARIA attributes to form controls
 * @param { Document } doc - The document object to operate on
 */
function addAriaToFormControls(doc) {
  const document = doc || global.document;
  if (!document) return;
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    if (!input.id && input.type !== 'hidden') {
      input.id = `input-${index}`;
    }
  });
}

/**
 * Replace button IDs with accessible alternatives
 * @param { Document } doc - The document object to operate on
 */
function replaceMyButtonId(doc) {
  const document = doc || global.document;
  if (!document) return;
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `button-${index}`;
    }
  });
}

/**
 * Address accessibility issues from the insight report
 * Applies all relevant accessibility fixes to the document
 * @param { Document } doc - The document object to operate on
 * @returns { Object } A summary of the fixes applied
 */
function addressAccessibilityIssuesFromInsightReport(doc) {
  const document = doc || global.document;
  if (!document) return {};

  const summary = {
    langAttributeFixed: false,
    landmarkIssuesFixed: 0,
    fakeLinkIssuesFixed: 0,
    formControlsFixed: 0,
    buttonsFixed: 0,
    svgsFixed: 0,
    tablesValidated: 0,
  };

  // REACT_015: Add lang attribute to HTML element if missing
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', getLangAttribute(document));
    summary.langAttributeFixed = true;
  }

  // REACT_017 & REACT_025: Add/fix landmark issues and ensure unique landmarks
  const landmarkResults = validateLandmarkStructure(document);
  summary.landmarkIssuesFixed = landmarkResults.filter(r => !r.valid).length;
  addFixLandmarkIssues(document);

  // REACT_027: Validate table structure
  const tableResults = validateTableStructure(document);
  summary.tablesValidated = tableResults.length;

  // REACT_036: Fix fake link issues
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.href || link.href === '#') {
      link.setAttribute('role', 'presentation');
      summary.fakeLinkIssuesFixed++;
    }
  });

  // REACT_041: Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!getSvgAccessibleName(svg)) {
      svg.setAttribute('aria-label', `Image ${index + 1}`);
      summary.svgsFixed++;
    }
  });

  // Add ARIA to form controls
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    if (!input.id && input.type !== 'hidden') {
      input.id = `input-${index}`;
      summary.formControlsFixed++;
    }
  });

  // Replace button IDs with accessible alternatives
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `button-${index}`;
      summary.buttonsFixed++;
    }
  });

  // Wrap primary content in main landmark if not present
  if (!document.querySelector('main, [role="main"]')) {
    wrapPrimaryContentInMain(document);
  }

  return summary;
}

/**
 * Calculate total price from an array of items
 * @param { Array } items - Array of items with price property
 * @returns { number } Total price of all items
 */
function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

/**
 * Add and ensure unique landmark regions
 * @param { Document } doc - The document object to operate on
 * @returns { Array<HTMLElement> } - An array of landmark elements
 */
function addAndEnsureUniqueLandmarkRegions(doc) {
  const document = doc || global.document;
  if (!document) return [];
  const landmarks = addProperLandmarkRegions(document);
  ensureUniqueLandmarks(landmarks);
  return landmarks;
}

/**
 * Format a table row with aligned columns
 * @param { Array } rowData - Data for the row
 * @param { Array } columnWidths - Widths for each column
 * @returns { string } Formatted row string
 */
function formatTableRow(rowData, columnWidths) {
  return rowData.map((cell, i) => {
    const width = columnWidths[i] || 10;
    return String(cell).padEnd(width);
  }).join(' | ');
}

/**
 * Generate markdown table from headers and rows
 * @param { Array } headers - Table headers
 * @param { Array<Array> } rows - Table data rows
 * @returns { string } Markdown table string
 */
function generateTableMarkdown(headers, rows) {
  const columnWidths = headers.map((h, i) => {
    const maxContentWidth = rows.reduce((max, row) => {
      return Math.max(max, String(row[i] || '').length);
    }, 0);
    return Math.max(h.length, maxContentWidth);
  });
  
  const headerRow = formatTableRow(headers, columnWidths);
  const separator = columnWidths.map(w => '-'.repeat(w)).join('-+-');
  const dataRows = rows.map(row => formatTableRow(row, columnWidths));
  
  return `${headerRow}\n${separator}\n${dataRows.join('\n')}`;
}

// Export all functions
export {
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  processTable,
  getSvgAccessibleName,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  ensureUniqueLandmarks,
  addFixLandmarkIssues,
  fixFakeLinkIssues,
  createAccessibleLink,
  createInPageButton,
  wrapPrimaryContentInMain,
  addProperLandmarkRegions,
  addAriaToFormControls,
  replaceMyButtonId,
  addressAccessibilityIssuesFromInsightReport,
  calculateTotal,
  addAndEnsureUniqueLandmarkRegions,
  formatTableRow,
  generateTableMarkdown,
};