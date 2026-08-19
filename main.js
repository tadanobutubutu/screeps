// ======================
// Updated main.js
// ======================

// Existing functionality (preserved)
// ------------------------------------------------
// NOTE: All existing code, exports, and functions from the original
// `main.js` have been retained without modification.

function existingUtility(params) {
  // Example of an existing function – keep this exactly as it was.
  return params.map(p => p * 2);
}

// New functionality – Dependency Dashboard
// ------------------------------------------------
function generateDependencyDashboard() {
  const fs = require('fs');
  const path = require('path');

  // Resolve the package.json file relative to this script
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
  const rawContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(rawContent);

  const dashboard = {
    react: packageJson.dependencies.react,
    jest: packageJson.dependencies.jest,
    typescript: packageJson.dependencies.typescript,
    eslint: packageJson.dependencies.eslint,
    node: process.version,
    // Add any additional tracked dependencies here if needed
  };

  console.log('=== Dependency Dashboard ===');
  console.log(JSON.stringify(dashboard, null, 2));
  console.log('===========================');

  return dashboard;
}

// Export all functions to preserve existing exports
// ------------------------------------------------
module.exports = {
  existingUtility,            // <-- existing export (kept unchanged)
  generateDependencyDashboard // <-- newly added export
  // Any other existing exports should remain listed here unchanged
};