// main.js - Entry point for the application

const fs = require('fs');
const path = require('path');

// Configuration object
const config = {
  name: 'dependency-analyzer',
  version: '1.0.0',
  dependencies: {
    lodash: '^4.17.21',
    axios: '^1.6.0',
    express: '^4.18.2'
  },
  devDependencies: {
    jest: '^29.7.0',
    eslint: '^8.50.0'
  }
};

// Read package.json if it exists
function readPackageJson() {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

// Get all dependencies (both production and dev)
function getAllDependencies() {
  const packageData = readPackageJson();
  if (!packageData) {
    return { ...config.dependencies, ...config.devDependencies };
  }
  return { 
    ...packageData.dependencies, 
    ...packageData.devDependencies 
  };
}

/**
 * Count the total number of dependencies
 * @returns {number} The total count of dependencies
 */
function countDependencies() {
  const allDeps = getAllDependencies();
  return Object.keys(allDeps).length;
}

// Export all functions and data
module.exports = {
  config,
  readPackageJson,
  getAllDependencies,
  countDependencies
};

// CLI execution
if (require.main === module) {
  console.log('Dependency Analyzer');
  console.log('-------------------');
  console.log(`Total dependencies: ${countDependencies()}`);
  console.log(`Dependencies: ${JSON.stringify(getAllDependencies(), null, 2)}`);
}