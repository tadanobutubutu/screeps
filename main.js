// Main application file

const fs = require('fs');
const path = require('path');

/**
 * Counts all dependencies (regular + dev) from package.json
 * @returns {number} Total count of dependencies
 */
function countDependencies() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return Object.keys(dependencies).length + Object.keys(devDependencies).length;
  } catch (error) {
    console.error('Error counting dependencies:', error.message);
    return 0;
  }
}

/**
 * Gets the count of regular dependencies only
 * @returns {number} Count of regular dependencies
 */
function countRegularDependencies() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    return Object.keys(dependencies).length;
  } catch (error) {
    return 0;
  }
}

/**
 * Gets the count of dev dependencies only
 * @returns {number} Count of dev dependencies
 */
function countDevDependencies() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const devDependencies = packageJson.devDependencies || {};
    return Object.keys(devDependencies).length;
  } catch (error) {
    return 0;
  }
}

// Import the modules if necessary
// ... (Add necessary imports if needed)

// PRESERVE the current code, exports, and functions

// TODO: Re-add the required exports for functionA and functionB
// Assuming that they are objects with properties X, Y, and Z
const functionA = {
  // ... (Preserve the existing code for functionA)

  X: functionX, // Do not remove or rename this export
  Y: functionY, // Do not remove or rename this export
  Z: functionZ, // Do not remove or rename this export
};

const functionB = {
  // ... (Preserve the existing code for functionB)

  X: functionXb, // Do not remove or rename this export
  Y: functionYb, // Do not remove or rename this export
  Z: functionZb, // Do not remove or rename this export
};

module.exports = {
  countDependencies,
  countRegularDependencies,
  countDevDependencies,
  // Preserve the existing module exports
  functionA,
  functionB
};