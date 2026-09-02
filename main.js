const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

let appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

appState.initialize = function() {
  this.initialized = true;
  console.log('Initializing application...');
  return true;
};

appState.getConfig = function() {
  return config;
};

appState.validateInput = function(input) {
  return input !== null && input !== undefined;
};

appState.processData = function(data) {
  if (!this.validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
};

function validateLandmark(landmark) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!landmark.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(landmark.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${landmark.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

function getLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en';
}

/**
 * Wraps primary content in a main element with proper language attribute
 * @returns {Object} Main element configuration with lang attribute and role
 */
function wrapPrimaryContentInMain() {
  const main = document.querySelector('main');
  if (!main) {
    const newMain = document.createElement('main');
    document.body.insertBefore(newMain, document.body.firstChild);
  }
  const lang = getLangAttribute();
  const mainConfig = {
    elementType: 'main',
    lang,
    role: 'main',
    'aria-label': 'Primary Content'
  };
  main.setAttributes(mainConfig);
  return mainConfig;
}

function getFullLangAttribute() {
  const lang = getLangAttribute();
  return document.documentElement.hasAttribute('dir') ? lang + '-' + document.documentElement.getAttribute('dir') : lang;
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  // Check for caption (conflict resolved)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute (conflict resolved)
  if (!table.hasAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells (conflict resolved)
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array|Object} tables - Array of table objects or single table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];

  // Handle both single table element and array of tables
  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    // Check for rows (conflict resolved)
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }

    // Validate table accessibility (conflict resolved)
    const result = validateTableAccessibility(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

// New functions to address accessibility issues

/**
 * Adds lang attribute to HTML element
 */
function addLangAttribute() {
  const lang = getFullLangAttribute();
  document.documentElement.setAttribute('lang', lang);
  return lang;
}

/**
 * Fixes table structure issues
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has caption (conflict resolved)
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
    }
    // Add headers attribute if missing (conflict resolved)
    if (!table.hasAttribute('headers')) {
      table.setAttribute('headers', 'true');
    }
  });
}

/**
 * Fixes scope attribute on header cells (conflict resolved)
 */
function fixTableHeaderCellScope() {
  const headerCells = document.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      cell.setAttribute('scope', 'col');
    }
  });
}

// Export all existing and new functions
module.exports = {
  validateLandmark,
  validateTableAccessibility,
  validateTableStructure,
  getLangAttribute,
  wrapPrimaryContentInMain,
  getFullLangAttribute,
  fixTableStructureIssues,
  fixTableHeaderCellScope
};