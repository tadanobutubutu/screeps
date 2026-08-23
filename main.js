const fs = require('fs');
const path = require('path');

// Define the path to the HTML file that needs updating
const htmlFilePath = path.join(__dirname, 'docs/dependency-graph.html');

// Read the content of the HTML file
fs.readFile(htmlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Replace all instances of <th without scope attribute with <th scope="col"
  const updatedContent = data.replace(/<th\b[^>]*>/g, '<th scope="col">');

  // Write the updated content back to the HTML file
  fs.writeFile(htmlFilePath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('The file has been updated successfully.');
  });
});