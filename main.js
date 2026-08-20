const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
const updatedFilePath = path.join(__dirname, 'docs', 'dependency-graph.html.tmp');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Add scope="col" to all <th> elements that don't already have a scope attribute
  const updatedData = data.replace(/<th\b([^>]*?)(?<!scope="[^"]*")([^>]*)>/g, (match, before, after) => {
    // Check if the match already contains a scope attribute
    if (/scope="[^"]*"/.test(match)) {
      return match; // Return unchanged if scope already exists
    }
    // Add scope="col" to the <th> element
    return `<th scope="col"${before}${after}>`;
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