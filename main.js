// Example of how to wrap the primary content with a <main> landmark in main.js

// Function to get the primary content of the page
function getPrimaryContent() {
  // This function should return the primary content of the page
  // For the purpose of this example, we assume it's a string containing the HTML content
  return `
    <div class="container">
        <h2>Quality & Metrics Reports</h2>
        <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
        <div class="links">
            <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
            <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
        </div>
    </div>
  `;
}

// Function to wrap the primary content with a <main> landmark
function wrapContentWithMain(content) {
  return `<main>${content}</main>`;
}

// Example usage in the render function
function renderPage() {
  const primaryContent = getPrimaryContent();
  const mainWrappedContent = wrapContentWithMain(primaryContent);

  // Render the wrapped content to the DOM or return it as a string
  // For example:
  // document.getElementById('page-content').innerHTML = mainWrappedContent;
  // Or
  return mainWrappedContent;
}

// Assuming the renderPage function is called at some point in the application's lifecycle
// renderPage();