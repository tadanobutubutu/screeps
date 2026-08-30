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
 * Generates an SVG badge string representing the total dependency count.
 * @returns {string} An SVG badge string showing the total dependency count.
 */
function generateDependencyBadge() {
  const counts = countDependencies();
  const total = counts.total;

  // Simple SVG badge
  const badgeWidth = 70;
  const badgeHeight = 20;
  const backgroundColor = '#4c1';
  const textColor = '#fff';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${badgeWidth}" height="${badgeHeight}">
  <rect width="${badgeWidth}" height="${badgeHeight}" fill="${backgroundColor}" rx="3"/>
  <text x="${badgeWidth / 2}" y="${badgeHeight / 2 + 5}" fill="${textColor}" text-anchor="middle" font-family="Verdana, Geneva, DejaVu Sans, sans-serif" font-size="11">
    dependencies: ${total}
  </text>
</svg>
  `.trim();

  return svg;
}

// Export for use in other modules
module.exports = { countDependencies, dependencyGraphContent, generateDependencyBadge };