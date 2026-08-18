// Example of how to update the main.js file to include the necessary changes
// This is a hypothetical example and should be adapted to your actual codebase

const fs = require('fs');
const path = require('path');

// Define the path to the affected HTML file
const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');

// Read the contents of the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Replace all occurrences of <th> without scope attribute with <th scope="col">
  const updatedData = data.replace(/<th\b[^>]*>/g, '<th scope="col">');

  // Write the updated contents back to the file
  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File updated successfully.');
  });
});