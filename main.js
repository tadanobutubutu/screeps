const fs = require('fs');
const path = require('path');

// Path to the HTML file that needs to be modified
const htmlFilePath = path.join(__dirname, 'docs', 'dependency-graph.html');

// Function to add scope attribute to <th> tags
function addScopeToThTags(htmlContent) {
  return htmlContent.replace(/<th\b[^>]*>/g, (match) => {
    return match.replace(/<th\b[^>]*>/, '<th scope="col">');
  });
}

// Read the HTML file
fs.readFile(htmlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the HTML file:', err);
    return;
  }

  // Add scope attribute to <th> tags
  const modifiedHtmlContent = addScopeToThTags(data);

  // Write the modified HTML content back to the file
  fs.writeFile(htmlFilePath, modifiedHtmlContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the modified HTML content:', err);
      return;
    }
    console.log('The HTML file has been updated successfully.');
  });
});