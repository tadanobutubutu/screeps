// main.js
import React from 'react';
import ReactDOM from 'react-dom';

// Existing components and logic...

// Example component that might be causing the issue
function DependencyGraph() {
  // Component implementation...
}

// Existing test suite or other functions...

// Existing tests or other logic...

// New function or change requested in the issue
// This would be added to the main.js file to fix the issue
ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dependency Graph</title>
      </head>
      <body>
        <DependencyGraph />
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);

// Existing exports or other logic...