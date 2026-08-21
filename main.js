// main.js

// This file handles the main application logic
// To fix the REACT_017 accessibility issue (missing <main> landmark),
// ensure that your HTML output wraps primary content in a <main> element

// Example structure that should be in your HTML files:

// docs/index.html should have content like:
const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation</title>
</head>
<body>
    <header>
        <!-- Header content -->
    </header>
    <main>
        <div class="container">
            <h2>Quality & Metrics Reports</h2>
            <p>
                This repository is fully optimized with automated tools. Explore the generated
                reports below:
            </p>
            <div class="links">
                <!-- Links content -->
            </div>
        </div>
    </main>
    <footer>
        <!-- Footer content -->
    </footer>
</body>
</html>`;

// Another file (e.g., docs/reports.html) should have:
const reportsHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reports</title>
</head>
<body>
    <header>
        <!-- Header content -->
    </header>
    <main>
        <table id="table-rotated">
            <!-- Table content -->
        </table>
    </main>
    <footer>
        <!-- Footer content -->
    </footer>
</body>
</html>`;

module.exports = { indexHTML, reportsHTML };