import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph.html'; // Hypothetical import to render the HTML

function App() {
  return (
    <div>
      {/* Other components */}
      <div dangerouslySetInnerHTML={{ __html: getDependencyGraphHtml() }} />
      {/* Other components */}
    </div>
  );
}

function getDependencyGraphHtml() {
  // Hypothetical function to get the HTML content
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dependency Graph</title>
    </head>
    <body>
      <!-- Content here -->
    </body>
    </html>
  `;
}

ReactDOM.render(<App />, document.getElementById('root'));