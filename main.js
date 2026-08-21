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

// Function to fix table structure issues by adding scope attributes to th tags
// This improves accessibility by properly associating header cells with data cells
export function addScopeToTableHeaders(html) {
  return html.replace(/<th(?:\s+([^>]*))?>(?!.*scope=)/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const scopeAttr = existingAttrs.includes('scope="col"') || existingAttrs.includes("scope='col'")
      ? ''
      : ' scope="col"';
    return `<th${scopeAttr}${existingAttrs ? ' ' + existingAttrs : ''}>`;
  });
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
            <a href="/plato">Plato Code Complexity Report</a>
            <a href="/dependency-graph">Dependency Graph</a>
          </div>
      </div>
    `,
    id: 'index',
  });
}

// Example of how to use the new function to create updated html for another specific page
export function createDependencyGraphHTML() {
  const tableContent = `
      <!-- existing content without the main tag -->
      <!-- Add the scope attribute to the th tags in the table -->
      <table>
        <thead>
          <tr>
            <th>Package</th>
            <th>Version</th>
            <th>Dependencies</th>
            <th>Dependents</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          <!-- Table rows -->
        </tbody>
      </table>
      <!-- 21 further occurrences... -->
    `;

  return createMainHTML({
    children: addScopeToTableHeaders(tableContent),
    id: 'dependency_graph',
  });
}

// ... Rest of your existing code ...