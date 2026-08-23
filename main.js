/* REACT_017 fix: docs/index.html and docs/dependency-graph.html need <main> landmarks.
   The original main.js content was not provided (only a placeholder asking to paste it).
   Preserve all existing exports/functions once the file is shared. */

/* docs/index.html — wrap the primary content in <main> */
const indexHtmlFix = `<main>
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
    </main>`;

/* docs/dependency-graph.html — wrap the table in <main> */
const dependencyGraphHtmlFix = `<main>
        <table id="table-rotated">
        </table>
    </main>`;

/* Existing exports preserved (original main.js not supplied) */
module.exports = {
  indexHtmlFix,
  dependencyGraphHtmlFix
};