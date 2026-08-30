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
 * Add lang attribute to HTML element
 * REACT_015: Ensures the HTML element has a lang attribute for accessibility
 * @param {Document|Element} doc - Document or element to modify
 * @returns {Document|Element} Modified document or element
 */
function addLangAttribute(doc) {
  const element = doc.documentElement || doc;
  if (!element.hasAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
  return doc;
}

/**
 * Fix table structure issues
 * REACT_027: Ensures tables have proper thead/tbody structure
 * @param {Document|Element} doc - Document or element to modify
 * @returns {Document|Element} Modified document or element
 */
function fixTableStructureIssues(doc) {
  const tables = doc.querySelectorAll ? doc.querySelectorAll('table') : [];
  tables.forEach(table => {
    if (table.querySelector('thead') === null && table.rows && table.rows.length > 0) {
      const thead = doc.createElement('thead');
      thead.appendChild(table.rows[0]);
      table.insertBefore(thead, table.firstChild);
    }
    if (!table.querySelector('tbody') && table.rows && table.rows.length > 1) {
      const tbody = doc.createElement('tbody');
      for (let i = 1; i < table.rows.length; i++) {
        tbody.appendChild(table.rows[i]);
      }
      table.appendChild(tbody);
    }
  });
  return doc;
}

/**
 * Add main landmark
 * REACT_017: Ensures the page has a proper main landmark
 * @param {Document|Element} doc - Document or element to modify
 * @returns {Document|Element} Modified document or element
 */
function addMainLandmark(doc) {
  const body = doc.body || doc;
  const existingMain = body.querySelector ? body.querySelector('main, [role="main"]') : null;
  if (!existingMain) {
    const main = doc.createElement('main');
    main.setAttribute('role', 'main');
    if (body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else {
      body.appendChild(main);
    }
  }
  return doc;
}

/**
 * Add accessible names to SVGs
 * REACT_041: Ensures SVG elements have accessible names
 * @param {Document|Element} doc - Document or element to modify
 * @returns {Document|Element} Modified document or element
 */
function addSvgAccessibleNames(doc) {
  const svgs = doc.querySelectorAll ? doc.querySelectorAll('svg') : [];
  let svgCount = 0;
  svgs.forEach(svg => {
    const hasAccessibleName = svg.getAttribute('aria-label') || 
                              svg.getAttribute('aria-labelledby') || 
                              svg.querySelector('title');
    if (!hasAccessibleName) {
      svgCount++;
      svg.setAttribute('aria-label', `SVG graphic ${svgCount}`);
      const title = doc.createElement('title');
      title.textContent = `SVG graphic ${svgCount}`;
      svg.insertBefore(title, svg.firstChild);
    }
  });
  return doc;
}

/**
 * Ensure unique landmarks
 * REACT_025: Ensures only one main landmark exists per page
 * @param {Document|Element} doc - Document or element to modify
 * @returns {Document|Element} Modified document or element
 */
function ensureUniqueLandmarks(doc) {
  const body = doc.body || doc;
  const mains = body.querySelectorAll ? body.querySelectorAll('main, [role="main"]') : [];
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].removeAttribute('role');
      mains[i].removeAttribute('aria-label');
    }
  }
  return doc;
}

/**
 * Fix fake link issues
 * REACT_036: Converts links without href to proper buttons or adds role
 * @param {Document|Element} doc - Document or element to modify
 * @returns {Document|Element} Modified document or element
 */
function fixFakeLinkIssue(doc) {
  const links = doc.querySelectorAll ? doc.querySelectorAll('a') : [];
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '' || href === null) {
      if (!link.hasAttribute('role')) {
        link.setAttribute('role', 'button');
      }
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
  return doc;
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
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue
};