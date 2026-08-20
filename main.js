// Existing code (preserved)
const path = require('path');
const fs = require('fs');
const { generateDependencyGraph } = require('./dependency-graph-generator');

// Main function to generate the dependency graph
function generateGraph() {
    const projectRoot = path.resolve(__dirname, '..');
    const graph = generateDependencyGraph(projectRoot);

    // Create the docs directory if it doesn't exist
    const docsDir = path.join(projectRoot, 'docs');
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir);
    }

    // Generate the HTML file
    const htmlContent = generateHTML(graph);
    fs.writeFileSync(path.join(docsDir, 'dependency-graph.html'), htmlContent);
    console.log('Dependency graph generated successfully!');
}

// Generate HTML content for the dependency graph
function generateHTML(graph) {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Dependency Graph</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .file-path { font-family: monospace; }
    </style>
</head>
<body>
    <h1>Project Dependency Graph</h1>
    <table>
        <thead>
            <tr>
                <th scope="col">Source File</th>
                <th scope="col">Dependencies</th>
            </tr>
        </thead>
        <tbody>`;

    for (const [file, deps] of Object.entries(graph)) {
        html += `
            <tr>
                <td class="file-path">${file}</td>
                <td>
                    <ul>
                        ${deps.map(dep => `<li class="file-path">${dep}</li>`).join('')}
                    </ul>
                </td>
            </tr>`;
    }

    html += `
        </tbody>
    </table>
</body>
</html>`;

    return html;
}

// Execute the graph generation
generateGraph();

// Export functions for testing
module.exports = {
    generateHTML,
    generateGraph
};