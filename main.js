// main.js
const fs = require('fs');
const path = require('path');

// Existing code (preserved)
function generateDependencyGraph() {
    // ... existing implementation ...
}

// Add the new table structure with proper scope attributes
function generateTableStructure() {
    return `
    <table>
        <thead>
            <tr>
                <th scope="col"><div>src/constants.js</div></th>
                <th scope="col"><div>src/managers/roomManager.js</div></th>
                <th scope="col"><div>src/managers/spawnManager.js</div></th>
                <th scope="col"><div>src/managers/towerManager.js</div></th>
                <th scope="col"><div>src/roles/builder.js</div></th>
                <!-- Add other columns with scope="col" as needed -->
            </tr>
        </thead>
        <tbody>
            <!-- Table body content -->
        </tbody>
    </table>
    `;
}

// Export all existing functions
module.exports = {
    generateDependencyGraph,
    generateTableStructure,
    // ... other existing exports ...
};

// Function to write the dependency graph to file
function writeDependencyGraph() {
    const graph = generateDependencyGraph();
    const table = generateTableStructure();

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Dependency Graph</title>
        <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            div { transform: rotate(-45deg); white-space: nowrap; }
        </style>
    </head>
    <body>
        <h1>Dependency Graph</h1>
        ${table}
        <div id="graph">${graph}</div>
    </body>
    </html>
    `;

    fs.writeFileSync(path.join(__dirname, 'docs', 'dependency-graph.html'), html);
}

// Call the function to generate the graph
writeDependencyGraph();