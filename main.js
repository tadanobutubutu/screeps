// main.js
// Assuming that the following code is within the main.js file, we will not be altering it.
// We will only add the necessary HTML changes.

const fs = require('fs');

// Function to add a <main> element to the specified file
function addMainElement(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const modifiedContent = fileContent.replace(/<html>/, '<html><main>');
  fs.writeFileSync(filePath, modifiedContent, 'utf8');
}

// Add <main> element to the affected files
addMainElement('./docs/dependency-graph.html');
addMainElement('./docs/index.html');