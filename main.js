const fs = require('fs');
const path = require('path');

// List of file paths that need to be updated
const filePaths = [
  'docs/dependency-graph.html',
  // ... add other file paths here
];

// Function to add scope attribute to <th> elements
function addScopeToTh(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}: ${err}`);
      return;
    }

    const updatedData = data.replace(/<th>/g, '<th scope="col">');

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}: ${err}`);
        return;
      }
      console.log(`Updated file ${filePath}`);
    });
  });
}

// Update all files
filePaths.forEach(addScopeToTh);