// main.js
// [PRESERVE ALL EXISTING CODE ABOVE THIS LINE]

// Add any new functions or changes requested in the issue below
// For example, if the issue requires adding a new function:

/**
 * Helper function to ensure Jest can execute properly
 * @param {Object} config - Jest configuration object
 * @returns {Object} - Modified configuration
 */
function configureJestForCoverage(config) {
  // Ensure coverage reporters are properly configured
  if (!config.coverageReporters) {
    config.coverageReporters = ['json-summary', 'text', 'lcov'];
  } else if (!config.coverageReporters.includes('json-summary')) {
    config.coverageReporters.push('json-summary');
  }

  // Ensure output file path is valid
  if (config.outputFile && !config.outputFile.startsWith('/tmp/')) {
    config.outputFile = `/tmp/${config.outputFile}`;
  }

  return config;
}

// Export any new functions if needed
// module.exports = { configureJestForCoverage };

// [PRESERVE ALL EXISTING EXPORTS BELOW THIS LINE]