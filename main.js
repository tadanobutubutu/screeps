// Assuming main.js is a file that manipulates the HTML content
const fs = require('fs');
const path = require('path');

// Path to the HTML file that contains the problematic link
const htmlFilePath = path.join(__dirname, 'docs', 'dependency-graph.html');

// Read the current content of the HTML file
fs.readFile(htmlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the HTML file:', err);
    return;
  }

  // Replace the problematic <a> tag with a <button> tag
  const updatedData = data.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate">rotate back</button>');

  // Write the updated content back to the HTML file
  fs.writeFile(htmlFilePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the updated HTML file:', err);
      return;
    }
    console.log('The HTML file has been updated successfully.');
  });
});