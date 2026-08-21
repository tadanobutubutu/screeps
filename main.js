const fs = require('fs');
const path = require('path');

// Function to update the <html> element with the lang attribute
function addLangAttribute(filePath, language = 'en') {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<html>/g, `<html lang="${language}">`);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
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
  // Add other file paths here if needed
];

// Update each file with the lang attribute
filesToUpdate.forEach(file => {
  addLangAttribute(file);
  updateTableHeaders(file);
});