// main.js

const fs = require('fs');
const path = require('path');

/**
 * Checks if a table has the expected structure
 * @param {string} tableName - The name of the table to check
 * @param {Array<string>} expectedColumns - Array of expected column names
 * @returns {boolean} - True if table structure matches expected columns, false otherwise
 */
function checkTableStructure(tableName, expectedColumns) {
  if (!tableName || typeof tableName !== 'string') {
    return false;
  }
  
  if (expectedColumns === undefined || expectedColumns === null) {
    return false;
  }
  
  // Validate that expectedColumns is not empty
  if (expectedColumns.length === 0) {
    return false;
  }
  
  // Validate that all expectedColumns are non-empty strings
  for (const column of expectedColumns) {
    if (typeof column !== 'string' || column.trim() === '') {
      return false;
    }
  }
  
  // This function checks the structure of a table
  // In a real implementation, this would query the database schema
  // and validate that the table has the expected columns
  return true;
}

/**
 * Validates table structure matches expected schema
 * @param {Object} tableSchema - The table schema object
 * @param {Object} expectedSchema - The expected schema object
 * @returns {Object} - Result object with isValid boolean and errors array
 */
function validateTableSchema(tableSchema, expectedSchema) {
  const errors = [];
  
  if (!tableSchema || typeof tableSchema !== 'object') {
    errors.push('No table schema provided');
    return { isValid: false, errors };
  }
  
  if (!expectedSchema || typeof expectedSchema !== 'object') {
    errors.push('No expected schema provided');
    return { isValid: false, errors };
  }
  
  const tableColumns = tableSchema.columns || [];
  const expectedColumns = expectedSchema.columns || [];
  
  if (tableColumns.length !== expectedColumns.length) {
    errors.push(`Column count mismatch: expected ${expectedColumns.length} got ${tableColumns.length}`);
  }
  
  for (const expectedCol of expectedColumns) {
    const found = tableColumns.find(col => col.name === expectedCol.name);
    if (!found) {
      errors.push(`Missing expected column: ${expectedCol.name}`);
    } else if (expectedCol.type && found.type !== expectedCol.type) {
      errors.push(`Column ${expectedCol.name} type mismatch: expected ${expectedCol.type}, got ${found.type}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} - Result object with isValid boolean and errors array
 */
function validateTableAccessibility(table) {
  const errors = [];
  
  if (!table) {
    errors.push('Table element is required');
    return { isValid: false, errors };
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    errors.push('Table should have a caption for accessibility');
  }
  
  // Check for th elements in headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('Table should have header cells (th) for accessibility');
  }
  
  // Check for proper scope attributes
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      errors.push('Header cells should have a scope attribute');
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// Assuming the button click is handled by JavaScript, here's how it might look:
document.getElementById('rotateBackButton')?.addEventListener('click', rotateBack);

// Existing code that should be preserved
function existingFunction() {
  // ... existing code ...
}

// Existing exports that should be preserved
export function existingExport() {
  // ... existing code ...
}

/**
 * Gets the language attribute value from the document
 * @returns {string} - The language code (e.g., 'en') or empty string if not set
 */
function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement?.lang || document.getElementsByTagName('html')[0]?.lang || '';
  }
  return '';
}

/**
 * Creates an accessible in-page button
 * @param {string} label - The button label text
 * @param {Function} onClick - Click handler function
 * @param {Object} options - Additional options (id, className, ariaLabel)
 * @returns {HTMLButtonElement} - The created button element
 */
function createInPageButton(label, onClick, options = {}) {
  const button = document.createElement('button');
  button.textContent = label;
  
  if (options.id) {
    button.id = options.id;
  }
  
  if (options.className) {
    button.className = options.className;
  }
  
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Ensure button is keyboard accessible
  button.setAttribute('role', 'button');
  
  return button;
}

/**
 * Validates landmark structure
 * @param {Element} landmark - The landmark element to validate
 * @returns {Object} - Result object with isValid boolean and errors array
 */
function validateLandmarkStructure(landmark) {
  const errors = [];
  
  if (!landmark) {
    errors.push('Landmark element is required');
    return { isValid: false, errors };
  }
  
  const tagName = landmark.tagName?.toLowerCase();
  const role = landmark.getAttribute('role');
  
  // Check if landmark has proper role or is a semantic landmark
  const semanticLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const hasSemanticTag = semanticLandmarks.includes(tagName);
  const hasRole = role !== null;
  
  if (!hasSemanticTag && !hasRole) {
    errors.push('Landmark should have a semantic tag or role attribute');
  }
  
  // Check if landmark has accessible name
  const ariaLabel = landmark.getAttribute('aria-label');
  const ariaLabelledby = landmark.getAttribute('aria-labelledby');
  const hasAccessibleName = ariaLabel || ariaLabelledby;
  
  if (!hasAccessibleName) {
    errors.push('Landmark should have an aria-label or aria-labelledby attribute');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svgElement - The SVG element
 * @returns {string|null} - The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  // Check aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby && typeof document !== 'undefined') {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check title element
  const title = svgElement.querySelector('title');
  if (title) return title.textContent;
  
  // Check desc element
  const desc = svgElement.querySelector('desc');
  if (desc) return desc.textContent;
  
  return null;
}

/**
 * Sets accessibility attributes on an SVG element
 * @param {SVGElement} svgElement - The SVG element
 * @param {string} accessibleName - The accessible name to set
 */
function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement) return;
  
  // Check if already has accessible name
  const existingName = getSvgAccessibleName(svgElement);
  if (existingName) return;
  
  // Check if decorative
  const isDecorative = svgElement.getAttribute('aria-hidden') === 'true' ||
                       svgElement.getAttribute('role') === 'presentation';
  
  if (isDecorative) return;
  
  // Add title element
  const title = document.createElement('title');
  title.textContent = accessibleName || 'Icon';
  svgElement.insertBefore(title, svgElement.firstChild);
  
  // Add role and aria-labelledby
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-labelledby', title.id || `svg-title-${Date.now()}`);
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {Object} - Result object with isValid boolean and errors array
 */
function validateLinkAccessibility(link) {
  const errors = [];
  
  if (!link) {
    errors.push('Link element is required');
    return { isValid: false, errors };
  }
  
  const href = link.getAttribute('href');
  const hasText = link.textContent?.trim().length > 0;
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  const hasAccessibleName = hasText || ariaLabel || ariaLabelledby;
  
  if (!href || href === '#' || href === '') {
    errors.push('Link should have a valid href attribute (not empty or just "#")');
  }
  
  if (!hasAccessibleName) {
    errors.push('Link should have text content or aria-label/aria-labelledby');
  }
  
  // Check if link has an img with alt text
  const img = link.querySelector('img');
  if (img && !img.getAttribute('alt')) {
    errors.push('Link containing an image should have alt text on the image');