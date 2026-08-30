// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

/**
 * Counts the total number of dependencies from a package.json-like object
 * @param {Object} packageJson - A package.json object containing dependencies, devDependencies, and/or peerDependencies
 * @returns {number} - The total count of all dependencies
 */
function countDependencies(packageJson) {
  if (!packageJson || typeof packageJson !== 'object') {
    return 0;
  }
  
  let count = 0;
  
  if (packageJson.dependencies) {
    count += Object.keys(packageJson.dependencies).length;
  }
  
  if (packageJson.devDependencies) {
    count += Object.keys(packageJson.devDependencies).length;
  }
  
  if (packageJson.peerDependencies) {
    count += Object.keys(packageJson.peerDependencies).length;
  }
  
  return count;
}

module.exports = { countDependencies };