// Assuming main.js imports the React component that renders the HTML for `docs/dependency-graph.html`
import DependencyGraphComponent from './components/DependencyGraphComponent';

function App() {
  return (
    <div>
      {/* Existing code that renders the DependencyGraphComponent */}
      <DependencyGraphComponent />
    </div>
  );
}

export default App;

// To address the issue, you'll need to ensure the HTML element in `DependencyGraphComponent` has the `lang` attribute.
// Here's an example of how the component might look:

import React from 'react';

function DependencyGraphComponent() {
  return (
    // Existing HTML content, potentially using JSX
    <html>
      <head>
        <title>Dependency Graph</title>
      </head>
      <body>
        {/* Content of the dependency graph */}
      </body>
    </html>
  );
}

export default DependencyGraphComponent;