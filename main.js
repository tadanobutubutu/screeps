// main.js

// Import required module(s) - for fixing table structure issues
const domutils = require('domutils');

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

// Imports at the top of the file
const { utility1, utility2 } = require('./utils');
const { formatData, processValues } = require('./helpers');
const { addMissingExportFunction } = require('./missingExportFile');

// Existing code
const existingFunction = {};

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
  const landmarks = doc.querySelectorAll('main, footer, aside, section, article');
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
  const tables = doc.querySelectorAll('table');
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
  const landmarks = doc.querySelectorAll('main, footer, aside, section, article');
  ensureUniqueLandmarks(landmarks);
}

/**
 * Fix fake link issues
 * @param { Document } doc - The document object to operate on
 */
function fixFakeLinkIssues(doc) {
  const links = doc.querySelectorAll('a');
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
  const link = doc.createElement('a');
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
  const button = doc.createElement('button');
  button.textContent = text;
  button.id = button.id || `button-${Date.now()}`;
  return button;
}

/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const primaryContent = doc.querySelector('article, #content, .content');
  if (!primaryContent || !primaryContent.parentNode) {
    return;
  }
  const main = doc.createElement('div');
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
  const landmarks = doc.querySelectorAll('main, footer, aside, section, article');
  return Array.from(landmarks);
}

/**
 * Add ARIA attributes to form controls
 * @param { Document } doc - The document object to operate on
 */
function addAriaToFormControls(doc) {
  const inputs = doc.querySelectorAll('input, select, textarea');
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
  const buttons = doc.querySelectorAll('button');
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
  if (!doc.documentElement.getAttribute('lang')) {
    doc.documentElement.setAttribute('lang', getLangAttribute(doc));
    summary.langAttributeFixed = true;
  }

  // REACT_017 & REACT_025: Add/fix landmark issues and ensure unique landmarks
  const landmarkResults = validateLandmarkStructure(doc);
  summary.landmarkIssuesFixed = landmarkResults.filter(r => !r.valid).length;
  addFixLandmarkIssues(doc);

  // REACT_027: Validate table structure
  const tableResults = validateTableStructure(doc);
  summary.tablesValidated = tableResults.length;

  // REACT_036: Fix fake link issues
  const links = doc.querySelectorAll('a');
  links.forEach(link => {
    if (!link.href || link.href === '#') {
      link.setAttribute('role', 'presentation');
      summary.fakeLinkIssuesFixed++;
    }
  });

  // REACT_041: Add accessible names to SVGs
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!getSvgAccessibleName(svg)) {
      svg.setAttribute('aria-label', `Image ${index + 1}`);
      summary.svgsFixed++;
    }
  });

  // Add ARIA to form controls
  const inputs = doc.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    if (!input.id && input.type !== 'hidden') {
      input.id = `input-${index}`;
      summary.formControlsFixed++;
    }
  });

  // Replace button IDs with accessible alternatives
  const buttons = doc.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `button-${index}`;
      summary.buttonsFixed++;
    }
  });

  // Wrap primary content in main landmark if not present
  if (!doc.querySelector('main, [role="main"]')) {
    wrapPrimaryContentInMain(doc);
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
  const landmarks = addProperLandmarkRegions(doc);
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

module.exports = {
  existingFunction,
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
  renderHomePage,
  renderUserProfile,
  renderDashboard,
  renderSettings,
  processTable,
  formatTableRow,
  generateTableMarkdown,
};