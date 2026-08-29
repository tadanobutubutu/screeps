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
  
  if (typeof expectedColumns === 'undefined') {
    return false;
  }
  
  // Validate that expectedColumns is not empty
  if (!Array.isArray(expectedColumns) || expectedColumns.length === 0) {
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
    errors.push('Invalid table schema provided');
    return { isValid: false, errors };
  }
  
  if (!expectedSchema || typeof expectedSchema !== 'object') {
    errors.push('Invalid expected schema provided');
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

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// Assuming the button click is handled by JavaScript, here's how it might look:
const rotateButton = document.getElementById('rotate-back-button');
if (rotateButton) {
  rotateButton.addEventListener('click', rotateBack);
}

// Existing code that should be preserved
function existingFunction() {
  // ... existing code ...
}

// Existing exports that should be preserved
export function existingExport() {
  // ... existing code ...
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAccessibility())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by getUniqueLandmarkName() and validateLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Gets the lang attribute from the HTML element
 * @returns {string|null} - The language code or null if not set
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.getAttribute('lang');
  }
  return null;
}

/**
 * Adds lang attribute to HTML element if not present
 * @param {string} lang - Language code (e.g., 'en')
 * @returns {boolean} - True if lang was added, false if already present
 */
function addLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    const currentLang = document.documentElement.getAttribute('lang');
    if (!currentLang) {
      document.documentElement.setAttribute('lang', lang);
      return true;
    }
  }
  return false;
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateTableAccessibility(table) {
  const errors = [];
  
  if (!table || !(table instanceof HTMLElement)) {
    errors.push('Invalid table element provided');
    return { isValid: false, errors };
  }
  
  // Check for proper table structure
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  if (!thead) {
    errors.push('Table should have a thead element for proper accessibility');
  }
  
  if (!tbody) {
    errors.push('Table should have a tbody element for proper accessibility');
  }
  
  // Check for th elements with scope attributes
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('id')) {
      errors.push(`Header at index ${index} should have a scope or id attribute`);
    }
  });
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    errors.push('Table should have a caption for proper accessibility');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates landmark structure for accessibility
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} - Validation result with issues array
 */
function validateLandmarkStructure(root = document) {
  const issues = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  landmarkRoles.forEach(role => {
    const landmarks = root.querySelectorAll(`[role="${role}"]`);
    if (landmarks.length > 1 && (role === 'banner' || role === 'main' || role === 'contentinfo')) {
      landmarks.forEach((landmark, index) => {
        issues.push({
          role,
          element: landmark,
          message: `Multiple ${role} landmarks found (${index + 1} of ${landmarks.length}). Only one ${role} landmark should be present per page.`,
          severity: 'error'
        });
      });
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Validates landmark accessibility
 * @param {Document|Element} root - Root element to search within
 * @returns {Array} - Array of landmark issues
 */
function validateLandmark(root = document) {
  const issues = [];
  
  // Check for missing landmark labels
  const landmarks = root.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  
  landmarks.forEach(landmark => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    
    if (!ariaLabel && !ariaLabelledby) {
      issues.push({
        element: landmark,
        message: `Landmark missing accessible name. Add aria-label or aria-labelledby attribute.`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {Object} - Validation result
 */
function validateLinkAccessibility(link) {
  if (!link || !(link instanceof HTMLElement)) {
    return { isValid: false, errors: ['Invalid link element provided'] };
  }
  
  const errors = [];
  const href = link.getAttribute('href');
  const role = link.getAttribute('role');
  const tabIndex = link.getAttribute('tabindex');
  
  // Check for valid href
  if (!href || href === '#' || href === '') {
    errors.push('Link should have a valid href attribute');
  }
  
  // Check for descriptive text
  const text = link.textContent.trim();
  if (text.length === 0) {
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledby = link.getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledby) {
      errors.push('Link should have descriptive text or aria-label');
    }
  }
  
  // Check for proper button behavior if it's a fake link
  if (href === '#' || href === 'javascript:void(0)' || role === 'button') {
    if (!tabIndex && !link.hasAttribute('role')) {
      errors.push('Fake links should have role="button" or be converted to actual buttons');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Handles fake links (links that behave like buttons)
 * @param {Element} container - Container element to search for fake links
 * @returns {Array} - Array of converted fake links
 */
function handleFakeLinks(container = document.body) {
  const fakeLinks = container.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a[role="button"]');
  const converted = [];
  
  fakeLinks.forEach(link => {
    const href = link.getAttribute('href');
    const role = link.getAttribute('role');
    
    if (href === '#' || href === 'javascript:void(0)' || role === 'button') {
      // Add button role for accessibility
      link.setAttribute('role', 'button');
      
      // Check if it needs tabindex for keyboard accessibility
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
      
      // Add keyboard event handlers
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
      
      converted.push(link);
    }
  });
  
  return converted;
}

/**
 * Creates an accessible in-page button
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @param {Object} options - Button options
 * @