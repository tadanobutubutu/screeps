// main.js

// ... existing code above line 40 ...

/**
 * Counts the number of dependencies in a given dependencies object.
 * @param {Object} dependencies - An object where keys are package names and values are version strings.
 * @returns {number} The total number of dependencies.
 */
function countDependencies(dependencies) {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0;
  }
  return Object.keys(dependencies).length;
}

// ... rest of existing code below ...

module.exports = { countDependencies };