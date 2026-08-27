// main.js

// Sample dependencies data (could come from package.json)
const dependencies = {
  "express": "^4.18.0",
  "lodash": "^4.17.21",
  "axios": "^1.0.0",
  "react": "^18.0.0"
};

const devDependencies = {
  "jest": "^29.0.0",
  "eslint": "^8.0.0"
};

/**
 * Counts the total number of dependencies
 * @param {Object} deps - Object containing dependencies
 * @returns {number} - Number of dependencies
 */
function countDependencies(deps) {
  if (!deps || typeof deps !== 'object') {
    return 0;
  }
  return Object.keys(deps).length;
}

/**
 * Counts all dependencies including devDependencies
 * @param {Object} deps - Production dependencies
 * @param {Object} devDeps - Development dependencies
 * @returns {number} - Total count of all dependencies
 */
function countAllDependencies(deps, devDeps) {
  return countDependencies(deps) + countDependencies(devDeps);
}

// TODO: Implement a function to count dependencies
// This is a placeholder for the actual implementation
// Implementation: countDependencies function defined above

module.exports = {
  countDependencies,
  countAllDependencies,
  dependencies,
  devDependencies
};