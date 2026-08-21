// Load the file content
const fs = require('fs');
const fileContent = fs.readFileSync('docs/dependency-graph.html', 'utf8');

// Replace the existing <html> tag with the updated one
const updatedContent = fileContent.replace('<html', '<html lang="en">');

// Save the updated content back to the file
fs.writeFileSync('docs/dependency-graph.html', updatedContent);