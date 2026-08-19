// main.js - Generates the dependency-graph.html file
const fs = require('fs');
const path = require('path');

function generateDependencyGraph() {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dependency Graph</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
    }
    .graph-container {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .dependency-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .dependency-list li {
      padding: 4px 0;
    }
    .status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-ok { background: #d4edda; color: #155724; }
    .status-warning { background: #fff3cd; color: #856404; }
    .status-error { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <header role="banner">
    <div class="container">
      <h1>Dependency Graph</h1>
    </div>
  </header>

  <main role="main">
    <div class="container">
      <div class="graph-container">
        <table role="grid">
          <thead>
            <tr>
              <th scope="col">Package</th>
              <th scope="col">Version</th>
              <th scope="col">Status</th>
              <th scope="col">Dependencies</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>package-a</td>
              <td>1.0.0</td>
              <td><span class="status status-ok">OK</span></td>
              <td>
                <ul class="dependency-list" aria-label="Dependencies">
                  <li>lodash@4.17.21</li>
                  <li>express@4.18.2</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>package-b</td>
              <td>2.1.0</td>
              <td><span class="status status-warning">Warning</span></td>
              <td>
                <ul class="dependency-list" aria-label="Dependencies">
                  <li>axios@0.27.0</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>package-c</td>
              <td>3.0.0</td>
              <td><span class="status status-ok">OK</span></td>
              <td>
                <ul class="dependency-list" aria-label="Dependencies">
                  <li>react@18.2.0</li>
                  <li>react-dom@18.2.0</li>
                  <li>next@13.0.0</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav role="navigation" aria-label="Graph navigation">
        <h2>Legend</h2>
        <ul>
          <li><span class="status status-ok">OK</span> - All checks passed</li>
          <li><span class="status status-warning">Warning</span> - Some checks need attention</li>
          <li><span class="status status-error">Error</span> - Critical issues found</li>
        </ul>
      </nav>

      <section role="region" aria-labelledby="chart-title">
        <h2 id="chart-title">Dependency Visualization</h2>
        <svg width="100%" height="300" viewBox="0 0 800 300" role="img" aria-labelledby="svg-title svg-desc">
          <title id="svg-title">Dependency Graph Visualization</title>
          <desc id="svg-desc">A visual representation of the dependency relationships between packages A, B, and C</desc>
          
          <!-- Package nodes -->
          <g role="group" aria-label="Package A node">
            <circle cx="100" cy="100" r="40" fill="#4CAF50" />
            <text x="100" y="105" text-anchor="middle" fill="white" font-size="14">A</text>
          </g>
          
          <g role="group" aria-label="Package B node">
            <circle cx="400" cy="150" r="40" fill="#FFC107" />
            <text x="400" y="155" text-anchor="middle" fill="black" font-size="14">B</text>
          </g>
          
          <g role="group" aria-label="Package C node">
            <circle cx="700" cy="100" r="40" fill="#4CAF50" />
            <text x="700" y="105" text-anchor="middle" fill="white" font-size="14">C</text>
          </g>

          <!-- Connection lines -->
          <line x1="140" y1="100" x2="360" y2="150" stroke="#666" stroke-width="2" aria-hidden="true" />
          <line x1="440" y1="150" x2="660" y2="100" stroke="#666" stroke-width="2" aria-hidden="true" />
        </svg>
      </section>
    </div>
  </main>

  <footer role="contentinfo">
    <div class="container">
      <p>Last updated: ${new Date().toISOString()}</p>
    </div>
  </footer>
</body>
</html>`;

  const outputPath = path.join(__dirname, 'dependency-graph.html');
  fs.writeFileSync(outputPath, htmlContent, 'utf8');
  console.log(`Generated: ${outputPath}`);
}

// Export for testing
module.exports = { generateDependencyGraph };

// Run if executed directly
if (require.main === module) {
  generateDependencyGraph();
}