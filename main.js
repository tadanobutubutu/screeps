// Assuming main.js is responsible for including HTML files or manipulating them
// Example of how to update the files in a way that Jest tests would not be affected

// Import the HTML files that need to be updated
const dependencyGraphHtml = require('./docs/dependency-graph.html');

// Function to add scope attribute to th elements
function addScopeToTh(html) {
  return html.replace(/<th\b[^>]*>/g, (match) => {
    // Check if the scope attribute is already present
    if (match.includes('scope="')) {
      return match;
    }
    // Add the scope attribute with the default value 'col'
    return `<th scope="col">${match}</th>`;
  });
}

// Update the HTML content
const updatedDependencyGraphHtml = addScopeToTh(dependencyGraphHtml);

// Now, you would need to write this updated content back to the file or use it in your application
// For example, you could write it back to the file like this:
// fs.writeFileSync('./docs/dependency-graph.html', updatedDependencyGraphHtml);

// Make sure to test that the changes do not affect the functionality of your application
// and that Jest tests continue to pass after these changes.