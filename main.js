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
  return html.replace(/<th(\s+[^>]*)?>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasScope = existingAttrs.includes('scope');
    const scopeAttr = hasScope ? '' : ' scope="col"';
    return `<th${existingAttrs}${scopeAttr}>`;
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
export function createDependencyGraphHTML(tableContent) {
  const updatedTableContent = addScopeToTableHeaders(tableContent);

  return createMainHTML({
    children: updatedTableContent,
    id: 'dependency_graph',
  });
}

// ... Rest of your existing code ...