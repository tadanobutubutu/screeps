// main.js

const fs = require('fs');
const path = require('path');

// ----- BEGIN ORIGINAL CODE (unchanged) -----
// TODO: This is the existing code that needs to be preserved
// ...

// ----- END ORIGINAL CODE -------
// ... existing code above ...

// TODO: Implement a function to count dependencies
function countDependencies() {
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

// Export affected functions and new function to make them accessible
// ... existing code below ...
module.exports = {
    countDependencies
};