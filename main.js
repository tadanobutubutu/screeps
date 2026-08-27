const fs = require('fs');
const path = require('path');

function generateHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quality & Metrics Reports</title>
</head>
<body>
    <header>
        <h1>Repository Dashboard</h1>
    </header>
    
    <main>
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
    </main>
    
    <main>
        <table id="table-rotated">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <!-- table content -->
            </tbody>
        </table>
    </main>
    
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>`;
}

module.exports = { generateHTML };
```