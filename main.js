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
export function fixTableHeaders(html) {
  return html.replace(/<th([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasScope = existingAttrs.includes('scope=');
    const scopeAttr = hasScope ? '' : ' scope="col"';
    return `<th${existingAttrs ? ' ' + existingAttrs : ''}${scopeAttr}>`;
  });
}

// Function to add accessible names to SVG elements
export function addSvgAccessibles(html) {
  return html.replace(/<svg([^>]*)>/g, (match, attrs) => {
    const hasTitle = attrs.includes('aria-labelledby') || attrs.includes('aria-label');
    if (hasTitle) return match;
    const idMatch = attrs.match(/id="([^"]*)"/);
    const svgId = idMatch ? idMatch[1] : `svg-${Math.random().toString(36).substr(2, 9)}`;
    return `<svg${attrs} aria-labelledby="${svgId}-title">`;
  });
}

// Function to fix fake link issues (elements that look like links but aren't)
export function fixFakeLinks(html) {
  return html.replace(/<a(?!\s+href)[^>]*>([^<]*)<\/a>/g, (match, text) => {
    const cleanedText = text.trim();
    if (!cleanedText) return match;
    return `<button type="button" class="fake-link">${cleanedText}</button>`;
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
          <nav aria-label="Report links">
            <ul>
              <li><a href="/plato">Plato Code Complexity Report</a></li>
              <li><a href="/dependency-graph">Dependency Graph</a></li>
            </ul>
          </nav>
      </div>
    `,
    id: 'index',
  });
}

// Example of how to use the new function to create updated html for another specific page
export function createDependencyGraphHTML(dependencyData) {
  let tableRows = '';
  
  if (dependencyData && dependencyData.length > 0) {
    dependencyData.forEach(dep => {
      tableRows += `
        <tr>
          <td>${dep.name}</td>
          <td>${dep.version || 'N/A'}</td>
        </tr>
      `;
    });
  }

  const updatedTableContent = fixTableHeaders(`
    <section aria-labelledby="dep-graph-title">
      <h2 id="dep-graph-title">Dependency Graph</h2>
      <svg id="dependency-svg" viewBox="0 0 100 100" aria-labelledby="dependency-svg-title" role="img">
        <title id="dependency-svg-title">Dependency graph visualization showing package relationships</title>
        <!-- graph content -->
      </svg>
      <table>
        <caption>Package Dependencies</caption>
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </section>
  `);

  return createMainHTML({
    children: updatedTableContent,
    id: 'dependency_graph',
  });
}

// Function to ensure unique landmarks by adding descriptive aria-labels
export function ensureUniqueLandmarks(html) {
  let mainCount = 0;
  let navCount = 0;
  
  return html
    .replace(/<main([^>]*)>/g, (match, attrs) => {
      if (attrs.includes('aria-label')) return match;
      mainCount++;
      return `<main${attrs} aria-label="Main section ${mainCount}">`;
    })
    .replace(/<nav([^>]*)>/g, (match, attrs) => {
      if (attrs.includes('aria-label')) return match;
      navCount++;
      return `<nav${attrs} aria-label="Navigation ${navCount}">`;
    });
}

// ... Rest of your existing code ...