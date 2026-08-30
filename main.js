// Import dependencyGraphContent
const dependencyGraphContent = require('./dependencyGraph');

const fs = require('fs');
const path = require('path');

/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = path.join(__dirname, 'package.json');
  
  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const dependencyCount = Object.keys(dependencies).length;
    const devDependencyCount = Object.keys(devDependencies).length;
    
    return {
      dependencies: dependencyCount,
      devDependencies: devDependencyCount,
      total: dependencyCount + devDependencyCount
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return {
      dependencies: 0,
      devDependencies: 0,
      total: 0
    };
  }
}

/**
 * Processes an insight report to address accessibility issues
 * @param {Object} insightReport - The insight report containing the accessibility issues
 */
function addressAccessibilityIssues(insightReport) {
  // TODO: Implement actual logic to address the accessibility issues based on the insight report structure
  // For now, we'll just log the issues for demonstration purposes
  insightReport.issues.forEach(issue => {
    console.log(`Accessibility issue found: ${issue.description}`);
    // Here you would add the logic to address the issue, such as logging, fixing, etc.
  });
}

// Export for use in other modules
module.exports = { countDependencies, dependencyGraphContent, addressAccessibilityIssues };