/* eslint-disable no-console */
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// -----------------------------------------------------------------------------
// Existing components (unchanged)
// -----------------------------------------------------------------------------
function Header() {
  return <header>My Awesome Application</header>;
}

function Footer() {
  return <footer>© 2025 My Company</footer>;
}

// -----------------------------------------------------------------------------
// New helper: wrap primary content in a <main> landmark
// -----------------------------------------------------------------------------
/**
 * Wrap the given HTML string with a <main> element.
 * This satisfies the REACT_017 rule by providing a skip‑to‑content landmark.
 *
 * @param {string} html - The HTML fragment representing the primary page content.
 * @returns {string} The HTML fragment wrapped in <main>.
 */
function wrapMain(html) {
  return `<main>${html}</main>`;
}

// -----------------------------------------------------------------------------
// Existing page content generation (updated to use wrapMain)
// -----------------------------------------------------------------------------
function generatePageContent() {
  // This JSX represents the core, interactive part of the page.
  const primaryContent = (
    <>
      <table id="table-rotated">
        {/* Table rows generated dynamically */}
        <tr><td>Row 1</td></tr>
        <tr><td>Row 2</td></tr>
      </table>

      <div className="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
      </div>
    </>
  );

  // Convert the JSX tree to a static HTML string.
  const primaryHtml = ReactDOMServer.renderToStaticMarkup(primaryContent);

  // Wrap the primary HTML fragment in <main> to create the landmark.
  const wrappedHtml = wrapMain(primaryHtml);

  return wrappedHtml;
}

// -----------------------------------------------------------------------------
// Export the rendering function (preserved API)
// -----------------------------------------------------------------------------
export function renderApp(containerId = 'root') {
  const pageHtml = generatePageContent();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>My Application</title>
      </head>
      <body>
        ${pageHtml}
      </body>
    </html>
  `;
}

// -----------------------------------------------------------------------------
// Optional: expose utilities for tests (unchanged)
// -----------------------------------------------------------------------------
export const wrapMainBound = wrapMain; // exported for testability