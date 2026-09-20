// main.js
const fs = require('fs');
const path = require('path');

/**
 * Get package.json contents
 * @returns {Object} Parsed package.json or empty object if not found
 */
function getPackageJson() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

/**
 * Count dependencies from package.json
 * @returns {Object} Object containing dependency counts
 */
function countDependencies() {
  const packageJson = getPackageJson();
  
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  const peerDependencies = packageJson.peerDependencies || {};
  
  const depCount = Object.keys(dependencies).length;
  const devDepCount = Object.keys(devDependencies).length;
  const peerDepCount = Object.keys(peerDependencies).length;
  
  return {
    dependencies: depCount,
    devDependencies: devDepCount,
    peerDependencies: peerDepCount,
    total: depCount + devDepCount + peerDepCount
  };
}

// TODO: Implement a function to count dependencies

module.exports = {
  getPackageJson,
  countDependencies
};