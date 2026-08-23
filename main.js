const fs = require('fs');
const path = require('path');

// Existing functions...
function generateIndex() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Index</title>
</head>
<body>
  <header>
    <h1>Quality & Metrics Reports</h1>
    <nav>...</nav>
  </header>
  <div class="container">
    <h2>Reports</h2>
    <p>Explore the generated reports below:</p>
    <div class="links">
      <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
      <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateDependencyGraph() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dependency Graph</title>
</head>
<body>
  <header>
    <h1>Dependency Graph</h1>
    <nav>...</nav>
  </header>
  <div class="container">
    <svg>...</svg>
  </div>
</body>
</html>
  `.trim();
}

// Helper to wrap primary content in a <main> landmark
function wrapInMain(html) {
  // Insert <main> just after <body> and close it before </body>
  return html.replace(/<body>/i, '<body><main>').replace(/<\/body>/i, '</main></body>');
}

// Updated generation functions to use the wrapper
function writeIndex() {
  const raw = generateIndex();
  const wrapped = wrapInMain(raw);
  fs.writeFileSync(path.join(__dirname, 'index.html'), wrapped);
}

function writeDependencyGraph() {
  const raw = generateDependencyGraph();
  const wrapped = wrapInMain(raw);
  fs.writeFileSync(path.join(__dirname, 'dependency-graph.html'), wrapped);
}

// Exports remain unchanged
module.exports = {
  generateIndex,
  generateDependencyGraph,
  writeIndex,
  writeDependencyGraph,
};