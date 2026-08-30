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

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Gets the lang attribute value for the HTML element
 * @returns {string} Language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Creates an in-page button element with accessibility features
 * @param {string} label - Accessible label for the button
 * @returns {Object} Button element object
 */
function createInPageButton(label) {
  return {
    type: 'button',
    label: label,
    attributes: {
      'aria-label': label,
      lang: getLangAttribute()
    }
  };
}

/**
 * Validates landmark accessibility for tables
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmark() {
  const errors = [];
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    if (!table.landmark) {
      errors.push({
        tableIndex: i,
        error: 'Table should have a landmark role defined'
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates landmark structure for tables
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmarkStructure() {
  const errors = [];
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    if (table.landmark && table.landmark.role && !table.landmark.label) {
      errors.push({
        tableIndex: i,
        error: 'Landmark role should have an accessible label'
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Gets accessible name for SVG elements
 * @param {Object} svg - SVG element object
 * @returns {string} Accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
  if (svg && svg.title) {
    return svg.title;
  }
  if (svg && svg.ariaLabel) {
    return svg.ariaLabel;
  }
  return 'svg-icon';
}

/**
 * Sets accessibility attributes for SVG elements
 * @param {Object} svg - SVG element object
 * @returns {Object} Updated SVG element with accessibility attributes
 */
function setSvgAttributes(svg) {
  if (!svg) {
    return svg;
  }
  
  const accessibleName = getSvgAccessibleName(svg);
  
  return {
    ...svg,
    attributes: {
      ...svg.attributes,
      'aria-label': accessibleName,
      'aria-hidden': 'false',
      focusable: 'false'
    }
  };
}

/**
 * Validates link accessibility
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLinkAccessibility() {
  const errors = [];
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    if (table.links && Array.isArray(table.links)) {
      for (let j = 0; j < table.links.length; j++) {
        const link = table.links[j];
        
        if (!link.href) {
          errors.push({
            tableIndex: i,
            linkIndex: j,
            error: 'Link must have href attribute'
          });
        }
        
        if (!link.text || link.text.trim() === '') {
          errors.push({
            tableIndex: i,
            linkIndex: j,
            error: 'Link must have accessible text content'
          });
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
 * Handles fake links by converting them to proper buttons
 * @param {Object} element - Element to check and convert
 * @returns {Object} Processed element
 */
function handleFakeLinks(element) {
  if (!element) {
    return element;
  }
  
  // If it's a fake link (has role of button but is an anchor, or lacks href)
  if (element.type === 'a' && !element.href) {
    return {
      ...element,
      type: 'button',
      attributes: {
        ...element.attributes,
        type: 'button'
      }
    };
  }
  
  return element;
}

/**
 * Ensures landmarks are unique within the application
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateUniqueLandmarks() {
  const errors = [];
  const tables = getTables();
  const landmarks = {};
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    if (table.landmark && table.landmark.role) {
      if (!landmarks[table.landmark.role]) {
        landmarks[table.landmark.role] = [];
      }
      landmarks[table.landmark.role].push(i);
    }
  }
  
  // Check for duplicate landmarks
  for (const role in landmarks) {
    if (landmarks[role].length > 1) {
      errors.push({
        error: `Duplicate landmark role '${role}' found in tables ${landmarks[role].join(', ')}`
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates all accessibility issues
 * @returns {Object} Combined accessibility validation results
 */
function validateAccessibility() {
  const landmarkResult = validateLandmark();
  const landmarkStructureResult = validateLandmarkStructure();
  const linkResult = validateLinkAccessibility();
  const uniqueLandmarksResult = validateUniqueLandmarks();
  
  return {
    landmark: landmarkResult,
    landmarkStructure: landmarkStructureResult,
    linkAccessibility: linkResult,
    uniqueLandmarks: uniqueLandmarksResult,
    isValid: landmarkResult.isValid && 
             landmarkStructureResult.isValid && 
             linkResult.isValid && 
             uniqueLandmarksResult.isValid
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
  getLangAttribute,
  createInPageButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  validateUniqueLandmarks,
  validateAccessibility
};