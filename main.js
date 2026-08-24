// Assuming you have a function that renders the HTML content
function renderPageContent(pageContent) {
  // ... existing code to render the page content
}

// ... existing code in main.js

// For the `docs/dependency-graph.html` page
const dependencyGraphContent = `
<main>
    <table id="table-rotated">
        <!-- ... rest of the content for dependency-graph.html -->
    </table>
</main>
`;

// For the `docs/index.html` page
const indexContent = `
<main>
    <div class="container">
        <h2>Quality & Metrics Reports</h2>
        <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
        <div class="links">
            <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
            <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
        </div>
    </div>
</main>
`;

// Render the pages with the new main content
renderPageContent(dependencyGraphContent);
renderPageContent(indexContent);

// ... rest of the main.js code