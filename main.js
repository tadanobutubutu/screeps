// Assuming main.js is responsible for rendering HTML content
const fs = require('fs');

// Read the existing HTML content
const htmlContent = fs.readFileSync('path/to/your/html/file.html', 'utf8');

// Replace the <th> elements without scope attribute
const updatedHtmlContent = htmlContent.replace(/<th>(.*?)<\/th>/g, '<th scope="col">$1</th>');

// Write the updated HTML content back to the file
fs.writeFileSync('path/to/your/html/file.html', updatedHtmlContent, 'utf8');