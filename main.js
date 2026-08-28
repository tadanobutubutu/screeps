// main.js - Core functionality

/**
 * Counts the total number of dependencies from a package.json-like object
 * @param {Object} packageJson - Object containing dependencies, devDependencies, peerDependencies
 * @returns {number} Total count of all dependencies
 */
function countDependencies(packageJson) {
  if (!packageJson || typeof packageJson !== 'object') {
    return 0;
  }

  let total = 0;

  if (packageJson.dependencies) {
    total += Object.keys(packageJson.dependencies).length;
  }

  if (packageJson.devDependencies) {
    total += Object.keys(packageJson.devDependencies).length;
  }

  if (packageJson.peerDependencies) {
    total += Object.keys(packageJson.peerDependencies).length;
  }

  if (packageJson.optionalDependencies) {
    total += Object.keys(packageJson.optionalDependencies).length;
  }

  return total;
}

/**
 * Counts dependencies by type
 * @param {Object} packageJson - Object containing dependency types
 * @returns {Object} Object with counts for each dependency type
 */
function getDependencyCounts(packageJson) {
  return {
    dependencies: packageJson?.dependencies ? Object.keys(packageJson.dependencies).length : 0,
    devDependencies: packageJson?.devDependencies ? Object.keys(packageJson.devDependencies).length : 0,
    peerDependencies: packageJson?.peerDependencies ? Object.keys(packageJson.peerDependencies).length : 0,
    optionalDependencies: packageJson?.optionalDependencies ? Object.keys(packageJson.optionalDependencies).length : 0
  };
}

module.exports = {
  countDependencies,
  getDependencyCounts
};