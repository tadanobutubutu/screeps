// main.js

// TODO: Implement a function to count dependencies
// This is a placeholder for the actual implementation

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

module.exports = { countDependencies };