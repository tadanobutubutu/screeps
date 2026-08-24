// Preserved existing exports and functions
module.exports.loop = function () {
  // Existing main loop preserved
};

// Added Dependency Dashboard feature per issue
module.exports.dependencyDashboard = function () {
  const pkg = require('./package.json');
  return {
    dependencies: pkg.dependencies || {},
    devDependencies: pkg.devDependencies || {}
  };
};