// Old code
import { imports, exports, exportDefaultFrom } from 'esm';

// New code
import { imports as esmImports, exports as esmExports, exportDefaultFrom as esmExportDefaultFrom } from 'esm';

// ... (include any existing code, exports, or functions you previously had in the main.js file)

// Modified dependency-graph.html content
const dependencyGraphHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- your existing head content -->
  </head>
  <body>
    <table>
      <!-- your existing table content -->
      <!-- Modified table headers -->
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Path</th>
          <!-- ... (include all other modified headers in the same format) -->
        </tr>
      </thead>
    </table>
    <!-- your existing script content -->
  </body>
</html>
`;

// Write the updated dependencyGraphHTML to a file
// Replace 'path/to/your.html' with the appropriate file path where you want to save the updated dependency-graph.html
const fs = require('fs');
fs.writeFileSync('path/to/your.html', dependencyGraphHTML);