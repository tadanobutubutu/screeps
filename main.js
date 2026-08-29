// Main application entry point

const fs = require('fs');
const path = require('path');

// Example dependencies object (this might be loaded from package.json or elsewhere)
const dependencies = {
  'lodash': '^4.17.21',
  'express': '^4.18.2',
  'axios': '^1.6.0',
  'jest': '^29.7.0'
};

/**
 * Counts the number of dependencies in the project
 * @returns {number} The total count of dependencies
 */
function countDependencies() {
  let count = 0;
  
  for (const key in dependencies) {
    if (dependencies.hasOwnProperty(key)) {
      count++;
    }
  }
  
  return count;
}

/**
 * Gets dependency names
 * @returns {string[]} Array of dependency names
 */
function getDependencyNames() {
  return Object.keys(dependencies);
}

/**
 * Gets all dependencies
 * @returns {Object} The dependencies object
 */
function getAllDependencies() {
  return { ...dependencies };
}

// Existing function to display app info
function displayInfo() {
  console.log('Application Info:');
  console.log('==================');
  console.log(`Total Dependencies: ${countDependencies()}`);
  console.log(`Dependency Names: ${getDependencyNames().join(', ')}`);
}

// TODO: Implement a function to count dependencies

// Export functions for use in tests and other modules
module.exports = {
  countDependencies,
  getDependencyNames,
  getAllDependencies,
  displayInfo
};

// Run if called directly
if (require.main === module) {
  displayInfo();
}