// Example of a function to add scope attribute to th elements
function addScopeToThElements(filePath) {
  const fs = require('fs');
  const path = require('path');

  // Read the HTML file
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  // Replace <th> without scope attribute with <th scope="col">
  const updatedContent = htmlContent.replace(/<th\b[^>]*>/g, '<th scope="col">');

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// List of files affected by the issue
const affectedFiles = [
  'docs/dependency-graph.html',
  // Add other affected files here
];

// Loop through the affected files and update them
affectedFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  addScopeToThElements(filePath);
});