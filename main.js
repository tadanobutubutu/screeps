// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

/**
 * Counts the total number of dependencies (including devDependencies) from a given dependencies object.
 * @param {Object} deps - An object representing dependencies (e.g., package.json dependencies field).
 * @returns {number} The total count of dependency entries.
 */
function countDependencies(deps) {
  if (!deps || typeof deps !== 'object') {
    return 0;
  }
  return Object.keys(deps).length;
}

// TODO: The above replaces the placeholder at line 39: "// TODO: Implement a function to count dependencies"

module.exports = { countDependencies };