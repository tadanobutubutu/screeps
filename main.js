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
 * Ensures a table has proper accessibility attributes
 * @param {Object} table - Table object to enhance
 * @returns {Object} Table with accessibility attributes added
 */
function ensureTableAccessibility(table) {
  if (!table || typeof table !== 'object') {
    throw new Error('Table must be a valid object');
  }
  
  // Ensure table has a caption or aria-label for screen readers
  if (!table.caption && !table.ariaLabel) {
    table.caption = table.caption || 'Data table';
  }
  
  // Ensure headers array exists and has content
  if (!table.headers || !Array.isArray(table.headers)) {
    table.headers = [];
  }
  
  // Ensure rows array exists
  if (!table.rows || !Array.isArray(table.rows)) {
    table.rows = [];
  }
  
  // Ensure each header cell has proper scope information
  table.headers = table.headers.map((header, index) => {
    if (typeof header === 'string') {
      return {
        content: header,
        scope: 'col',
        id: `header-${index}`
      };
    }
    if (typeof header === 'object' && header !== null) {
      header.scope = header.scope || 'col';
      header.id = header.id || `header-${index}`;
      return header;
    }
    return { content: String(header), scope: 'col', id: `header-${index}` };
  });
  
  // Mark table as accessibility-enhanced
  table._accessibilityEnhanced = true;
  
  return table;
}

/**
 * Creates an accessible table structure with proper semantics
 * @param {Object} tableConfig - Configuration for the table
 * @returns {Object} Accessible table object
 */
function createAccessibleTable(tableConfig) {
  const { headers, rows, caption, ariaLabel } = tableConfig;
  
  const table = {
    headers: headers || [],
    rows: rows || [],
    caption: caption,
    ariaLabel: ariaLabel
  };
  
  return ensureTableAccessibility(table);
}

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
  ensureTableAccessibility,
  createAccessibleTable
};