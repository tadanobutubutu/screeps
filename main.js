// Hypothetical main.js with a function to update the HTML file

const fs = require('fs');

function updateHTMLFile(filePath, content) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Replace the existing <html> tag with the updated one
    const updatedData = data.replace(/<html>/g, '<html lang="en">');

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('The file has been updated successfully.');
    });
  });
}

function fixFakeLink(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Replace the problematic link with a proper button
    const updatedData = data.replace(
      /<a id="unrotate" href="#">rotate back<\/a>/g,
      '<button id="unrotate" class="rotate-back">rotate back</button>'
    );

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('Fixed fake link in the HTML file.');
    });
  });
}

// Assuming the path to the HTML file is known
const htmlFilePath = './docs/dependency-graph.html';

// Call the functions to update the file
updateHTMLFile(htmlFilePath, '');
fixFakeLink(htmlFilePath);