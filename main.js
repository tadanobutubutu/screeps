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
 * Address accessibility issues from insight report
 * Attempts to automatically fix common accessibility problems in tables
 * @param {boolean} applyFixes - Whether to apply fixes or just report issues (default: true)
 * @returns {Object} Results of addressing accessibility issues
 */
function addressAccessibilityIssues(applyFixes = true) {
  const tables = getTables();
  const results = {
    tablesProcessed: 0,
    issuesAddressed: 0,
    remainingIssues: [],
    tables: []
  };
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const tableResult = {
      index: i,
      issuesAddressed: 0,
      fixed: []
    };
    
    // Address missing headers
    if (!table.headers || !Array.isArray(table.headers) || table.headers.length === 0) {
      if (applyFixes) {
        // Auto-generate basic headers based on first row cell count
        const rowLength = table.rows && table.rows[0] ? table.rows[0].length : 1;
        table.headers = Array.from({ length: rowLength }, (_, idx) => `Column ${idx + 1}`);
        tableResult.fixed.push('Auto-generated headers for table');
      }
      tableResult.issuesAddressed++;
      results.issuesAddressed++;
    }
    
    // Address missing rows array
    if (!table.rows || !Array.isArray(table.rows)) {
      if (applyFixes) {
        table.rows = [];
        tableResult.fixed.push('Initialized empty rows array');
      }
      tableResult.issuesAddressed++;
      results.issuesAddressed++;
    }
    
    // Address missing ARIA attributes
    if (table.ariaLabel === undefined && table.caption === undefined) {
      if (applyFixes) {
        // Prefer aria-label for accessibility
        table.ariaLabel = table.caption || `Table ${i + 1}`;
        tableResult.fixed.push('Added aria-label for table');
      }
      tableResult.issuesAddressed++;
      results.issuesAddressed++;
    }
    
    results.tables.push(tableResult);
    results.tablesProcessed++;
  }
  
  // Re-validate to check remaining issues
  const revalidation = validateTableAccessibility();
  results.remainingIssues = revalidation.errors;
  results.isAccessible = revalidation.isValid;
  
  return results;
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
  addressAccessibilityIssues
};