// Assuming main.js doesn't contain any direct HTML and the changes are in the HTML file.

// ... (other code)

// Update the `docs/dependency-graph.html` file with the lang attribute.
const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, 'docs', 'dependency-graph.html');
const updatedHtml = fs.readFileSync(htmlFilePath, 'utf8').replace(/<html>/g, '<html lang="en">');

fs.writeFileSync(htmlFilePath, updatedHtml);

// ... (other code)