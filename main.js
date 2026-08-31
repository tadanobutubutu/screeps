// main.js - Dependency counting implementation

/**
 * Counts the number of dependencies in a package.json object
 * @param {Object} packageJson - The parsed package.json object
 * @returns {Object} An object with counts for different dependency types
 */
function countDependencies(packageJson) {
  if (!packageJson || typeof packageJson !== 'object') {
    return {
      dependencies: 0,
      devDependencies: 0,
      peerDependencies: 0,
      optionalDependencies: 0,
      total: 0
    };
  }

  const depTypes = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies'
  ];

  const counts = {};
  let total = 0;

  for (const depType of depTypes) {
    const deps = packageJson[depType];
    const count = deps && typeof deps === 'object' ? Object.keys(deps).length : 0;
    counts[depType] = count;
    total += count;
  }

  return {
    ...counts,
    total
  };
}

/**
 * Counts dependencies from a package.json file path
 * @param {string} filePath - Path to package.json file
 * @returns {Promise<Object>} Promise resolving to dependency counts
 */
async function countDependenciesFromFile(filePath) {
  const fs = require('fs').promises;
  const path = require('path');

  try {
    const fullPath = path.resolve(filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const packageJson = JSON.parse(content);
    return countDependencies(packageJson);
  } catch (error) {
    throw new Error(`Failed to count dependencies: ${error.message}`);
  }
}

module.exports = {
  countDependencies,
  countDependenciesFromFile
};