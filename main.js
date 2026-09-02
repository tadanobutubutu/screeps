const fs = require('fs');
const path = require('path');

// Utility functions
function formatResponse(data) {
  return {
    status: 'success',
    data: data,
    timestamp: new Date().toISOString()
  };
}

// axe-core configuration for accessibility scanning
const axeConfig = {
  runOnly: ['color-contrast', 'aria-required-attr', 'aria-required-children', 'aria-required-parent'],
  resultTypes: ['violations', 'passes']
};

// Main processing functions (existing)
function processData(data) {
  // Existing data processing logic
  return {
    processed: data,
    timestamp: new Date().toISOString()
  };
}

function validateInput(input) {
  return input && typeof input === 'object';
}

// Accessibility scanning functions
function scanAccessibility(pageUrl, axeConfig) {
  // Simulate accessibility scanning - in production would use axe-core
  return {
    url: pageUrl,
    violations: [],
    passes: [],
    timestamp: new Date().toISOString()
  };
}

function writeReport(report, filePath) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    return { status: 'success', path: filePath };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

// New function: Generate accessibility report
async function generateAccessibilityReport(url, reportPath) {
  try {
    // Validate inputs
    if (!url || typeof url !== 'string') {
      throw new Error('Valid URL is required');
    }

    if (!reportPath || typeof reportPath !== 'string') {
      throw new Error('Valid report path is required');
    }

    // Scan the page
    const scanResult = await scanAccessibility(url, axeConfig);
    
    // Write report
    const writeResult = writeReport(scanResult, reportPath);
    
    return formatResponse({
      scan: scanResult,
      write: writeResult
    });
  } catch (error) {
    return formatResponse({
      error: error.message
    });
  }
}

// Legacy render function (existing)
function renderDependencyGraph(data) {
  return `<dependency-graph>${data}</dependency-graph>`;
}

// Configuration
const CONFIG = {
  maxDepth: 10,
  includeDevDependencies: false
};

// Legacy export for backward compatibility
const landmarkConfig = CONFIG;

// Module exports
const exports = {
  processData,
  validateInput,
  formatResponse,
  generateAccessibilityReport,
  scanAccessibility,
  writeReport,
  renderDependencyGraph,
  landmarkConfig
};

// Add exports to module.exports for Node.js
module.exports = exports;

// Export additional functions for backward compatibility
module.exports.renderDependencyGraph = renderDependencyGraph;
module.exports.scanAccessibility = scanAccessibility;

// Export landmarkConfig separately for legacy code
module.exports.landmarkConfig = landmarkConfig;

// Export functions that were already in main.js before the issue
module.exports.processData = processData;
module.exports.validateInput = validateInput;
module.exports.formatResponse = formatResponse;
module.exports.generateAccessibilityReport = generateAccessibilityReport;
module.exports.scanAccessibility = scanAccessibility;
module.exports.writeReport = writeReport;
module.exports.renderDependencyGraph = renderDependencyGraph;
module.exports.landmarkConfig = landmarkConfig;