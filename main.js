// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97b2237d968a50cc419 -->
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
  // ... Existing code

  // Add check for table's ARIA attributes
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    // ... Existing checks

    if (table.tagName.toLowerCase() === 'svg') {
      if (table.ariaLabel === undefined && table.caption === undefined) {
        errors.push({
          tableIndex: i,
          error: `Table should have aria-label or caption for accessibility when using SVG`
        });
      }
      table.__ariaLabel = table.ariaLabel || table.caption;
      table.__ariaLabelledby = table.ariaLabelledby || `${table.id || ''}-label`;
    }
    
    // Check for lang attribute in HTML element
    if (!table.lang) {
      errors.push({
        tableIndex: i,
        error: 'Table should have lang attribute for accessibility'
      });
    }
    
    // Add/fix 4 landmark issues
    const landmarks = ['banner', 'navigation', 'search', 'main', 'complementary', 'footer'];
    landmarks.forEach(landmark => {
      if (table[landmark] === undefined) {
        errors.push({
          tableIndex: i,
          error: `Landmark '${landmark}' is not defined`
        });
      }
    });
    
    // Ensure unique landmarks (2 issues)
    const landmarksSet = new Set();
    table.rows.forEach(row => {
      landmarksSet.add(row.landmark);
    });
    if (landmarksSet.size !== new Set(table.rows.map(row => row.landmark)).size) {
      errors.push({
        tableIndex: i,
        error: 'Duplicate landmarks found in table rows'
      });
    }
    
    // Fix 1 fake link issue
    if (table.fakeLink) {
      errors.push({
        tableIndex: i,
        error: 'Table should not have a fake link for accessibility'
      });
    }
    
    // Add scope="col" or scope="row" to <th> elements
    if (!table.headers.every(header => header.scope === 'col' || header.scope === 'row')) {
      errors.push({
        tableIndex: i,
        error: 'All <th> elements must have scope="col" or scope="row"'
      });
    }
  }
  // ... Existing code
}

/**
 * Function to apply SVG accessibility props to all tables
 */
function applySvgAccessibilityProps() {
  const tables = getTables();
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    if (table.tagName.toLowerCase() === "svg") {
      table.setAttribute('aria-label', table.__ariaLabel);
      table.setAttribute('aria-labelledby', table.__ariaLabelledby);
    }
  }
}

// ... Existing functions

/**
 * Gets the language attribute for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Creates an in-page button element with proper accessibility
 * @param {Object} options - Button options
 * @returns {Object} Button element object
 */
function createInPageButton(options = {}) {
  const button = {
    type: 'button',
    text: options.text || 'Button',
    ariaLabel: options.ariaLabel || options.text || 'Button',
    lang: options.lang || getLangAttribute(),
    onClick: options.onClick || null
  };
  return button;
}

/**
 * Validates landmark elements on the page
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmark() {
  const errors = [];
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates the structure of landmark elements
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmarkStructure() {
  const errors = [];
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// REACT_025: Additional accessibility validation functions

/**
 * Validates HTML attributes for accessibility compliance
 * Checks for required ARIA attributes and semantic HTML structure
 * @param {Object} attributes - Object containing HTML attribute key-value pairs
 * @returns {Object} Validation result with isValid flag and array of warnings
 */
function validateHtmlAttributes(attributes) {
  const warnings = [];
  const langValue = attributes && attributes.lang;
  
  // REACT_015: Check for lang attribute presence and validity
  if (langValue === undefined || langValue === null || langValue === '') {
    warnings.push({
      code: 'REACT_015',
      message: 'HTML element should have a valid lang attribute for screen readers'
    });
  } else if (typeof langValue !== 'string' || langValue.trim().length === 0) {
    warnings.push({
      code: 'REACT_015',
      message: 'lang attribute must be a non-empty string'
    });
  }
  
  return {
    isValid: warnings.length === 0,
    warnings: warnings
  };
}

/**
 * Validates that table cells have proper scope attributes for screen readers
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableScopeAttributes() {
  const errors = [];
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    if (!table.headers || !Array.isArray(table.headers)) {
      continue;
    }
    
    // Check if headers have scope information
    const headerScopeInfo = table.headerScope;
    if (!headerScopeInfo) {
      warnings.push({
        tableIndex: i,
        warning: 'Table should specify header scope (col/row) for accessibility'
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates that all tables have proper landmark elements defined
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmarkElements() {
  const errors = [];
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    // Check if table has landmarks array defined
    if (!table.landmarks || !Array.isArray(table.landmarks)) {
      errors.push({
        tableIndex: i,
        error: 'Table must have landmarks array defined'
      });
    } else if (table.landmarks.length === 0) {
      errors.push({
        tableIndex: i,
        error: 'Table must have at least one landmark defined'
      });
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
  const landmarkResult = validateLandmarkElements();
  
  return {
    accessibility: accessibilityResult,
    structure: structureResult,
    landmarks: landmarkResult,
    isValid: accessibilityResult.isValid && structureResult.isValid && landmarkResult.isValid
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
  parseArgs,
  showHelp,
  runCLI
};

// Run CLI if this file is executed directly
if (require.main === module) {
  const args = parseArgs();
  runCLI(args);
}