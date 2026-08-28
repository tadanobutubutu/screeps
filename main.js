const fs = require('fs');
const path = require('path');

/**
 * Counts the number of dependencies in the project
 * @param {Object} packageJson - The parsed package.json object
 * @returns {number} The total count of all dependencies (regular + dev)
 */
function countDependencies(packageJson) {
  if (!packageJson || typeof packageJson !== 'object') {
    return 0;
  }
  
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  
  const regularCount = Object.keys(dependencies).length;
  const devCount = Object.keys(devDependencies).length;
  
  return regularCount + devCount;
}

// Main execution
if (require.main === module) {
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  try {
    const packageContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    const totalDependencies = countDependencies(packageJson);
    console.log(`Total dependencies count: ${totalDependencies}`);
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    process.exit(1);
  }
}

module.exports = {
  countDependencies
};