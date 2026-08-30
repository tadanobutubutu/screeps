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
 * Checks for unique landmark roles across the application
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateUniqueLandmarks() {
  const errors = [];
  const tables = getTables();
  const landmarkRolesMap = {};

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    if (table.headers && Array.isArray(table.headers)) {
      for (let j = 0; j < table.headers.length; j++) {
        const header = table.headers[j];
        if (header && typeof header === 'object' && header.role) {
          const role = header.role;
          if (!landmarkRolesMap[role]) {
            landmarkRolesMap[role] = [];
          }
          landmarkRolesMap[role].push({ tableIndex: i, headerIndex: j });
        }
      }
    }
  }

  for (const role in landmarkRolesMap) {
    if (landmarkRolesMap[role].length > 1) {
      errors.push({
        role: role,
        locations: landmarkRolesMap[role],
        error: `Landmark role "${role}" is used multiple times`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Checks for fake link issues (links that don't navigate or are not proper anchors)
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateFakeLinks() {
  const errors = [];
  const tables = getTables();

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    if (table.headers && Array.isArray(table.headers)) {
      for (let j = 0; j < table.headers.length; j++) {
        const header = table.headers[j];
        if (header && typeof header === 'object' && header.text) {
          const text = header.text.toString();
          if (text.startsWith('#') && text.length === 1) {
            errors.push({
              tableIndex: i,
              headerIndex: j,
              text: text,
              error: 'Fake link detected: anchor with no href target'
            });
          }
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates that all SVGs in the application have accessible names
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateSvgAccessibility() {
  const errors = [];
  const tables = getTables();

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    if (table.headers && Array.isArray(table.headers)) {
      for (let j = 0; j < table.headers.length; j++) {
        const header = table.headers[j];
        if (header && typeof header === 'object' && header.svg) {
          const svg = header.svg;
          if (!svg.alt && !svg.title && !svg.descr) {
            errors.push({
              tableIndex: i,
              headerIndex: j,
              error: 'SVG is missing accessible name (alt, title, or descr attribute)'
            });
          }
        }
      }
    }

    if (table.rows && Array.isArray(table.rows)) {
      for (let k = 0; k < table.rows.length; k++) {
        const row = table.rows[k];
        if (Array.isArray(row)) {
          for (let l = 0; l < row.length; l++) {
            const cell = row[l];
            if (cell && typeof cell === 'object' && cell.svg) {
              const svg = cell.svg;
              if (!svg.alt && !svg.title && !svg.descr) {
                errors.push({
                  tableIndex: i,
                  rowIndex: k,
                  cellIndex: l,
                  error: 'SVG is missing accessible name (alt, title, or descr attribute)'
                });
              }
            }
          }
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates and adds scope attributes to header elements
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateHeaderScope() {
  const errors = [];
  const tables = getTables();

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    if (table.headers && Array.isArray(table.headers)) {
      for (let j = 0; j < table.headers.length; j++) {
        const header = table.headers[j];
        if (header && typeof header === 'object') {
          if (!header.scope || (header.scope !== 'col' && header.scope !== 'row')) {
            errors.push({
              tableIndex: i,
              headerIndex: j,
              error: 'Header element missing valid scope attribute (scope="col" or scope="row")'
            });
          }
        }
      }
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
  validateAllTables,
  validateUniqueLandmarks,
  validateFakeLinks,
  validateSvgAccessibility,
  validateHeaderScope
};