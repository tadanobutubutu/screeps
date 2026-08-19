// Assuming the original main.js generates the dependency-graph.html file
const fs = require('fs');

// ... other code ...

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dependency Graph</title>
  <!-- other head content -->
</head>
<body>
  <main role="main" aria-label="Dependency Graph">
    <!-- rest of the HTML content -->
    <table role="table" aria-label="Dependency Table">
      <!-- table content with proper headers and scope attributes -->
    </table>
    <nav aria-label="Main Navigation">
      <!-- navigation content -->
    </nav>
    <section aria-labelledby="graph-section">
      <h2 id="graph-section">Dependency Visualization</h2>
      <!-- graph content -->
    </section>
  </main>
</body>
</html>`;

fs.writeFileSync('docs/dependency-graph.html', htmlContent);