// Assuming you have some import statements here, they would look like this:
// import dependencyGraphContent from './docs/dependency-graph';
// import indexContent from './docs/index';

// Here's the updated main.js with the new changes:

export function getMainContent(page) {
  let content;

  switch (page) {
    case 'dependency-graph':
      content = `
        <main>
          <table id="table-rotated">
            <!-- Rest of the content from dependency-graph.html -->
          </table>
        </main>
      `;
      break;
    case 'index':
      content = `
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
      break;
    default:
      content = `
        <main>
          <!-- Default content or error message -->
        </main>
      `;
  }

  return content;
}

// The rest of your main.js code would go here