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
 * Addresses accessibility issues from validation results and provides fixes
 * @param {Object} validationResults - Results from validateTableAccessibility() or validateAllTables()
 * @returns {Object} Object containing suggested fixes and recommendations for addressing issues
 */
function addressAccessibilityIssues(validationResults) {
  const fixes = [];
  const recommendations = [];
  
  // Handle case where validationResults is from validateAllTables()
  const errors = validationResults.accessibility 
    ? validationResults.accessibility.errors 
    : validationResults.errors;
  
  if (!errors || errors.length === 0) {
    return {
      hasIssues: false,
      fixes: [],
      recommendations: ['No accessibility issues found']
    };
  }
  
  for (const error of errors) {
    const tableIndex = error.tableIndex;
    
    switch (error.error) {
      case 'Table must have headers defined':
        fixes.push({
          tableIndex,
          error: error.error,
          fix: 'Add a headers array to the table object with column names'
        });
        recommendations.push('Ensure table headers are descriptive and accurately describe the content of each column');
        break;
        
      case 'Table must have rows array defined':
        fixes.push({
          tableIndex,
          error: error.error,
          fix: 'Add a rows array to the table object containing cell data'
        });
        recommendations.push('Populate table rows with data that corresponds to the headers');
        break;
        
      case 'Table should have aria-label or caption for accessibility':
        fixes.push({
          tableIndex,
          error: error.error,
          fix: 'Add an aria-label property to provide screen reader context'
        });
        recommendations.push('Use aria-label for complex tables or caption for simpler descriptive tables');
        break;
    }
  }
  
  return {
    hasIssues: true,
    fixes,
    recommendations: [...new Set(recommendations)]
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