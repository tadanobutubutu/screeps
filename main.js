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
 * Get the language attribute for the HTML element (REACT_015)
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute string
 */
function getLangAttribute(lang = 'en') {
  if (!lang || typeof lang !== 'string' || lang.length === 0) {
    return 'lang="en"';
  }
  return `lang="${lang}"`;
}

/**
 * Get landmark role based on element type (REACT_017)
 * @param {string} elementType - Type of element (e.g., 'nav', 'main', 'aside', 'header', 'footer')
 * @returns {string} The appropriate landmark role
 */
function getLandmarkRole(elementType) {
  const landmarkRoles = {
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'header': 'banner',
    'footer': 'contentinfo',
    'section': 'region',
    'form': 'form',
    'search': 'search'
  };
  
  return landmarkRoles[elementType.toLowerCase()] || 'region';
}

/**
 * Validate that landmarks are unique (REACT_025)
 * @param {Array} landmarks - Array of landmark objects with type and label
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmarks(landmarks) {
  const errors = [];
  const seenLandmarks = new Map();
  
  if (!Array.isArray(landmarks)) {
    return {
      isValid: false,
      errors: [{ error: 'Landmarks must be an array' }]
    };
  }
  
  const uniqueLandmarkTypes = ['nav', 'main', 'aside', 'header', 'footer'];
  
  for (let i = 0; i < landmarks.length; i++) {
    const landmark = landmarks[i];
    const key = `${landmark.type}-${landmark.label || ''}`;
    
    // Check for duplicate landmarks with same type
    if (seenLandmarks.has(key)) {
      errors.push({
        index: i,
        error: `Duplicate landmark: ${landmark.type} with label "${landmark.label || 'unnamed'}"`
      });
    }
    
    seenLandmarks.set(key, i);
    
    // Check for multiple instances of unique landmark types
    const typeCount = landmarks.filter(l => l.type === landmark.type).length;
    if (uniqueLandmarkTypes.includes(landmark.type) && typeCount > 1) {
      errors.push({
        index: i,
        error: `Multiple ${landmark.type} landmarks found (${typeCount}). Should only have one.`
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Create an accessible in-page button with proper landmark and accessibility attributes (REACT_015, REACT_017)
 * @param {Object} options - Button options
 * @param {string} options.text - Button label text
 * @param {string} options.id - Unique identifier
 * @param {string} options.onClick - Click handler function name
 * @param {string} options.ariaLabel - Optional ARIA label
 * @returns {Object} Button configuration object
 */
function createInPageButton(options = {}) {
  const { text = '', id = '', onClick = '', ariaLabel = '' } = options;
  
  if (!text) {
    throw new Error('Button text is required');
  }
  
  const buttonConfig = {
    type: 'button',
    text: text,
    id: id,
    role: 'button',
    tabIndex: 0,
    ariaLabel: ariaLabel || text
  };
  
  if (onClick) {
    buttonConfig.onClick = onClick;
  }
  
  return buttonConfig;
}

/**
 * Get accessible name for an SVG element (REACT_041)
 * @param {Object} svgConfig - SVG configuration
 * @param {string} svgConfig.title - SVG title element text
 * @param {string} svgConfig.description - SVG description (desc element)
 * @param {string} svgConfig.ariaLabel - Direct aria-label attribute
 * @returns {string} The computed accessible name
 */
function getSvgAccessibleName(svgConfig = {}) {
  const { title, description, ariaLabel } = svgConfig;
  
  if (ariaLabel && typeof ariaLabel === 'string') {
    return ariaLabel;
  }
  
  if (title && typeof title === 'string') {
    return title;
  }
  
  if (description && typeof description === 'string') {
    return description;
  }
  
  return '';
}

/**
 * Create an accessible link configuration instead of a fake link (REACT_036)
 * @param {Object} options - Link options
 * @param {string} options.href - URL the link points to
 * @param {string} options.text - Link text content
 * @param {boolean} options.isExternal - Whether the link points to external site
 * @param {string} options.ariaLabel - Optional ARIA label for additional context
 * @returns {Object} Link configuration object
 */
function createAccessibleLink(options = {}) {
  const { href = '#', text = '', isExternal = false, ariaLabel = '' } = options;
  
  const linkConfig = {
    type: 'a',
    tag: 'a',
    href: href,
    text: text,
    isExternal: isExternal
  };
  
  if (isExternal) {
    linkConfig.rel = 'noopener noreferrer';
    linkConfig.target = '_blank';
    // Add visual indicator for external links (accessible)
    linkConfig.ariaLabel = ariaLabel || `${text} (opens in new tab)`;
  } else {
    linkConfig.ariaLabel = ariaLabel || text;
  }
  
  return linkConfig;
}

/**
 * Validate SVG accessibility (REACT_041)
 * @param {Array} svgs - Array of SVG configuration objects
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateSvgAccessibility(svgs) {
  const errors = [];
  
  if (!Array.isArray(svgs)) {
    return {
      isValid: false,
      errors: [{ error: 'SVGs must be an array' }]
    };
  }
  
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    const accessibleName = getSvgAccessibleName(svg);
    
    if (!accessibleName) {
      errors.push({
        index: i,
        error: 'SVG must have an accessible name (title, desc, or aria-label)'
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
  validateTableAccessibility,
  validateTableStructure,
  validateAllTables,
  getLangAttribute,
  getLandmarkRole,
  validateLandmarks,
  createInPageButton,
  getSvgAccessibleName,
  createAccessibleLink,
  validateSvgAccessibility
};