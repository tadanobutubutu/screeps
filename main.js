// ... Existing code ...

// New function to create main HTML with main landmark (new)
export function createMainHTML({ children, id }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <!-- existing head content -->
      </head>
      <body>
        <main id="${id}" aria-label="Main content">
          ${children}
        </main>
        <!-- existing body content -->
      </body>
    </html>
  `;
}

// Example of how to use the new function to create updated html for a specific page
export function createIndexHTML() {
  return createMainHTML({
    children: `
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
    `,
    id: 'index',
  });
}

// Example of how to use the new function to create updated html for another specific page
export function createDependencyGraphHTML() {
  return createMainHTML({
    children: `
      <!-- existing content without the main tag -->
    `,
    id: 'dependency_graph',
  });
}

// ... Rest of your existing code ...