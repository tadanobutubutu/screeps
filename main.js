module.exports = {
  function1,
  function2,
  // Other exports
  main,
  SomeClass,
  someUtility,
  config,
  countDependencies,
  newFunction
};

function main() {
  return 'Hello World';
}

// Count dependencies function
function countDependencies() {
    const fs = require('fs');
    const path = require('path');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// New function added by HEAD branch
function newFunction() {