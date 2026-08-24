// main.js
// This is the main entry point for the Screeps application.
// It exports a function that generates the page HTML, ensuring the primary
// content is wrapped in a <main> landmark for accessibility.

function generatePage() {
    // Primary content – the data table – should be inside <main>.
    const primaryContent = `
        <table id="table-rotated">
            <!-- Table rows will be populated dynamically -->
        </table>
    `;

    // Full HTML document with <main> wrapper around the primary content.
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Screeps Reports</title>
        </head>
        <body>
            <main>
                ${primaryContent}
            </main>
            <footer>
                <p>Quality & Metrics Reports</p>
                <div class="links">
                    <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
                    <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
                </div>
            </footer>
        </body>
        </html>
    `;

    // In the real application this HTML would be sent to the client or written to a file.
    // For now we simply return it.
    return html;
}

// Export the function so tests can import and verify it.
module.exports = { generatePage };