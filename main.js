// Assuming the following is the content of `main.js` that includes the HTML file changes:

const fs = require('fs');

// Read the existing HTML content from the file
const htmlContent = fs.readFileSync('docs/dependency-graph.html', 'utf8');

// Replace all occurrences of `<th>` without `scope` attribute with `<th scope="col">`
const updatedHtmlContent = htmlContent.replace(/<th>/g, '<th scope="col">');

// Write the updated HTML content back to the file
fs.writeFileSync('docs/dependency-graph.html', updatedHtmlContent, 'utf8');