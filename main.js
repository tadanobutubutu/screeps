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
  validateTableAccessibility,
  validateTableStructure,
  validateAllTables,
  generateReport
};