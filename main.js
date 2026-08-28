// main.js

// ============================================================================
// Application Entry Point
// ============================================================================

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  basePath: process.cwd(),
  outputPath: path.join(process.cwd(), 'dist'),
  verbose: false
};

// State
let state = {
  initialized: false,
  processed: 0
};

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize the application
 */
function initialize() {
  if (state.initialized) {
    console.log('Already initialized');
    return;
  }
  
  console.log('Initializing application...');
  state.initialized = true;
  state.processed = 0;
}

// ============================================================================
// Landmark Structure Checking
// ============================================================================

// TODO: Implement this function for checking landmark structure

/**
 * Checks the landmark structure of a DOM document or element
 * Validates that landmark elements are used correctly according to ARIA best practices
 * 
 * @param {Document|Element} context - The document or element to check
 * @returns {Object} An object containing validation results
 */
function checkLandmarkStructure(context) {
  const results = {
    isValid: true,
    errors: [],
    warnings: [],
    landmarks: {}
  };

  // Standard landmark elements (HTML5 sectioning elements)
  const landmarkElements = ['header', 'nav', 'main', 'aside', 'footer'];
  
  // Elements that should appear at most once in a document
  const uniqueLandmarks = ['main'];
  
  // Get context to search within
  const root = context instanceof Document ? context.documentElement : context;
  
  if (!root || typeof root.querySelector !== 'function') {
    results.isValid = false;
    results.errors.push('Invalid context: must be a Document or Element');
    return results;
  }

  // Check for required landmarks
  const mainElement = root.querySelector('main, [role="main"]');
  if (!mainElement) {
    results.isValid = false;
    results.errors.push('Missing required <main> landmark element');
  }

  // Count landmark occurrences
  for (const tag of landmarkElements) {
    const elements = root.querySelectorAll(tag);
    const roleElements = root.querySelectorAll(`[role="${tag}"]`);
    results.landmarks[tag] = {
      count: elements.length + roleElements.length,
      elements: Array.from(elements).map(el => ({
        tagName: el.tagName.toLowerCase(),
        hasId: !!el.id,
        id: el.id || null
      }))
    };
  }

  // Validate unique landmarks appear only once
  for (const tag of uniqueLandmarks) {
    if (results.landmarks[tag].count > 1) {
      results.isValid = false;
      results.errors.push(`More than one <${tag}> landmark found (should be at most 1)`);
    }
  }

  // Check header usage
  const headers = root.querySelectorAll('header');
  if (headers.length === 0) {
    results.warnings.push('No <header> landmark found');
  }

  // Check footer usage
  const footers = root.querySelectorAll('footer');
  if (footers.length === 0) {
    results.warnings.push('No <footer> landmark found');
  }

  // Check nav usage
  const navs = root.querySelectorAll('nav');
  if (navs.length === 0) {
    results.warnings.push('No <nav> landmark found (navigation should be in a nav element)');
  }

  return results;
}

/**
 * Validates landmark structure from HTML string
 * 
 * @param {string} htmlString - The HTML content to validate
 * @returns {Object} Validation results
 */
function validateLandmarksFromHTML(htmlString) {
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!htmlString || typeof htmlString !== 'string') {
    results.isValid = false;
    results.errors.push('Invalid input: expected HTML string');
    return results;
  }

  // Parse the HTML (basic parsing without full DOM)
  const landmarkPattern = /<(main|nav|header|footer|aside)[^>]*>/gi;
  const matches = htmlString.match(landmarkPattern) || [];
  
  const counts = {};
  for (const match of matches) {
    const tagName = match.replace(/[<\s]/gi, '').toLowerCase();
    counts[tagName] = (counts[tagName] || 0) + 1;
  }

  // Check for required main element
  if (!counts.main) {
    results.isValid = false;
    results.errors.push('Missing required <main> landmark element');
  }

  // Check for duplicate main elements
  if (counts.main && counts.main > 1) {
    results.isValid = false;
    results.errors.push('Multiple <main> elements found (only one allowed)');
  }

  // Warnings for missing optional landmarks
  if (!counts.header) {
    results.warnings.push('No <header> landmark found');
  }
  if (!counts.footer) {
    results.warnings.push('No <footer> landmark found');
  }
  if (!counts.nav) {
    results.warnings.push('No <nav> landmark found');
  }

  return results;
}

// ============================================================================
// Processing Functions
// ============================================================================

/**
 * Process a file
 * @param {string} filePath - Path to the file to process
 */
function processFile(filePath) {
  if (!state.initialized) {
    initialize();
  }
  
  state.processed++;
  
  if (CONFIG.verbose) {
    console.log(`Processing: ${filePath}`);
  }
  
  return {
    path: filePath,
    success: true
  };
}

/**
 * Process multiple files
 * @param {string[]} filePaths - Array of file paths to process
 */
function processFiles(filePaths) {
  return filePaths.map(processFile);
}

// ============================================================================
// Output Functions
// ============================================================================

/**
 * Write output to file
 * @param {string} filename - Output filename
 * @param {string} content - Content to write
 */
function writeOutput(filename, content) {
  const outputPath = path.join(CONFIG.outputPath, filename);
  
  try {
    if (!fs.existsSync(CONFIG.outputPath)) {
      fs.mkdirSync(CONFIG.outputPath, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Written: ${outputPath}`);
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
  }
}

// ============================================================================
// Configuration Functions
// ============================================================================

/**
 * Set configuration option
 * @param {string} key - Configuration key
 * @param {*} value - Configuration value
 */
function setConfig(key, value) {
  if (Object.prototype.hasOwnProperty.call(CONFIG, key)) {
    CONFIG[key] = value;
  }
}

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
function getConfig(key) {
  return CONFIG[key];
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  initialize,
  processFile,
  processFiles,
  checkLandmarkStructure,
  validateLandmarksFromHTML,
  writeOutput,
  setConfig,
  getConfig,
  CONFIG,
  state
};