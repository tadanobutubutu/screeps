/**
 * Dependency Dashboard Update
 * This script handles dependency updates for the repository.
 */

const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

// Dependency updates
const dependencies = {
  'typescript': '^7.0.0',
  'undici': 'v8.9.0',
  'node.js': 'v24.19.0',
  'posthog-js': '1.413.3',
  'actions/checkout': 'v7',
  'postcss': '>=8.5.14',
};

// Function to update dependency version in package.json
function updateDependency(dependency, newVersion) {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies[dependency]) {
    packageJson.dependencies[dependency] = newVersion;
  } else if (packageJson.devDependencies && packageJson.devDependencies[dependency]) {
    packageJson.devDependencies[dependency] = newVersion;
  } else {
    console.log(`Dependency ${dependency} not found in package.json`);
    return null;
  }
  
  const updatedContent = JSON.stringify(packageJson, null, 2);
  writeFileSync(packageJsonPath, updatedContent);
  return updatedContent;
}

// Function to update package.json dependencies
function updateAllDependencies() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  for (const [dep, newVersion] of Object.entries(dependencies)) {
    if (packageJson.dependencies[dep]) {
      packageJson.dependencies[dep] = newVersion;
      console.log(`Updated ${dep} to ${newVersion}`);
    } else if (packageJson.devDependencies[dep]) {
      packageJson.devDependencies[dep] = newVersion;
      console.log(`Updated ${dep} to ${newVersion}`);
    } else if (packageJson.penguins[dep]) {
      packageJson.penguins[dep] = newVersion;
      console.log(`Updated ${dep} to ${newVersion}`);
    }
  }
  
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// Function to handle conflict markers in main.js
function handleConflictMarkers() {
  const mainJsPath = path.join(__dirname, 'main.js');
  let content = readFileSync(mainJsPath, 'utf8');
  
  // Handle conflict markers from merge conflicts
  content = content.replace(/<<<<<<< (.*?)\n((?:[^]|\n)*?)=======\n((?:[^]|\n)*?)>>>>>>> (.*?)\n/g, (match, group1, content1, group2, group3) => {
    // Resolve conflicts by taking the content from the right side
    return content2;
  });
  
  writeFileSync(mainJsPath, content);
}

// Main execution
console.log('Starting dependency updates...');
updateAllDependencies();
handleConflictMarkers();
console.log('Dependency updates complete.');