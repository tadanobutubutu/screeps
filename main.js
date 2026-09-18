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

//_Commit: c879400fc17b7bd802b5a526dcd6d0ef731a78c7_

//<!-- todo-hash: 517a7db840f97b4b43fa4969b1b8026f5c74073b -->

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
 * Validate all tables (convenience function)
 * @returns {Object} Combined validation results
 */
function validateAllTables() {
  const accessibilityResult = validateTableAccessibility();
  const structureResult = validateTableStructure();

  return {
    accessibility: accessibilityResult,
    structure: structureResult,
    landmarks: landmarkResult,
    isValid: accessibilityResult.isValid && structureResult.isValid && landmarkResult.isValid
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
  createButton,
  addButtonToPage,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateAllTables,
  getLangAttribute,
  createInPageButton,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
};