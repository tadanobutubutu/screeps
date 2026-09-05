/**
 * Main application module
 */

// Sample dependency data structure for demonstration
const dependencies = {
  'module-a': ['module-b', 'module-c'],
  'module-b': ['module-c'],
  'module-c': [],
  'module-d': ['module-a', 'module-e'],
  'module-e': ['module-c']
};

/**
 * Counts the number of dependencies for a given module
 * @param {string} moduleName - The name of the module
 * @param {Object} depsMap - Optional dependency map (defaults to sample)
 * @returns {number} - The count of dependencies
 */
function countDependencies(moduleName, depsMap = dependencies) {
  if (!depsMap.hasOwnProperty(moduleName)) {
    return 0;
  }
  
  const directDeps = depsMap[moduleName];
  let count = directDeps.length;
  
  // Recursively count dependencies of each direct dependency
  for (const dep of directDeps) {
    count += countDependencies(dep, depsMap);
  }
  
  return count;
}

// Export the function for use in tests
module.exports = {
  countDependencies,
  dependencies
};