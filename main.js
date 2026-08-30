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
 * Validates that all tables in the application meet accessibility standards
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility() {
  const errors = [];
  const tables = getTables();

  tables.forEach((table, index) => {
    if (!table) {
      errors.push(`Table at index ${index} is null or undefined`);
      return;
    }
    if (typeof table.role !== 'string' || table.role.length === 0) {
      errors.push(`Table at index ${index} is missing required ARIA role attribute`);
    }
    if (table.role === 'button' && !table.tabIndex && table.tabIndex !== 0) {
      errors.push(`Table at index ${index} with role='button' must be keyboard focusable (tabIndex required)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates the structure of all tables in the application
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableStructure() {
  const errors = [];
  const tables = getTables();

  tables.forEach((table, index) => {
    if (!table) {
      errors.push(`Table at index ${index} is null or undefined`);
      return;
    }
    if (!Array.isArray(table.rows)) {
      errors.push(`Table at index ${index} is missing required 'rows' array`);
    }
    if (!Array.isArray(table.columns)) {
      errors.push(`Table at index ${index} is missing required 'columns' array`);
    }
    if (Array.isArray(table.rows) && Array.isArray(table.columns)) {
      table.rows.forEach((row, rowIndex) => {
        if (!Array.isArray(row.cells)) {
          errors.push(`Table at index ${index}, row ${rowIndex} is missing required 'cells' array`);
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
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
  validateAllTables
};