// main.js - Package Manager Core

const fs = require('fs');
const path = require('path');

/**
 * Get package.json content
 * @param {string} projectPath - Path to project directory
 * @returns {Object|null} Package.json object or null
 */
function getPackageJson(projectPath) {
  try {
    const packagePath = path.join(projectPath, 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Validate package.json structure
 * @param {Object} packageJson - Parsed package.json object
 * @returns {boolean} Whether package.json is valid
 */
function validatePackageJson(packageJson) {
  if (!packageJson || typeof packageJson !== 'object') {
    return false;
  }
  return true;
}

/**
 * Get all dependency types from package.json
 * @param {Object} packageJson - Parsed package.json object
 * @returns {Object} Object containing all dependency types
 */
function getDependencyTypes(packageJson) {
  return {
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
    peerDependencies: packageJson.peerDependencies || {},
    optionalDependencies: packageJson.optionalDependencies || {}
  };
}

// TODO: Implement a function to count dependencies
// This is a placeholder for the actual implementation

/**
 * Count the total number of dependencies in a package.json object
 * @param {Object} packageJson - Parsed package.json object
 * @returns {number} Total count of all dependencies
 */
function countDependencies(packageJson) {
  if (!packageJson || typeof packageJson !== 'object') {
    return 0;
  }
  
  const depTypes = getDependencyTypes(packageJson);
  let totalCount = 0;
  
  for (const depType in depTypes) {
    if (depTypes.hasOwnProperty(depType) && depTypes[depType]) {
      const deps = depTypes[depType];
      for (const dep in deps) {
        if (deps.hasOwnProperty(dep)) {
          totalCount++;
        }
      }
    }
  }
  
  return totalCount;
}

/**
 * Count dependencies by type
 * @param {Object} packageJson - Parsed package.json object
 * @returns {Object} Object with counts for each dependency type
 */
function countDependenciesByType(packageJson) {
  if (!packageJson || typeof packageJson !== 'object') {
    return {
      dependencies: 0,
      devDependencies: 0,
      peerDependencies: 0,
      optionalDependencies: 0,
      total: 0
    };
  }
  
  const depTypes = getDependencyTypes(packageJson);
  const counts = {
    dependencies: 0,
    devDependencies: 0,
    peerDependencies: 0,
    optionalDependencies: 0,
    total: 0
  };
  
  for (const depType in depTypes) {
    if (depTypes.hasOwnProperty(depType) && depTypes[depType]) {
      const deps = depTypes[depType];
      for (const dep in deps) {
        if (deps.hasOwnProperty(dep)) {
          counts[depType]++;
          counts.total++;
        }
      }
    }
  }
  
  return counts;
}

/**
 * Analyze project dependencies
 * @param {string} projectPath - Path to project directory
 * @returns {Object} Analysis results
 */
function analyzeDependencies(projectPath) {
  const packageJson = getPackageJson(projectPath);
  
  if (!validatePackageJson(packageJson)) {
    return {
      valid: false,
      error: 'Invalid package.json'
    };
  }
  
  return {
    valid: true,
    name: packageJson.name || 'unnamed',
    version: packageJson.version || '0.0.0',
    totalDependencies: countDependencies(packageJson),
    breakdown: countDependenciesByType(packageJson)
  };
}

module.exports = {
  getPackageJson,
  validatePackageJson,
  getDependencyTypes,
  countDependencies,
  countDependenciesByType,
  analyzeDependencies
};