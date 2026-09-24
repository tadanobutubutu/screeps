// TODO: This is the existing code that needs to be preserved

/**
 * Counts the number of dependencies in the given object or array
 * @param {Object|Array} dependencies - Object or array of dependencies
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

// Export for Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { countDependencies };
}

// Export for ES modules
if (typeof window !== 'undefined') {
  window.countDependencies = countDependencies;
}