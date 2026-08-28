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

module.exports = {
  countDependencies,
  countRegularDependencies,
  countDevDependencies
};