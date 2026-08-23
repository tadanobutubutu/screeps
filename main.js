// Assuming you have access to the file system and can read/write files
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');

// Function to update <th> elements with a missing scope attribute
function updateThElements(content) {
  return content.replace(/<th\b[^>]*>/g, (match) => {
    return match.replace('>', ' scope="col">');
  });
}

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Update the <th> elements
  const updatedData = updateThElements(data);

  // Write the updated file back
  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('File has been updated successfully.');
  });
});