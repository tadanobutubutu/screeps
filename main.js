// main.js
const fs = require('fs');
const path = require('path');

// Read the dependency-graph.html file
const htmlPath = path.join(__dirname, 'docs', 'dependency-graph.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Find and fix all <th> elements that are missing scope attributes
htmlContent = htmlContent.replace(
  /<th>(.*?)<\/th>/g,
  (match, p1) => {
    // Only add scope if it's not already present
    if (!match.includes('scope=')) {
      return `<th scope="col">${p1}</th>`;
    }
    return match;
  }
);

// Write the updated content back to the file
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

console.log('Updated dependency-graph.html with proper table headers');