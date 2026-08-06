// main.js - Application entry point
module.exports = {
  // Preserve all existing functionality
  version: '1.0.0',
  
  // Example function
  init: function() {
    return true;
  },
  
  // Add helper function for test compatibility
  getConfig: function() {
    return {
      testEnvironment: 'node',
      coverageDirectory: 'coverage',
      collectCoverageFrom: ['src/**/*.js'],
      testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js']
    };
  },
  
  // Resolved initialization
  initialize: function(options = {}) {
    if (!options) {
      throw new Error('Options cannot be null or undefined');
    }
    return {
      success: true,
      options: options
    };
  }
};

// Export both CommonJS and ES modules for compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = module.exports;
}

module.exports.default = module.exports;