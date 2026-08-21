const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, 'docs', 'dependency-graph.html');
const updatedFilePath = path.join(__dirname, 'temp-dependency-graph.html');

const updateHTMLFile = () => {
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

  // Regular expression to find <th> tags without a scope attribute
  const thWithoutScopeRegex = /<th\b[^>]*>(.*?)<\/th>/g;
  const updatedContent = htmlContent.replace(thWithoutScopeRegex, (match, p1) => {
    // Add scope="col" to each <th> tag
    return `<th scope="col">${p1}</th>`;
  });

  // Write the updated content to the temporary file
  fs.writeFileSync(updatedFilePath, updatedContent);
};

// Update the HTML file
updateHTMLFile();

// Replace the original HTML file with the updated one
fs.renameSync(updatedFilePath, htmlFilePath);

console.log('HTML file has been updated with scope attributes.');