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
 * Checks for landmark elements in the given HTML content
 * @param {string} content - HTML content to check for landmark elements
 * @returns {Object} An object containing information about landmark elements found
 */
function checkLandmarkElements(content) {
  const landmarkTags = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const found = {};
  
  for (const tag of landmarkTags) {
    const regex = new RegExp(`<${tag}[^>]*>`, 'gi');
    const matches = content.match(regex);
    found[tag] = matches ? matches.length : 0;
  }
  
  return {
    landmarks: found,
    totalLandmarks: Object.values(found).reduce((a, b) => a + b, 0)
  };
}

// Export for use in other modules
module.exports = { countDependencies, checkLandmarkElements };