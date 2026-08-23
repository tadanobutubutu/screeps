const fs = require('fs');
const path = require('path');

// Function to add scope attribute to th elements
function addScopeToTh(fileContent) {
  return fileContent.replace(/<th\b[^>]*>/g, (match) => {
    // Check if the th already has a scope attribute
    if (match.includes('scope="')) {
      return match;
    }
    // Add scope="col" or scope="row" based on the context
    // For example, if you have a way to determine the type of header, you could do:
    // return match.replace('<th', '<th scope="col"');
    // For simplicity, we'll just add scope="col" here
    return match.replace('<th', '<th scope="col"');
  });
}

// Function to process a single file
function processFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const updatedContent = addScopeToTh(fileContent);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// List of files to process
const filesToProcess = [
  'docs/dependency-graph.html',
  // ... add other affected files here
];

// Process each file
filesToProcess.forEach((filePath) => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    processFile(fullPath);
  } else {
    console.error(`File not found: ${filePath}`);
  }
});