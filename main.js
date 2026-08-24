// This file handles the server-side rendering for the docs/index.html page
const fs = require('fs');
const path = require('path');

function generateTableRows(data) {
    let rows = '';
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        rows += `<tr>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.status}</td>
        </tr>`;
    }
    return rows;
}

function renderPage(data) {
    const tableRows = generateTableRows(data);
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screeps Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <header>
        <h1>Screeps Project</h1>
        <nav>
            <a href="/docs">Documentation</a>
            <a href="/api">API Reference</a>
        </nav>
    </header>
    <main>
        <div class="container">
            <h2>Quality & Metrics Reports</h2>
            <p>
                This repository is fully optimized with automated tools. Explore the generated
                reports below:
            </p>
            <div class="links">
                <a href="/plato">Plato Code Complexity Report</a>
                <a href="/graph">Dependency Graph</a>
            </div>
        </div>
        <table id="table-rotated">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    </main>
    <footer>
        <p>&copy; 2024 Screeps Project</p>
    </footer>
</body>
</html>`;
}

// React component for the web interface
const PrimaryContent = () => {
  return (
    <div className="primary-content">
      {/* Your primary content goes here */}
      <nav aria-label="Primary Navigation">
        <a href="/">Home</a>
      </nav>

      <section aria-label="Main Content">
        <h1>Overview</h1>

        {/* Fixed table structures for REACT_027 */}
        <table>
          <caption>User Records</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Alice</th>
              <td>Active</td>
            </tr>
            <tr>
              <th scope="row">Bob</th>
              <td>Inactive</td>
            </tr>
          </tbody>
        </table>

        <table>
          <caption>Metrics</caption>
          <thead>
            <tr>
              <th scope="col">Metric</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Access</th>
              <td>87/100</td>
            </tr>
          </tbody>
        </table>

        {/* Fixed SVG accessible names for REACT_041 */}
        <svg
          role="img"
          aria-label="Data Chart"
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="100"
        >
          <title>Data Chart</title>
          <rect x="10" y="10" width="180" height="80" fill="#ccc" />
        </svg>

        {/* Fixed fake link for REACT_036 */}
        <button type="button" onClick={() => console.log('action')}>
          Perform Action
        </button>
      </section>

      <aside aria-label="Sidebar">
        <h2>Related Info</h2>
      </aside>

      <footer aria-label="Footer">
        <p>Footer content</p>
      </footer>
    </div>
  );
};

// Your main component that will render the primary content wrapped in <main>
const MainComponent = () => {
  return (
    <main>
      <PrimaryContent />
    </main>
  );
};

// Export both the legacy Node.js API and the new React component
module.exports = {
  renderPage,
  generateTableRows,
  MainComponent
};