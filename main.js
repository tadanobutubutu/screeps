// Assuming main.js is a React component
import React from 'react';

function DependencyGraph() {
  // You can directly render the HTML string or fetch it from a server
  // For this example, I'll use a string for simplicity
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dependency Graph</title>
    </head>
    <body>
      <!-- The content of the dependency-graph.html goes here -->
      <!-- ... -->
    </body>
    </html>
  `;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}

export default DependencyGraph;