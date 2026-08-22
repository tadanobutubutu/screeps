// main.js - Fixed icons with aria-hidden="true" for decorative SVGs
const icons = {
  dashboard: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>'
  },
  app: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>'
  }
};
export default icons;

// ... Existing code ...

// Function to create main HTML with main landmark (improves accessibility)
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

        // Incorporate the table scope attribute fixing function
        ${fixTableHeaders(`<!-- existing body content -->`)}
      </body>
    </html>
  `;
}

// Function to fix table structure issues by adding scope attributes to th tags
// This improves accessibility by properly associating header cells with data cells
export function fixTableHeaders(html) {
  return html.replace(/<th([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasScope = existingAttrs.includes('scope');
    const scopeAttr = hasScope ? '' : ' scope="col"';
    const attrString = existingAttrs ? existingAttrs : '';
    return `<th${attrString}${scopeAttr}>`;
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
export function createDependencyGraphHTML(updatedTableContent) {
  // Incorporate the table scope attribute fixing function on the specific page
  return createMainHTML({
    children: fixTableHeaders(updatedTableContent),
    id: 'dependency_graph',
  });
}

// ... Rest of your existing code ...