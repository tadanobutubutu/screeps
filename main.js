// Assuming main.js is a JavaScript file that generates HTML content for the pages

// Function to wrap secondary content in a <section> element
function wrapContentInSection(content) {
  return `<section>${content}</section>`;
}

// Function to wrap primary content in a <main> element
function wrapContentInMain(content) {
  return `<main>${content}</main>`;
}

// Example of generating HTML content for 'index.html'
function generateIndexHtml() {
  const primaryContent = `
    <div class="container">
        <h2>Quality & Metrics Reports</h2>
        <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
        <div class="links">
            <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
            <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
        </div>
    </div>
  `;

  // Wrap the primary content in a <main> element
  const mainContent = wrapContentInMain(primaryContent);

  // Return the complete HTML content for index.html
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quality & Metrics Reports</title>
        <!-- Additional head elements here -->
    </head>
    <body>
        ${mainContent}
        <!-- Additional body elements here -->
    </body>
    </html>
  `;
}

// Example of generating HTML content for 'dependency-graph.html'
function generateDependencyGraphHtml() {
  const primaryContent = `
    <table id="table-rotated">
      <!-- Table content here -->
    </table>
  `;

  // Wrap the primary content in a <main> element
  const mainContent = wrapContentInMain(primaryContent);

  // Return the complete HTML content for dependency-graph.html
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dependency Graph Report</title>
        <!-- Additional head elements here -->
    </head>
    <body>
        ${mainContent}
        <!-- Additional body elements here -->
    </body>
    </html>
  `;
}

// Export functions to be used for rendering the pages
module.exports = {
  generateIndexHtml,
  generateDependencyGraphHtml
};