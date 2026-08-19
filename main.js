// Hypothetical main.js with a function to update the HTML file

const fs = require('fs');

function updateFile(filePath, content) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Replace the existing <html> tag with the updated one
    const updatedData = data.replace('<html lang="en">', content);

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('The file has been updated successfully.');
    });
  });
}

// Assuming the path to the HTML file is known
const htmlFilePath = 'path/to/your/file.html';

// Call the function to update the file
updateFile(htmlFilePath, '<html lang="en">');