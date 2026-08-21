const fs = require('fs');
const path = require('path');

// Function to update the <main> element in the HTML content
function addMainElement(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Check if <main> is already present, if not, add it at the beginning
  if (!content.includes('<main>')) {
    const updatedContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><main>${content}</main></body></html>`;
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  }
}

// Function to update the <th> elements with the scope attribute
function updateTableHeaders(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<th>/g, '<th scope="col">');
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// List of files that need to be updated
const filesToUpdate = [
  path.join(__dirname, 'docs/dependency-graph.html'),
  path.join(__dirname, 'docs/index.html'),
  // Add other file paths here if needed
];

// Update each file
filesToUpdate.forEach(file => {
  addMainElement(file);
  updateTableHeaders(file);
});