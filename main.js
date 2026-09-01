// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// TODO: Any additional changes requested in the issue should be added after this function

/**
 * Counts the number of dependencies
 * @param {Object|Array|string[]|number} dependencies - The dependencies to count
 * @returns {number} The count of dependencies
 */
function countDependencies(dependencies) {
  if (!dependencies) {
    return 0;
  }
  
  if (Array.isArray(dependencies)) {
    return dependencies.length;
  }
  
  if (typeof dependencies === 'object') {
    return Object.keys(dependencies).length;
  }
  
  return 0;
}