// ... existing code ...

// Function to count dependencies (both internal private functions and npm dependencies)
const countDependencies = () => {
  // Count internal private functions (starting with '_')
  const internalDependencies = [];
  // Use appropriate global object for the environment
  const globalObj = (typeof window !== 'undefined') ? window : global;
  const functions = [...Object.getOwnPropertyNames(globalObj)];
  functions.forEach((functionName) => {
    if (functionName.startsWith('_') && typeof globalObj[functionName] === 'function') {
      internalDependencies.push(functionName);
    }
  });
  const internalCount = internalDependencies.length;

  // Count npm dependencies from package.json (if in Node environment)
  let external = null;
  let error = null;
  if (typeof require === 'function') {
    try {
      const packageJson = require('./package.json');
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};
      const peerDependencies = packageJson.peerDependencies || {};
      const optionalDependencies = packageJson.optionalDependencies || {};

      external = {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        peerDependencies: Object.keys(peerDependencies).length,
        optionalDependencies: Object.keys(optionalDependencies).length,
        total: Object.keys(dependencies).length + 
               Object.keys(devDependencies).length + 
               Object.keys(peerDependencies).length + 
               Object.keys(optionalDependencies).length
      };
    } catch (err) {
      error = err.message;
    }
  }

  // Return combined result
  if (error) {
    return {
      internalCount,
      external,
      error
    };
  } else {
    return {
      internalCount,
      external
    };
  }
};

// Export the function
module.exports = { countDependencies };

// ... existing code ...