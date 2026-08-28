import someFunction from './utils';
import fs from 'fs';
import path from 'path';

// Export the someFunction from './utils'
export { someFunction };

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

export { countDependencies };

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

// New function to add a <main> landmark to the primary content
function addMainLandmark() {
  if (typeof document !== 'undefined') {
    const primaryContent = document.querySelector('div.container'); // Assuming the primary content is within a div with class 'container'
    if (primaryContent) {
      const mainElement = document.createElement('main');
      mainElement.appendChild(primaryContent);
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    }
  }
}

// Call the function to add the <main> landmark when the document is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', addMainLandmark);
}