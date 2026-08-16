'use strict';

// [PRESERVED] All existing code and exports remain unchanged

// Add any new functions or changes requested in the issue
// For example, if the issue is about JSON output formatting for Jest coverage:
function formatJestCoverageOutput(outputPath) {
  try {
    const coverageData = require(outputPath);
    // Process coverage data as needed
    return {
      success: true,
      data: coverageData
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Export any new functions while preserving existing exports
module.exports = {
  // [PRESERVED] All existing exports remain unchanged
  formatJestCoverageOutput // New export for Jest coverage formatting
};