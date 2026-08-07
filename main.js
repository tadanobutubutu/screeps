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

// Function to update dependency version in package.json, handle conflicts, and print log messages
function updateAndlogDependency(dependency, newVersion) {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  if (packageJson.dependencies && packageJson.dependencies[dependency]) {
    packageJson.dependencies[dependency] = newVersion;
    console.log(`Updated ${dependency} to ${newVersion}`);
    const updatedContent = JSON.stringify(packageJson, null, 2);
    writeFileSync(packageJsonPath, updatedContent);

    // process conflict markers if exist
    processConflictMarkers(packageJsonPath);

    return updatedContent;
  } else if (packageJson.devDependencies && packageJson.devDependencies[dependency]) {
    packageJson.devDependencies[dependency] = newVersion;
    console.log(`Updated ${dependency} to ${newVersion}`);
    const updatedContent = JSON.stringify(packageJson, null, 2);
    writeFileSync(packageJsonPath, updatedContent);

    // process conflict markers if exist
    processConflictMarkers(packageJsonPath);

    return updatedContent;
  } else {
    console.log(`Dependency ${dependency} not found in package.json`);
    return null;
  }
}

// Function to update all dependencies and handle conflicts
function updateAllDependencies() {
  for (const [dep, newVersion] of Object.entries(dependencies)) {
    updateAndlogDependency(dep, newVersion);
  }
}

// Main execution
console.log('Starting dependency updates...');
updateAllDependencies();
console.log('Dependency updates complete.');