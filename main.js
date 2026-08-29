// Main application file

// ... Existing functions: calculateDistance, toRad, ensureUniqueLandmarks ...

// Function to create a minimal dependency graph for debugging purposes
function renderDependencyGraph() {
  // Note: this is just an example; generate the dependency graph based on your project's structure
  const modules = {
    main: ['toRad', 'calculateDistance', 'ensureUniqueLandmarks'],
    toRad: [],
    calculateDistance: ['toRad'],
    ensureUniqueLandmarks: ['Array', 'Set'],
  };

  const graph = Object.keys((Object.assign({}, ...modules)).reverse()) // Reverse the ordering of the keys
    .map(key => ({ name: key, dependencies: modules[key] }));

  return graph.map(module => `${module.name}: ${module.dependencies.join(', ')}`);
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  renderDependencyGraph // Add the new function
};