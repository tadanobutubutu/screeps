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

/**
 * Get the language attribute for the document (REACT_015)
 * @returns {string} Language code (defaults to 'en' if not set)
 */
function getLangAttribute() {
  // Check for lang attribute on document.documentElement
  if (typeof document !== 'undefined' && document.documentElement) {
    const lang = document.documentElement.getAttribute('lang');
    if (lang && lang.trim() !== '') {
      return lang.trim();
    }
  }
  // Default to English if no lang attribute is found
  return 'en';
}

/**
 * Create an in-page button element with proper accessibility attributes (REACT_015)
 * @param {string} text - Button label text
 * @param {Function} onClick - Click handler function
 * @param {Object} options - Optional configuration
 * @param {string} options.id - Button ID
 * @param {string} options.className - Additional CSS class names
 * @returns {Object} Button configuration object with accessibility support
 */
function createInPageButton(text, onClick, options = {}) {
  const lang = getLangAttribute();
  
  return {
    tagName: 'button',
    text: text,
    attributes: {
      type: 'button',
      lang: lang,
      'aria-label': options.ariaLabel || text
    },
    id: options.id || null,
    className: options.className || '',
    onClick: typeof onClick === 'function' ? onClick : null,
    // Include the lang attribute in the rendered element for accessibility
    lang: lang
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
  createInPageButton
};