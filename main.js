// main.js - Entry point for the application

const fs = require('fs');
const path = require('path');

/**
 * Counts the total number of dependencies from package.json
 * @returns {number} Total count of dependencies (dependencies + devDependencies)
 */
function countDependencies() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageData.dependencies || {};
    const devDependencies = packageData.devDependencies || {};
    
    return Object.keys(dependencies).length + Object.keys(devDependencies).length;
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return 0;
  }
}

// Example usage and exports
function getAppInfo() {
  return {
    name: 'my-app',
    version: '1.0.0'
  };
}

function calculateSomething(a, b) {
  return a + b;
}

module.exports = {
  countDependencies,
  getAppInfo,
  calculateSomething
};