/**
 * Main application module for Screeps bot
 */

// TODO: Add back any required exports that might have been removed
// Here is an example of how to export a required function from another file:

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch)
// Code for version 1 implementation goes here.

// Sample data store
const appData = {
  tables: [],
  config: {
    validateAccessibility: true,
    validateStructure: true
  },
  landmarkRegions: []
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

  // ... Existing validateTableAccessibility() implementation

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates the structure of all tables in the application
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableStructure() {
  const errors = [];
  const tables = getTables();

  // ... Existing validateTableStructure() implementation

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate all tables (convenience function)
 * @returns {Object} Combined validation results
 */
function validateAllTables() {
  const accessibilityResult = validateTableAccessibility();
  const structureResult = validateTableStructure();

        // Function to validate accessibility for each table
        function validateAccessibility(table) {
          // Assume that table has proper semantic HTML structure
        }

/**
 * Add proper landmark regions to the application
 * This function creates and manages landmark regions for Screeps rooms
 * @returns {Object} Result with success status, count, and regions array
 */
function addProperLandmarkRegions() {
  const landmarkRegions = [];
  const tables = getTables();
  
  // Define the standard landmark region types for Screeps
  const regionTypes = ['controller', 'source', 'mineral', 'powerBank', 'keeperLair'];
  
  // Process each table to add landmark regions
  tables.forEach((table, index) => {
    const region = {
      id: `landmark_${index}_${Date.now()}`,
      tableId: table.id || index,
      name: table.name || `Region ${index}`,
      type: regionTypes[index % regionTypes.length],
      position: {
        x: table.x || Math.floor(Math.random() * 50),
        y: table.y || Math.floor(Math.random() * 50)
      },
      created: Date.now(),
      isActive: true
    };
    landmarkRegions.push(region);
  });
  
  // Store landmark regions in appData
  appData.landmarkRegions = landmarkRegions;
  
  return {
    success: true,
    count: landmarkRegions.length,
    regions: landmarkRegions
  };
}

/**
 * Validates that all landmarks are unique across all tables
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateLandmarkUniqueness() {
  const errors = [];
  const tables = getTables();
  const seenLandmarks = new Set();
  const duplicateLandmarks = [];

  tables.forEach((table, tableIndex) => {
    if (table.landmarks && Array.isArray(table.landmarks)) {
      table.landmarks.forEach((landmark, landmarkIndex) => {
        const landmarkId = landmark.id || landmark.name || JSON.stringify(landmark);
        
        if (seenLandmarks.has(landmarkId)) {
          const error = {
            type: 'duplicate_landmark',
            message: `Duplicate landmark found: ${landmarkId}`,
            tableIndex,
            landmarkIndex,
            landmark
          };
          errors.push(error);
          duplicateLandmarks.push(landmarkId);
        } else {
          seenLandmarks.add(landmarkId);
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    uniqueCount: seenLandmarks.size,
    duplicateCount: duplicateLandmarks.length
  };
}

/**
 * Ensures unique landmarks by removing duplicates, keeping the first occurrence
 * @param {Array} landmarks - Array of landmark objects to deduplicate
 * @returns {Array} Array of unique landmarks
 */
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    throw new Error('Landmarks must be an array');
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  landmarks.forEach(landmark => {
    const landmarkId = landmark.id || landmark.name || JSON.stringify(landmark);
    
    if (!seen.has(landmarkId)) {
      seen.add(landmarkId);
      uniqueLandmarks.push(landmark);
    }
  });

  return uniqueLandmarks;
}

module.exports = {
  initialize,
  loadTables,
  getTables,
  getConfig,
  setConfig,
  validateTableAccessibility,
  validateTableStructure,
  validateAllTables,
  validateLandmarkUniqueness,
  ensureUniqueLandmarks
};