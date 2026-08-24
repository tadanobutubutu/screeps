// This file handles the server-side rendering for the docs/index.html page
const fs = require('fs');
const path = require('path');

function generateTableRows(data) {
    let rows = '';
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        rows += `<tr>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.status}</td>
        </tr>`;
    }
    return rows;
}

function renderPage(data) {
    const tableRows = generateTableRows(data);
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screeps Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <header>
        <h1>Screeps Project</h1>
        <nav>
            <a href="/docs">Documentation</a>
            <a href="/api">API Reference</a>
        </nav>
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
                <a href="/graph">Dependency Graph</a>
            </div>
        </div>
        <table id="table-rotated">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    </main>
    <footer>
        <p>&copy; 2024 Screeps Project</p>
    </footer>
</body>
</html>`;
}

module.exports = { renderPage, generateTableRows };