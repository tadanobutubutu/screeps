// Assuming main.js is a script that could be used to transform HTML files
const fs = require('fs');
const path = require('path');

// Function to add a <main> tag to the HTML content
function addMainTag(htmlContent) {
  return `<main>${htmlContent}</main>`;
}

// Path to the HTML files that need the <main> tag
const dependencyGraphPath = path.join(__dirname, 'docs', 'dependency-graph.html');
const indexHtmlPath = path.join(__dirname, 'docs', 'index.html');

// Read the content of the HTML files
const dependencyGraphHtml = fs.readFileSync(dependencyGraphPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Add the <main> tag to the HTML content
const updatedDependencyGraphHtml = addMainTag(dependencyGraphHtml);
const updatedIndexHtml = addMainTag(indexHtml);

// Write the updated content back to the HTML files
fs.writeFileSync(dependencyGraphPath, updatedDependencyGraphHtml, 'utf8');
fs.writeFileSync(indexHtmlPath, updatedIndexHtml, 'utf8');

console.log('Updated HTML files with <main> tag.');