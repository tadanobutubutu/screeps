// Assuming main.js is a JavaScript file that may include imports or exports related to the HTML files
// Here is a generic example of how you might update the HTML content in JavaScript

// Import the HTML content from the affected files
const dependencyGraphHtml = require('./docs/dependency-graph.html');

// Function to update the HTML content by adding the scope attribute to <th> elements
function updateHtmlContent(htmlContent) {
  return htmlContent.replace(/<th>/g, '<th scope="col">');
}

// Update the HTML content and save it back to the file
const updatedHtmlContent = updateHtmlContent(dependencyGraphHtml);
fs.writeFileSync('./docs/dependency-graph.html', updatedHtmlContent);

// If you have more files to update, repeat the process for each file
// ...