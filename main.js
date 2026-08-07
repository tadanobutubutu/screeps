const { readFileSync, writeFileSync } = require('fs'); const path = require('path'); 

/** * Dependency Dashboard Update * This script handles dependency updates for the repository. */ //

// Dependency updates 
const dependencies = { 'typescript': '^7.0.0', 'undici': 'v8.9.0', 'node.js': 'v24.19.0', 'posthap-js': '1.413.3', 'actions/checkout': 'v7', 'postcss': '>=8.5.14', }; 

// Function to update dependency version in package.json function updateDependency(dependency, newVersion) { const packageJsonPath = path.join(process.cwd(), 'package.json'); const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')); 

if (packageJson.dependencies && packageJson.dependencies[dependency]) { packageJson.dependencies[dependency] = newVersion; } else if (packageJson.devDependencies && packageJson.devDependencies[dependency]) { packageJson.devDependencies[dependency] = newVersion; } else { console.log(`Dependency ${dependency} not found in package.json`); return null; } 

const updatedContent = JSON.stringify(packageJson, null, 2); writeFileSync(packageJsonPath, updatedContent); return updatedContent; } 



// Function to update package.json dependencies function updateAllDependencies() { const packageJsonPath = path.join(process.cwd(), 'package.json'); const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')); 

for (const [dep, newVersion] of Object.entries(dependencies)) { if (packageJson.dependencies && packageJson.dependencies[dep]) { packageJson.dependencies[dep] = newVersion; console.log(`Updated ${dep} to ${newVersion}`); } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) { packageJson.devDependencies[dep] = newVersion; console.log(`Updated ${dep} to ${newVersion}`); } else if (packageJson.penguins && packageJson.penguins[dep]) { packageJson.penguins[dep] = newVersion; console.log(`Updated ${dep} to ${newVersion}`); } else { console.log(`Dependency ${dep} not found in package.json`); } } 

const updatedContent = JSON.stringify(packageJson, null, 2); writeFileSync(packageJsonPath, updatedContent); } 

// Function to handle conflict markers in main.js function handleConflictMarkers(filePath) { const content = readFileSync(filePath, 'utf8'); 

// Handle conflict markers from merge conflicts const updatedContent = content.replace(/<<<<<<< (.*?)\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> (.*?)\n/g, (match, group1, content1, content2, group3) => { // Resolve conflicts by taking the content from the right side return content2; }); 

writeFileSync(filePath, updatedContent); } 

// Main execution console.log('Starting dependency updates...'); updateAllDependencies(); handleConflictMarkers('main.js'); console.log('Dependency updates complete.');