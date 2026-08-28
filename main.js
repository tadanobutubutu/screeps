// TODO: Implement a function to count dependencies
function countDependencies() {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return Object.keys(dependencies).length + Object.keys(devDependencies).length;
  } catch (error) {
    return 0;
  }
}

module.exports = { countDependencies };