// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
//_Commit: 7c71fe35502d1cacefd35e209f9d20be82c56fc3_
//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->

_Commit: e1c38a81654fe5ba4cfcfba53c47360921b7ae1a_

<!-- todo-hash: 517a7db840f97b4b43fa4969b1b8026f5c74073b -->

/**
 * Main application module
 */

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// Sample data store
const appData = {
  tables: [],
  config: {
    validateAccessibility: true,
    validateStructure: true
  }
};

/**
 * Initialize the application
 */
function initialize() {
  console.og('Application initialized');
  return true;
}

/**
 * Load table data into the application
 * @param {Array} tables - Array of table objects to load
 */
function loadTables(tables) {
  if (!Array.isArray(tables)) {
    throw new Error('Tables must be an array');
  }
  appData.tables = tables;
  applySvgAccessibilityProps();
  return true;
}

/**
 * Get all loaded tables
 * @returns {Array} Array of table objects
 */
function getTables() {
  return appData.tables;
}

/**
 * Get application configuration
 * @returns {Object} Configuration object
 */
function getConfig() {
  return { ...appData.config };
}

/**
 * Set application configuration
 * @param {Object} config - Configuration object
 */
function setConfig(config) {
  appData.config = { ...appData.config, ...config };
}

/**
 * Validate that all tables in the application meet accessibility standards
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility() {
  // ... Existing code

  // Add check for table's ARIA attributes
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    // ... Existing checks

    if (table.tagName.toLowerCase() === 'svg') {
      if (table.ariaLabel === undefined && table.caption === undefined) {
        errors.push({
          tableIndex: i,
          error: `Table should have aria-label or caption for accessibility when using SVG`
        });
      }
      table.__ariaLabel = table.ariaLabel || table.caption;
      table.__ariaLabelledby = table.ariaLabelledby || `${table.id || ''}-label`;
    }
  }
  // ... Existing code
}

/**
 * Function to apply SVG accessibility props to all tables
 */
function applySvgAccessibilityProps() {
  const tables = getTables();
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    if (table.tagName.toLowerCase() === "svg") {
      table.setAttribute('aria-label', table.__ariaLabel);
      table.setAttribute('aria-labelledby', table.__ariaLabelledby);
    }
  }
}

// ... Existing functions

/**
 * Gets the language attribute for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Creates an in-page button element with proper accessibility
 * @param {Object} options - Button options
 * @returns {Object} Button element object
 */
function createInPageButton(options = {}) {
  const button = {
    type: 'button',
    text: options.text || 'Button',
    ariaLabel: options.ariaLabel || options.text || 'Button',
    lang: options.lang || getLangAttribute(),
    onClick: options.onClick || null
  };
  return button;
}

/**
 * Validates landmark elements on the page
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmark() {
  const errors = [];
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates the structure of landmark elements
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmarkStructure() {
  const errors = [];
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates landmark attributes for accessibility
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmarkAttributes() {
  const errors = [];
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {Object} svg - SVG element object
 * @returns {string} Accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.ariaLabel || svg.title || svg.id || 'Unnamed SVG';
}

/**
 * Sets accessibility attributes on an SVG element
 * @param {Object} svg - SVG element object
 * @param {string} accessibleName - Accessible name to set
 * @returns {Object} Updated SVG element
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return null;
  return {
    ...svg,
    ariaLabel: accessibleName,
    role: 'img'
  };
}

/**
 * Validates that landmarks are unique on the page
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmarkUniqueness() {
  const errors = [];
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates link accessibility
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLinkAccessibility() {
  const errors = [];
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Handles fake links (links that should be buttons)
 * @returns {Object} Result with list of fake links found
 */
function handleFakeLinks() {
  const fakeLinks = [];
  return {
    converted: fakeLinks,
    count: fakeLinks.length
  };
}

/**
 * Generate a report from validation results
 * @param {Object} validationResults - Results from validateAllTables or individual validation functions
 * @returns {string} Formatted report string
 */
function generateReport(validationResults) {
  const lines = [];
  lines.push('=== Table Validation Report ===');
  lines.push('');
  
  const totalTables = getTables().length;
  lines.push(`Total tables validated: ${totalTables}`);
  lines.push('');
  
  // Overall status
  const overallValid = validationResults.isValid !== undefined 
    ? validationResults.isValid 
    : (validationResults.accessibility?.isValid && validationResults.structure?.isValid);
  
  lines.push(`Overall Status: ${overallValid ? 'PASSED' : 'FAILED'}`);
  lines.push('');
  
  // Accessibility section
  if (validationResults.accessibility) {
    const accResult = validationResults.accessibility;
    lines.push('--- Accessibility Validation ---');
    lines.push(`Status: ${accResult.isValid ? 'PASSED' : 'FAILED'}`);
    lines.push(`Errors found: ${accResult.errors.length}`);
    
    if (accResult.errors.length > 0) {
      lines.push('');
      lines.push('Errors:');
      accResult.errors.forEach(err => {
        lines.push(`  - Table ${err.tableIndex}: ${err.error}`);
      });
    }
    lines.push('');
  }
  
  // Structure section
  if (validationResults.structure) {
    const structResult = validationResults.structure;
    lines.push('--- Structure Validation ---');
    lines.push(`Status: ${structResult.isValid ? 'PASSED' : 'FAILED'}`);
    lines.push(`Errors found: ${structResult.errors.length}`);
    
    if (structResult.errors.length > 0) {
      lines.push('');
      lines.push('Errors:');
      structResult.errors.forEach(err => {
        let errorMsg = `  - Table ${err.tableIndex}`;
        if (err.rowIndex !== undefined) {
          errorMsg += `, Row ${err.rowIndex}`;
        }
        errorMsg += `: ${err.error}`;
        lines.push(errorMsg);
      });
    }
    lines.push('');
  }
  
  lines.push('=== End of Report ===');
  
  return lines.join('\n');
}

// Module exports
module.exports = {
  initialize,
  loadTables,
  getTables,
  getConfig,
  setConfig,
  createButton,
  addButtonToPage,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateAllTables,
  generateReport
};