// main.js

// Generate HTML with proper landmarks
function generatePage() {
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
                <a href="/reports/complexity.html">Plato Code Complexity Report</a>
                <a href="/reports/dependencies.html">Dependency Graph</a>
            </div>
        </div>
    </main>
    <footer>
        <p>&copy; 2024 Your Organization</p>
    </footer>
</body>
</html>`;
}

// Export the function
module.exports = { generatePage };