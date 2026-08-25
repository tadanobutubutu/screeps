// Assuming this is a simplified version of your main.js file

// ... existing code ...

// Example of rendering content for the index.html page
function renderIndexPage() {
  // ... existing code that generates content for index.html ...

  // Wrap the primary content in a <main> tag
  const mainContent = `<main>
      <div class="container">
          <h2>Quality & Metrics Reports</h2>
          <p>
              This repository is fully optimized with automated tools. Explore the generated
              reports below:
          </p>
          <div class="links">
              <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
              <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
          </div>
      </div>
  </main>`;

  // Output the content to the page
  document.write(mainContent);
}

// Example of rendering content for the dependency-graph.html page
function renderDependencyGraphPage() {
  // ... existing code that generates content for dependency-graph.html ...

  // Wrap the primary content in a <main> tag
  const mainContent = `<main>
      <table id="table-rotated">
          <!-- existing table content -->
      </table>
  </main>`;

  // Output the content to the page
  document.write(mainContent);
}

// ... rest of your main.js file ...