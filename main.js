const loop = require('./loop');
const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {}

/**
 * Checks if a table data array has the required structure
 * @param {Array} tableData - The table data to check
 * @param {Array} requiredColumns - List of required column names
 * @returns {Object} - { valid: boolean, missingColumns: string[] }
 */
function checkTableData(tableData, requiredColumns) {
    if (!Array.isArray(tableData) || tableData.length === 0) {
        return { valid: false, missingColumns: requiredColumns };
    }
    
    const headers = tableData[0];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    return {
        valid: missingColumns.length === 0,
        missingColumns
    };
}

// Implement validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];
  
  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }
  
  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }
  
  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }
  
  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function initialize(options = {}) {
  if (isInitialized) {
    logger.warn('App already initialized');
    return false;
  }
  
  config.set(options);
  isInitialized = true;
  logger.info('Application initialized');
  return true;
}

function getAppState() {
  return {
    isInitialized,
    ...appData
  };
}

function setData(key, value) {
  appData[key] = value;
  return appData;
}

function getData(key) {
  return appData[key];
}

function shutdown() {
  isInitialized = false;
  logger.info('Application shutdown complete');
}

// Additional functions from origin
function newFunction() {
  // Implementation of the new function
  console.log('This is the new function.');
}

function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

module.exports = {
  loop,
  validateLandmark,
  checkTableData,
  initialize,
  getAppState,
  setData,
  getData,
  shutdown,
  config,
  logger,
  newFunction,
  modifiedFunction
};