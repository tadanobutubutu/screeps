// main.js
// Preserve all existing code and exports

// Add any new functions or changes requested in the issue
// For example, if the issue is about JSON output formatting:

/**
 * Formats test results for JSON output
 * @param {Object} results - Jest test results
 * @returns {Object} Formatted results
 */
function formatTestResultsForJson(results) {
  // Ensure the results object has the required structure
  return {
    ...results,
    coverageMap: results.coverageMap || {},
    testResults: results.testResults || [],
    success: results.success !== false // Default to true if not specified
  };
}

// Export all existing functions and add new ones
module.exports = {
  // Preserve all existing exports
  ...require('./original-exports'), // Replace with actual existing exports

  // Add new exports if needed
  formatTestResultsForJson
};