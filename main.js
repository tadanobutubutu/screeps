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

// New function to convert anchor tags to buttons with specific id and text
function convertAnchorsToButtons() {
  if (typeof document !== 'undefined') {
    const anchors = document.querySelectorAll('a');
    anchors.forEach(anchor => {
      const button = document.createElement('button');
      button.id = anchor.id;
      button.type = 'button';
      button.textContent = anchor.textContent;
      // Copy attributes from anchor to button
      Array.from(anchor.attributes).forEach(attr => {
        if (attr.name !== 'id') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      // Replace anchor with button
      anchor.parentNode.replaceChild(button, anchor);
    });
  }
}

// Export for use in other modules
module.exports = { countDependencies, dependencyGraphContent, convertAnchorsToButtons };