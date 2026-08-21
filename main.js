// Remove HTML tags from main.js to fix syntax errors
// Instead, generate HTML content as strings or in separate files

// Example fix: create HTML content as a string variable
const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <!-- Rest of your HTML content here -->
</html>`;

// Function to render the dependency graph HTML file
function renderDependencyGraph() {
  // ... existing code ...

  // Render the HTML content for the dependency graph
  const graphHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dependency Graph</title>
      </head>
      <body>
        <!-- Dependency graph content here -->
      </body>
    </html>
  `;

  // Assuming we have a function to write the HTML content to the file system
  writeToFile('docs/dependency-graph.html', graphHtml);
}

// Call the function to render the dependency graph
renderDependencyGraph();

// Export as needed
export { htmlContent };