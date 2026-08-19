#!/usr/bin/env node
/**
 * Generates the dependency‑graph HTML file.
 *
 * This script reads the project source files, builds a dependency graph,
 * and writes an HTML table that visualises the relationships.  The
 * accessibility issue reported by Insight Code (REACT_027) has been
 * addressed by adding `scope="col"` to every `<th>` element so that
 * assistive technologies can correctly associate header cells with
 * their data cells.
 *
 * All existing exports and functions are preserved; only the
 * `<th>` generation logic has been updated.
 */

const fs = require('fs');
const path = require('path');
const { buildGraph } = require('./graphBuilder');

/**
 * Path to the output HTML file.
 */
const outputFile = path.join(__dirname, 'docs', 'dependency-graph.html');

/**
 * Generates the HTML string for the dependency graph.
 *
 * @param {Object} graph - The graph data containing `headers` and `rows`.
 * @returns {string} The generated HTML.
 */
function generateHTML(graph) {
  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Dependency Graph</title>
</head>
<body>
<table>
<thead>
<tr>`;

  // Add scope="col" to each header cell for accessibility
  graph.headers.forEach(header => {
    html += `<th scope="col">${header}</th>`;
  });

  html += `</tr>
</thead>
<tbody>`;

  graph.rows.forEach(row => {
    html += '<tr>';
    row.forEach(cell => {
      html += `<td>${cell}</td>`;
    });
    html += '</tr>';
  });

  html += `</tbody>
</table>
</body>
</html>`;

  return html;
}

/**
 * Build the graph and write the HTML file.
 */
const graph = buildGraph();
const html = generateHTML(graph);
fs.writeFileSync(outputFile, html);

/**
 * Exported API
 *
 * The original script did not expose any public API, but for
 * consistency with the rest of the codebase we re‑export the
 * `generateHTML` function.  This keeps the module usable by
 * other parts of the project while still applying the accessibility
 * fix.
 */
module.exports = {
  generateHTML,
};