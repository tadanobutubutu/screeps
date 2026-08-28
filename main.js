// main.js - Application entry point

/**
 * Main application module
 * @module main
 */

const fs = require('fs');
const path = require('path');

/**
 * Initializes the application
 * @returns {Promise<void>}
 */
async function init() {
  console.log('Application initialized');
}

/**
 * Main entry point
 */
async function main() {
  await init();
  console.log('Main function executed');
}

/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
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

// Export functions
module.exports = {
  init,
  main,
  countDependencies
};

// Auto-run if executed directly
if (require.main === module) {
  main().catch(console.error);
}