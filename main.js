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
  <!-- rest of the HTML content -->
  <button id="unrotate">rotate back</button>
  <!-- rest of the HTML content -->
</body>
</html>`;

fs.writeFileSync('dependency-graph.html', htmlContent);