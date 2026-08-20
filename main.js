const fs = require('fs');

// Generate dependency graph HTML with language attribute
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Dependency Graph</title>
  </head>
  <body>
    <svg>...</svg>
  </body>
</html>
`;

// Write to the target file
fs.writeFileSync('docs/dependency-graph.html', htmlContent);

module.exports = { htmlContent };