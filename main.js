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

// Function to update layout files with SVG accessibility attributes
function updateLayoutFiles() {
  const layoutFiles = [
    path.join(__dirname, 'app', 'layout.tsx'),
    path.join(__dirname, 'dashboard', 'app', 'layout.tsx')
  ];

  layoutFiles.forEach(filePath => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${filePath}:`, err);
        return;
      }

      // Check if the file already has accessibility attributes
      if (data.includes('aria-label') || data.includes('<title>') || data.includes('aria-hidden="true"')) {
        console.log(`File ${filePath} already has accessibility attributes. Skipping.`);
        return;
      }

      // Add aria-hidden="true" for decorative SVGs
      const updatedData = data.replace(
        /(<svg\b[^>]*>)/g,
        '$1<title>Decorative SVG</title>'
      );

      fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file ${filePath}:`, err);
          return;
        }
        console.log(`Successfully updated ${filePath} with SVG accessibility attributes.`);
      });
    });
  });
}

// Run the update function
updateLayoutFiles();