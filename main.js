/**
 * Main application module
 */

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
  console.log('Application initialized');
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
 * REACT_015: Add lang attribute to HTML element for accessibility
 * Returns the lang attribute value for the document
 * @param {string} langCode - The language code to set (e.g., 'en', 'es', 'fr')
 * @returns {Object} Result object with lang attribute and status
 */
function addLangAttribute(langCode) {
  if (!langCode || typeof langCode !== 'string') {
    return {
      success: false,
      error: 'Invalid lang code provided'
    };
  }
  
  // Validate that it's a proper language code format
  const validLangCode = /^[a-z]{2}(-[A-Z]{2})?$/;
  if (!validLangCode.test(langCode)) {
    return {
      success: false,
      error: 'Lang code must be a valid BCP 47 language tag (e.g., "en", "en-US")'
    };
  }
  
  return {
    success: true,
    lang: langCode,
    attribute: `lang="${langCode}"`
  };
}

/**
 * Check and validate accessibility attributes on tables
 * @param {Object} table - Table object to check
 * @returns {Object} Accessibility check result
 */
function checkTableAccessibility(table) {
  const issues = [];
  
  // Check for lang attribute
  if (!table.lang) {
    issues.push({
      code: 'REACT_015',
      message: 'Table missing lang attribute for accessibility'
    });
  }
  
  // Check for other accessibility attributes
  if (!table.headers && !table.caption) {
    issues.push({
      code: 'REACT_025',
      message: 'Table missing caption or headers for screen readers'
    });
  }
  
  // Check for ARIA attributes if needed
  if (!table.ariaLabel && !table.ariaDescribedBy && !table.caption) {
    issues.push({
      code: 'REACT_025',
      message: 'Table should have aria-label, aria-describedby, or caption'
    });
  }
  
  return {
    hasIssues: issues.length > 0,
    issues: issues
  };
}

// // // TODO: Implement validateTableAccessibility() and validateTableStructure() functions here

/**
 * Validates that all tables in the application meet accessibility standards
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility() {
  const errors = [];
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    // Check if table has headers
    if (!table.headers || !Array.isArray(table.headers) || table.headers.length === 0) {
      errors.push({
        tableIndex: i,
        error: 'Table must have headers defined'
      });
    }
    
    // Check if table has proper structure
    if (!table.rows || !Array.isArray(table.rows)) {
      errors.push({
        tableIndex: i,
        error: 'Table must have rows array defined'
      });
    }
    
    // Check for proper ARIA attributes (placeholder implementation)
    if (table.ariaLabel === undefined && table.caption === undefined) {
      errors.push({
        tableIndex: i,
        error: 'Table should have aria-label or caption for accessibility'
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates the structure of all tables in the application
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableStructure() {
  const errors = [];
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    // Check if table has headers
    if (!table.headers) {
      errors.push({
        tableIndex: i,
        error: 'Table missing headers property'
      });
      continue;
    }
    
    // Check if table has rows
    if (!table.rows || !Array.isArray(table.rows)) {
      errors.push({
        tableIndex: i,
        error: 'Table missing rows property'
      });
      continue;
    }
    
    // Validate each row has same number of cells as headers
    const headerCount = table.headers.length;
    
    for (let j = 0; j < table.rows.length; j++) {
      const row = table.rows[j];
      
      if (!Array.isArray(row)) {
        errors.push({
          tableIndex: i,
          rowIndex: j,
          error: 'Row must be an array of cells'
        });
        continue;
      }
      
      if (row.length !== headerCount) {
        errors.push({
          tableIndex: i,
          rowIndex: j,
          error: `Row has ${row.length} cells but headers have ${headerCount}`
        });
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validate all tables (convenience function)
 * @returns {Object} Combined validation results
 */
function validateAllTables() {
  const accessibilityResult = validateTableAccessibility();
  const structureResult = validateTableStructure();
  
  return {
    accessibility: accessibilityResult,
    structure: structureResult,
    isValid: accessibilityResult.isValid && structureResult.isValid
  };
}

// Module exports
module.exports = {
  initialize,
  loadTables,
  getTables,
  getConfig,
  setConfig,
  validateTableAccessibility,
  validateTableStructure,
  validateAllTables,
  addLangAttribute,
  checkTableAccessibility
};