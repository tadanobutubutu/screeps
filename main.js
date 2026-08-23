const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs/dependency-graph.html');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Replace the <html> tag with the lang attribute
  const updatedData = data.replace(/<html>/, '<html lang="en">');

  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('The file has been updated successfully.');
  });
});