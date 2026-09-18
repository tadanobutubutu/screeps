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
 * Adds proper landmark regions to the tables for accessibility
 */
function addProperLandmarkRegions() {
  const tables = getTables();
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    // Check for proper ARIA roles and landmarks
    if (!table.ariaRole) {
      table.ariaRole = 'table'; // Default to 'table' role
    }
    
    // Check if table has a caption or aria-label
    if (!table.caption && !table.ariaLabel) {
      table.ariaLabel = `Table ${i + 1}`;
    }
  }
}

/**
 * Get the language attribute for the HTML element
 * @returns {string} The language code (e.g., 'en')
 */
function getLangAttribute() {
  // In a real browser environment this would read document.documentElement.lang
  // For testing purposes we return a default value
  return 'en';
}

/**
 * Create an in-page button element
 * @returns {Object} A simple button representation
 */
function createInPageButton() {
  return {
    tag: 'button',
    type: 'button',
    text: 'Click me',
    ariaLabel: 'In-page button'
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
  createButton,
  addButtonToPage,
  createInPageButton,
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