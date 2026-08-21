const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Regex to find <th> elements without the scope attribute
  const thWithoutScopeRegex = /<th\b[^>]*>(.*?)<\/th>/g;

  // Function to replace the <th> element with the scope attribute
  const addScopeToTh = (match) => {
    return `<th scope="col">${match}</th>`;
  };

  // Replace all <th> elements without the scope attribute
  const updatedData = data.replace(thWithoutScopeRegex, addScopeToTh);

  // Write the updated data back to the file
  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('The file has been updated successfully.');
  });
});