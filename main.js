const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
const updatedFilePath = path.join(__dirname, 'docs', 'dependency-graph.html.tmp');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const updatedData = data.replace(/<th\b[^>]*>/g, (match) => {
    return match.replace(/<th\b[^>]*>/, '<th scope="col">');
  });

  fs.writeFile(updatedFilePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }

    console.log('File updated successfully. Replace the original file with the temporary file.');

    // Optionally, you can replace the original file with the updated file
    // fs.rename(updatedFilePath, filePath, (err) => {
    //   if (err) {
    //     console.error('Error renaming file:', err);
    //     return;
    //   }
    //   console.log('Original file replaced successfully.');
    // });
  });
});