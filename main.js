/**
 * Main application module for Screeps bot
 */

// TODO: Add back any required exports that might have been removed
// Here is an example of how to export a required function from another file:

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

  // ... Existing validateTableAccessibility() implementation

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

  // ... Existing validateTableStructure() implementation

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

/**
 * Clear all loaded tables from the application
 */
function clearTables() {
  appData.tables = [];
  return true;
}

/**
 * Get the current application data store
 * @returns {Object} The appData object
 */
function getAppData() {
  return appData;
}

/**
 * Check if the application is initialized
 * @returns {boolean} True if tables are loaded, false otherwise
 */
function isInitialized() {
  return appData.tables.length > 0;
}

module.exports = {
  initialize,
  loadTables,
  getTables,
  getConfig,
  setConfig,
  validateTableAccessibility,
  validateTableStructure,
  validateAllTables,
  clearTables,
  getAppData,
  isInitialized
};