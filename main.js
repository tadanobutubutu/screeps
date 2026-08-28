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

function getSvgAccessibleName(svgElement) {
    if (!svgElement || typeof svgElement !== 'object') {
        return '';
    }

    // Check for aria-label attribute (highest priority)
    const ariaLabel = svgElement.getAttribute ? svgElement.getAttribute('aria-label') : null;
    if (ariaLabel && typeof ariaLabel === 'string') {
        return ariaLabel.trim();
    }

    // Check for title element within the SVG
    if (svgElement.querySelector) {
        const titleElement = svgElement.querySelector('title');
        if (titleElement && titleElement.textContent) {
            return titleElement.textContent.trim();
        }
    }

    // Check for aria-labelledby attribute
    const ariaLabelledby = svgElement.getAttribute ? svgElement.getAttribute('aria-labelledby') : null;
    if (ariaLabelledby && typeof ariaLabelledby === 'string') {
        return ariaLabelledby.trim();
    }

    // Check for role="img" with accessible name
    const role = svgElement.getAttribute ? svgElement.getAttribute('role') : null;
    if (role === 'img') {
        const imgLabel = svgElement.getAttribute ? svgElement.getAttribute('aria-label') : null;
        if (imgLabel && typeof imgLabel === 'string') {
            return imgLabel.trim();
        }
    }

    return '';
}

module.exports = { generateHTML, getSvgAccessibleName };