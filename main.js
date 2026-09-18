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
 * Validates that landmark elements are properly defined for accessibility
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmarkElements() {
  const errors = [];
  const tables = getTables();
  
  // Define standard HTML5 landmark elements
  const landmarkElements = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    // Check if table has landmark role or element defined
    const hasLandmarkRole = table.role === 'region' || landmarkElements.some(el => table[el]);
    const hasLandmarkAria = table.ariaRole && landmarkElements.includes(table.ariaRole.replace('region', ''));
    const hasMainElement = table.isMain === true;
    
    // Table should have some form of landmark association for proper document structure
    if (!hasLandmarkRole && !hasLandmarkAria && !hasMainElement) {
      errors.push({
        tableIndex: i,
        error: 'Table should be associated with a landmark element (e.g., within main, section, or have role="region")'
      });
    }
    
    // Check for nested landmarks (which can be problematic)
    if (table.containedInLandmark === undefined) {
      // Tables should be aware of their landmark container
      errors.push({
        tableIndex: i,
        error: 'Table should specify which landmark element contains it'
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates that all tables in the application meet accessibility standards
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility() {
  // ... existing code ...

  // Add the new function to get the lang attribute
  function getLangAttribute(table) {
    const lang = table.lang || table.getAttribute('lang');
    return lang || document.documentElement.lang || '';
  }

  // Implement createInPageButton() function to set the lang attribute
  function createInPageButton() {
    const button = document.createElement('button');
    button.innerText = 'Generate Report';
    button.addEventListener('click', generateReport);

    // Set the lang attribute using getLangAttribute()
    if (appData.config.validateAccessibility) {
      button.setAttribute('lang', getLangAttribute(tables[0]));
    }

    return button;
  }

  // Add language validation for tables
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    // ... existing code ...
    // Check if table has the correct lang attribute
    if (table.lang !== getLangAttribute(table)) {
      errors.push({
        tableIndex: i,
        error: 'Table should have correct lang attribute'
      });
    }
  }
  // ... existing code ...
}

/**
 * Module exports
 * Export new createInPageButton() function
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
  const landmarkResult = validateLandmarkElements();
  
  return {
    accessibility: accessibilityResult,
    structure: structureResult,
    landmarks: landmarkResult,
    isValid: accessibilityResult.isValid && structureResult.isValid && landmarkResult.isValid
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
  createButton,
  addButtonToPage,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkElements,
  validateAllTables
};