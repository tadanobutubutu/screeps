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
 * Parse command line arguments
 * @returns {Object} Parsed arguments object
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    validate: false,
    help: false,
    config: null,
    file: null
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--validate' || arg === '-v') {
      parsed.validate = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--config' || arg === '-c') {
      if (args[i + 1] && !args[i + 1].startsWith('-')) {
        parsed.config = args[i + 1];
        i++;
      }
    } else if (!arg.startsWith('-')) {
      parsed.file = arg;
    }
  }
  
  return parsed;
}

/**
 * Display CLI help message
 */
function showHelp() {
  console.log('Usage: node main.js [options] [file]');
  console.log('');
  console.log('Options:');
  console.log('  -v, --validate    Run validation on loaded tables');
  console.log('  -c, --config      Specify configuration file');
  console.log('  -h, --help        Display this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node main.js --validate');
  console.log('  node main.js -v tables.json');
}

/**
 * Run CLI with parsed arguments
 * @param {Object} args - Parsed command line arguments
 */
function runCLI(args) {
  if (args.help) {
    showHelp();
    return;
  }
  
  if (args.validate) {
    const result = validateAllTables();
    
    console.log('Validation Results:');
    console.log('-------------------');
    
    if (result.isValid) {
      console.log('✓ All tables passed validation');
    } else {
      console.log('✗ Validation failed');
      
      if (!result.accessibility.isValid) {
        console.log('\nAccessibility Errors:');
        result.accessibility.errors.forEach(err => {
          console.log(`  - Table ${err.tableIndex}: ${err.error}`);
        });
      }
      
      if (!result.structure.isValid) {
        console.log('\nStructure Errors:');
        result.structure.errors.forEach(err => {
          let msg = `  - Table ${err.tableIndex}`;
          if (err.rowIndex !== undefined) {
            msg += `, Row ${err.rowIndex}`;
          }
          msg += `: ${err.error}`;
          console.log(msg);
        });
      }
    }
    
    console.log('');
    console.log(`Tables validated: ${getTables().length}`);
  }
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
  parseArgs,
  showHelp,
  runCLI
};

// Run CLI if this file is executed directly
if (require.main === module) {
  const args = parseArgs();
  runCLI(args);
}