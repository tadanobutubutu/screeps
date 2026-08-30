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
 * Checks for accessibility issues in tables within the HTML content
 * @param {string} htmlContent - The HTML content to check
 * @returns {Array} An array of accessibility issues found
 */
function checkTableAccessibility(htmlContent) {
  const issues = [];
  const tableElements = htmlContent.match(/<table.*?>.*?<\/table>/g);
  
  if (tableElements) {
    tableElements.forEach((table) => {
      // Check for the presence of a caption
      if (!/<caption.*?>.*?<\/caption>/i.test(table)) {
        issues.push('Table without a caption found.');
      }
      
      // Check for the presence of at least one header cell
      if (!/<th.*?>.*?<\/th>/i.test(table)) {
        issues.push('Table without a header cell found.');
      }
      
      // Check for the presence of scope attribute in header cells
      const headerCells = table.match(/<th.*?>/g);
      if (headerCells) {
        headerCells.forEach((headerCell) => {
          if (!/<th.*?scope.*?>/i.test(headerCell)) {
            issues.push('Header cell without a scope attribute found.');
          }
        });
      }
    });
  }
  
  return issues;
}

// Export for use in other modules
module.exports = { countDependencies, dependencyGraphContent, checkTableAccessibility };