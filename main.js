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

function addScopeAttributesToHeaders(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Add scope attributes to all <th> elements that don't already have them
    const updatedData = data.replace(/<th>(.*?)<\/th>/g, (match, p1) => {
      if (match.includes('scope=')) {
        return match; // Skip if scope is already present
      }
      return `<th scope="col">${p1}</th>`;
    });

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('Added scope attributes to table headers successfully.');
    });
  });
}

// Assuming the path to the HTML file is known
const htmlFilePath = './docs/dependency-graph.html';

// Call the function to update the file
updateHTMLFile(htmlFilePath, '');

// Call the function to add scope attributes to table headers
addScopeAttributesToHeaders(htmlFilePath);