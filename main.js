// Original main.js content
// ...

// Add or modify the following lines to address the REACT_017 issue
// Wrap the primary content in <main> so it can be skipped to

// Example for docs/dependency-graph.html
// Add a <main> tag around the table content
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...

  const mainContent = document.createElement('main');
  mainContent.innerHTML = `
    <table id="table-rotated">
      <!-- table content here -->
    </table>
  `;
  document.body.appendChild(mainContent);
});

// Example for docs/index.html
// Add a <main> tag around the container with the content
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...

  const mainContent = document.createElement('main');
  mainContent.innerHTML = `
    <div class="container">
      <h2>Quality & Metrics Reports</h2>
      <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
      <div class="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
      </div>
    </div>
  `;
  document.body.appendChild(mainContent);
});

// ... rest of the main.js content
// ...