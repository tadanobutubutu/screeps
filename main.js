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

// Function to add <main> landmark to HTML files
function addMainLandmark(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    // Check if <main> already exists
    if (data.includes('<main>')) {
      console.log(`File ${filePath} already contains <main> landmark`);
      return;
    }

    // Find the body content and wrap it in <main>
    const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      const bodyContent = bodyMatch[1].trim();
      const updatedData = data.replace(
        bodyMatch[0],
        `<body>\n    <main>\n        ${bodyContent}\n    </main>\n</body>`
      );

      fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file ${filePath}:`, err);
          return;
        }
        console.log(`Successfully added <main> landmark to ${filePath}`);
      });
    } else {
      console.log(`No body tag found in ${filePath}`);
    }
  });
}

// Assuming the path to the HTML file is known
const htmlFilePath = './docs/dependency-graph.html';

// Call the function to update the file
updateHTMLFile(htmlFilePath, '');

// Add main landmarks to all affected files
const filesToUpdate = [
  './app/layout.tsx',
  './dashboard/app/layout.tsx',
  './docs/dependency-graph.html',
  './docs/index.html'
];

filesToUpdate.forEach(file => {
  addMainLandmark(file);
});