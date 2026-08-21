Below is the resolved `main.js` file, integrating both changes and addressing the Git merge conflict:

```javascript
// ... Existing code ...

// TODO: Address accessibility issues from insight report

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
export function fixTableStructure(content) {
  return content.replace(/<th(?:\s+([^>]*))?>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasScope = /scope\s*=/i.test(existingAttrs);
    const scopeAttr = hasScope ? '' : ' scope="col"';
    return `<th${existingAttrs ? ' ' + existingAttrs : ''}${scopeAttr}>`;
  });
}

// Example of how to use the new function to create updated html for a specific page
// Integrated changes from both branches to properly address accessibility issues for index and dependencyGraph pages
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
    `.replace(/<(th|td)/gi, (match) => fixTableStructure(match)), // Apply fixTableStructure function to entire content for index page
    id: 'index',
  });
}

// Example of how to use the new function to create updated html for another specific page
export function createDependencyGraphHTML(dependencyGraphContent) {
  const updatedTableContent = fixTableStructure(dependencyGraphContent);

  return createMainHTML({
    children: updatedTableContent,
    id: 'dependency_graph',
  });
}

// ... Rest of your existing code ...
```