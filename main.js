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

// New functions to address accessibility issues as per the issue

/**
 * Check if a table has an accessible name (aria-labelledby)
 * @param {object} table - Table object
 * @returns {boolean} True if table has an accessible name, false otherwise
 */
function hasAccessibleName(table) {
  return Boolean(table.ariaLabelledby || table.caption);
}

/**
 * Validate table accessibility
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility() {
  const errors = [];
  const tables = getTables();

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    if (!table.hasOwnProperty("ariaLabelledby")) {
      const tableIndex = i;
      errors.push({
        tableIndex,
        error: "Table lacks an accessible name (aria-labelledby)"
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validate table structure
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableStructure() {
  const errors = [];
  const tables = getTables();

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    if (!table.hasOwnProperty("headers")) {
      const tableIndex = i;
      errors.push({
        tableIndex,
        error: "Table lacks headers property"
      });
      continue;
    }

    if (!table.hasOwnProperty("rows")) {
      const tableIndex = i;
      errors.push({
        tableIndex,
        error: "Table lacks rows property"
      });
      continue;
    }

    // Validate each row has same number of cells as headers
    const headerCount = table.headers.length;

    for (let j = 0; j < table.rows.length; j++) {
      const row = table.rows[j];

      if (!Array.isArray(row)) {
        const tableIndex = i;
        const rowIndex = j;
        errors.push({
          tableIndex,
          rowIndex,
          error: "Row must be an array of cells"
        });
        continue;
      }

      if (row.length !== headerCount) {
        const tableIndex = i;
        const rowIndex = j;
        errors.push({
          tableIndex,
          rowIndex,
          error: `Row has ${row.length} cells but headers have ${headerCount}`
        });
      }
    }

    if (!hasAccessibleName(table)) {
      const tableIndex = i;
      errors.push({
        tableIndex,
        error: "Table lacks an accessible name"
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
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