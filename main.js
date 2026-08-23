// Main entry point for the application
const fs = require('fs');
const path = require('path');

// Simple static site generator for documentation
function generateIndexHtml() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation</title>
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
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
                <a href="/reports/complexity">Plato Code Complexity Report</a>
                <a href="/reports/dependencies">Dependency Graph</a>
            </div>
        </div>
    </main>
</body>
</html>`;
}

function generateTableHtml() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Table</title>
</head>
<body>
    <header>
        <h1>Data Dashboard</h1>
    </header>
    <main>
        <table id="table-rotated">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Item 1</td>
                    <td>100</td>
                </tr>
            </tbody>
        </table>
    </main>
</body>
</html>`;
}

function generatePage(title, content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
        </nav>
    </header>
    <main>
        ${content}
    </main>
</body>
</html>`;
}

// Export all functions
module.exports = {
    generateIndexHtml,
    generateTableHtml,
    generatePage
};

// Run if called directly
if (require.main === module) {
    const docsDir = path.join(__dirname, 'docs');
    
    // Ensure docs directory exists
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }
    
    // Generate HTML files
    fs.writeFileSync(
        path.join(docsDir, 'index.html'),
        generateIndexHtml()
    );
    
    fs.writeFileSync(
        path.join(docsDir, 'table.html'),
        generateTableHtml()
    );
    
    console.log('HTML files generated successfully!');
}